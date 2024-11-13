'use client';

import type { IBookingItem, IAvailableJobsItem, IOrderTableFilters } from 'src/types/order';

import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useSetState } from 'src/hooks/use-set-state';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';
import { transformBookingData, transformAvailableJobsData } from 'src/utils/data-transformers';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { getBookings, getAvailableJobs } from 'src/auth/context/supabase/action';

import { OrderTableRow } from '../order-table-row';
import { OrderTableToolbar } from '../order-table-toolbar';
import { OrderTableFiltersResult } from '../order-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'offers', label: 'Offers' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
];

const TABLE_HEAD = [
  { id: 'orderNumber', label: 'Order Number', width: 88 },
  { id: 'date', label: 'Date', width: 140 },
  { id: 'bookingType', label: 'Booking Type', width: 140 },
  { id: 'pickupLocation', label: 'Pickup Location' },
  { id: 'dropoffLocation', label: 'Dropoff Location' },
  { id: 'serviceClass', label: 'Service Class' },
  { id: 'hours', label: 'Hours', width: 110 },
  { id: 'totalAmount', label: 'Price', width: 140 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function OrderListView() {
  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const router = useRouter();

  const [tableData, setTableData] = useState<(IAvailableJobsItem | IBookingItem)[]>([]);
  const [allData, setAllData] = useState<(IAvailableJobsItem | IBookingItem)[]>([]);

  const filters = useSetState<IOrderTableFilters>({
    name: '',
    status: 'offers',
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (filters.state.status === 'offers') {
          const { data: availableJobs } = await getAvailableJobs();
          if (availableJobs) {
            const transformedData = availableJobs.map(transformAvailableJobsData);
            setTableData(transformedData);
          }
        } else {
          const { data: bookings } = await getBookings();
          if (bookings) {
            const filteredBookings = bookings.filter(
              (booking) =>
                booking.status === (filters.state.status === 'upcoming' ? 'confirmed' : 'completed')
            );
            const transformedData = filteredBookings.map(transformBookingData);
            setTableData(transformedData);
          }
        }

        const [{ data: availableJobs }, { data: bookings }] = await Promise.all([
          getAvailableJobs(),
          getBookings(),
        ]);

        const allAvailableJobs = availableJobs ? availableJobs.map(transformAvailableJobsData) : [];
        const allBookings = bookings ? bookings.map(transformBookingData) : [];
        setAllData([...allAvailableJobs, ...allBookings]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [filters.state.status]);

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'offers' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.bookings.details(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Bookings"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Bookings', href: paths.dashboard.bookings.root },
          { name: 'List' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <Tabs
          value={filters.state.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          {STATUS_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
              icon={
                <Label
                  variant={tab.value === filters.state.status ? 'filled' : 'soft'}
                  color={
                    (tab.value === 'offers' && 'info') ||
                    (tab.value === 'upcoming' && 'warning') ||
                    (tab.value === 'completed' && 'success') ||
                    'default'
                  }
                >
                  {
                    allData.filter((item) => {
                      if (tab.value === 'offers') return !('status' in item);
                      if (tab.value === 'upcoming')
                        return 'status' in item && item.status === 'confirmed';
                      if (tab.value === 'completed')
                        return 'status' in item && item.status === 'completed';
                      return false;
                    }).length
                  }
                </Label>
              }
            />
          ))}
        </Tabs>

        <OrderTableToolbar
          filters={filters}
          onResetPage={table.onResetPage}
          dateError={dateError}
          tableData={tableData}
        />

        {canReset && (
          <OrderTableFiltersResult
            filters={filters}
            totalResults={dataFiltered.length}
            onResetPage={table.onResetPage}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <Box sx={{ position: 'relative' }}>
          <Scrollbar sx={{ minHeight: 444 }}>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered.length}
                onSort={table.onSort}
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <OrderTableRow key={row.id} row={row} onViewRow={() => handleViewRow(row.id)} />
                  ))}

                <TableEmptyRows
                  height={table.dense ? 56 : 56 + 20}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>

        <TablePaginationCustom
          page={table.page}
          dense={table.dense}
          count={dataFiltered.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onChangeDense={table.onChangeDense}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  dateError: boolean;
  inputData: (IAvailableJobsItem | IBookingItem)[];
  filters: IOrderTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters, dateError }: ApplyFilterProps) {
  const { status, name, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(name.toLowerCase()) ||
        order.pickupLocation.toLowerCase().includes(name.toLowerCase()) ||
        order.dropoffLocation.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status !== 'offers') {
    inputData = inputData.filter(
      (order) =>
        'status' in order && order.status === (status === 'upcoming' ? 'confirmed' : 'completed')
    );
  } else {
    inputData = inputData.filter((order) => !('status' in order));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) => fIsBetween(order.date, startDate, endDate));
    }
  }

  return inputData;
}
