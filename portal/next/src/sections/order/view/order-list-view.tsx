'use client';

import type { IOrderItem, IOrderTableFilters } from 'src/types/order';

import { useState, useCallback } from 'react';

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

import { OrderTableRow } from '../order-table-row';
import { OrderTableToolbar } from '../order-table-toolbar';
import { OrderTableFiltersResult } from '../order-table-filters-result';

// ----------------------------------------------------------------------

const mockOrders: IOrderItem[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    date: new Date('2023-07-01').toISOString(),
    pickupLocation: 'Location A',
    dropoffLocation: 'Location B',
    serviceClass: 'Economy',
    totalAmount: 100,
    status: 'offers',
    customer: {
      id: 'c1',
      name: 'John Doe',
    },
    history: {
      timeline: [
        {
          title: 'En route to the pickup location',
          time: new Date('2023-07-01T07:42:00').toISOString(),
        },
        { title: 'Pickup location reached', time: new Date('2023-07-01T08:29:00').toISOString() },
      ],
    },
    distance: 10,
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    date: new Date('2023-07-05').toISOString(),
    pickupLocation: 'Location C',
    dropoffLocation: 'Location D',
    serviceClass: 'Business',
    totalAmount: 200,
    status: 'upcoming',
    customer: {
      id: 'c2',
      name: 'Jane Smith',
    },
    history: {
      timeline: [
        {
          title: 'En route to the pickup location',
          time: new Date('2023-07-05T07:42:00').toISOString(),
        },
        { title: 'Pickup location reached', time: new Date('2023-07-05T08:29:00').toISOString() },
      ],
    },
    distance: 15,
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    date: new Date('2023-07-10').toISOString(),
    pickupLocation: 'Location E',
    dropoffLocation: 'Location F',
    serviceClass: 'First Class',
    totalAmount: 300,
    status: 'completed',
    customer: {
      id: 'c3',
      name: 'Alice Johnson',
    },
    history: {
      timeline: [
        {
          title: 'En route to the pickup location',
          time: new Date('2023-07-10T07:42:00').toISOString(),
        },
        { title: 'Pickup location reached', time: new Date('2023-07-10T08:29:00').toISOString() },
      ],
    },
    distance: 20,
  },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'offers', label: 'Offers' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
];

const TABLE_HEAD = [
  { id: 'orderNumber', label: 'Order Number', width: 88 },
  { id: 'date', label: 'Date', width: 140 },
  { id: 'pickupLocation', label: 'Pickup Location' },
  { id: 'dropoffLocation', label: 'Dropoff Location' },
  { id: 'serviceClass', label: 'Service Class' },
  { id: 'totalAmount', label: 'Price', width: 140 },
  { id: 'status', label: 'Status', width: 110 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function OrderListView() {
  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const router = useRouter();

  const [tableData, setTableData] = useState<IOrderItem[]>(mockOrders);

  const filters = useSetState<IOrderTableFilters>({
    name: '',
    status: 'all',
    startDate: null,
    endDate: null,
  });

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
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.booking.details(id));
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
          { name: 'Bookings', href: paths.dashboard.booking.root },
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
                  variant={
                    ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                    'soft'
                  }
                  color={
                    (tab.value === 'offers' && 'info') ||
                    (tab.value === 'upcoming' && 'warning') ||
                    (tab.value === 'completed' && 'success') ||
                    'default'
                  }
                >
                  {['offers', 'upcoming', 'completed'].includes(tab.value)
                    ? tableData.filter((user) => user.status === tab.value).length
                    : tableData.length}
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
  inputData: IOrderItem[];
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

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) => fIsBetween(order.date, startDate, endDate));
    }
  }

  return inputData;
}
