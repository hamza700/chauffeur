'use client';

import type { IInvoice, IInvoiceTableFilters } from 'src/types/invoice';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { sumBy } from 'src/utils/helper';
import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { useMockedUser } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard';

import { InvoiceAnalytic } from '../invoice-analytic';
import { InvoiceTableRow } from '../invoice-table-row';
import { InvoiceTableToolbar } from '../invoice-table-toolbar';
import { InvoiceTableFiltersResult } from '../invoice-table-filters-result';

const mockOrders: IInvoice[] = [
  {
    id: '1',
    status: 'paid',
    totalAmount: 500,
    invoiceNumber: 'INV-001',
    items: [
      {
        id: 'item1',
        bookingNumber: 'BN123',
        date: '2023-01-01',
        driver: 'John Doe',
        pickupLocation: 'Location A',
        destination: 'Location B',
        total: 100,
      },
      {
        id: 'item2',
        bookingNumber: 'BN124',
        date: '2023-01-02',
        driver: 'Jane Smith',
        pickupLocation: 'Location C',
        destination: 'Location D',
        total: 200,
      },
      {
        id: 'item3',
        bookingNumber: 'BN125',
        date: '2023-01-03',
        driver: 'Robert Brown',
        pickupLocation: 'Location E',
        destination: 'Location F',
        total: 200,
      },
    ],
    invoiceTo: {
      name: 'Company ABC',
      company: 'Company ABC',
      fullAddress: '123 Street, City, Country',
      phoneNumber: '123456789',
    },
    invoiceFrom: {
      name: 'Company XYZ',
      company: 'Company ABC',
      fullAddress: '456 Avenue, City, Country',
      phoneNumber: '987654321',
    },
    createDate: '2023-01-01',
    dueDate: '2023-02-01',
  },
  {
    id: '2',
    status: 'pending',
    totalAmount: 500,
    invoiceNumber: 'INV-001',
    items: [
      {
        id: 'item1',
        bookingNumber: 'BN123',
        date: '2023-01-01',
        driver: 'John Doe',
        pickupLocation: 'Location A',
        destination: 'Location B',
        total: 100,
      },
      {
        id: 'item2',
        bookingNumber: 'BN124',
        date: '2023-01-02',
        driver: 'Jane Smith',
        pickupLocation: 'Location C',
        destination: 'Location D',
        total: 200,
      },
      {
        id: 'item3',
        bookingNumber: 'BN125',
        date: '2023-01-03',
        driver: 'Robert Brown',
        pickupLocation: 'Location E',
        destination: 'Location F',
        total: 200,
      },
    ],
    invoiceTo: {
      name: 'Company ABC',
      company: 'Company ABC',
      fullAddress: '123 Street, City, Country',
      phoneNumber: '123456789',
    },
    invoiceFrom: {
      name: 'Company XYZ',
      company: 'Company ABC',
      fullAddress: '456 Avenue, City, Country',
      phoneNumber: '987654321',
    },
    createDate: '2023-01-01',
    dueDate: '2023-02-01',
  },
  {
    id: '3',
    status: 'overdue',
    totalAmount: 500,
    invoiceNumber: 'INV-001',
    items: [
      {
        id: 'item1',
        bookingNumber: 'BN123',
        date: '2023-01-01',
        driver: 'John Doe',
        pickupLocation: 'Location A',
        destination: 'Location B',
        total: 100,
      },
      {
        id: 'item2',
        bookingNumber: 'BN124',
        date: '2023-01-02',
        driver: 'Jane Smith',
        pickupLocation: 'Location C',
        destination: 'Location D',
        total: 200,
      },
      {
        id: 'item3',
        bookingNumber: 'BN125',
        date: '2023-01-03',
        driver: 'Robert Brown',
        pickupLocation: 'Location E',
        destination: 'Location F',
        total: 200,
      },
    ],
    invoiceTo: {
      name: 'Company ABC',
      company: 'Company ABC',
      fullAddress: '123 Street, City, Country',
      phoneNumber: '123456789',
    },
    invoiceFrom: {
      name: 'Company XYZ',
      company: 'Company ABC',
      fullAddress: '456 Avenue, City, Country',
      phoneNumber: '987654321',
    },
    createDate: '2023-01-01',
    dueDate: '2023-02-01',
  },
];

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'invoiceNumber', label: 'Customer' },
  { id: 'createDate', label: 'Create' },
  { id: 'dueDate', label: 'Due' },
  { id: 'price', label: 'Amount' },
  { id: 'status', label: 'Status' },
  { id: '' },
];

// ----------------------------------------------------------------------

export function InvoiceListView() {
  const { user } = useMockedUser();

  const theme = useTheme();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<IInvoice[]>(mockOrders);

  const filters = useSetState<IInvoiceTableFilters>({
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

  const getInvoiceLength = (status: string) =>
    tableData.filter((item) => item.status === status).length;

  const getTotalAmount = (status: string) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      (invoice) => invoice.totalAmount
    );

  const getPercentByStatus = (status: string) =>
    (getInvoiceLength(status) / tableData.length) * 100;

  const TABS = [
    {
      value: 'all',
      label: 'All',
      color: 'default',
      count: tableData.length,
    },
    {
      value: 'paid',
      label: 'Paid',
      color: 'success',
      count: getInvoiceLength('paid'),
    },
    {
      value: 'pending',
      label: 'Pending',
      color: 'warning',
      count: getInvoiceLength('pending'),
    },
    {
      value: 'overdue',
      label: 'Overdue',
      color: 'error',
      count: getInvoiceLength('overdue'),
    },
  ] as const;

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.invoices.details(id));
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
    <>
      <DashboardContent>
        <RoleBasedGuard
          hasContent
          currentRole={user?.user_metadata?.roles}
          acceptRoles={['admin']}
          sx={{ py: 10 }}
        >
          <CustomBreadcrumbs
            heading="Invoice"
            links={[
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Invoice', href: paths.dashboard.invoices.root },
              { name: 'List' },
            ]}
            sx={{ mb: { xs: 3, md: 5 } }}
          />

          <Card sx={{ mb: { xs: 3, md: 5 } }}>
            <Scrollbar sx={{ minHeight: 108 }}>
              <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
                sx={{ py: 2 }}
              >
                <InvoiceAnalytic
                  title="Total"
                  total={tableData.length}
                  percent={100}
                  price={sumBy(tableData, (invoice) => invoice.totalAmount)}
                  icon="solar:bill-list-bold-duotone"
                  color={theme.vars.palette.info.main}
                />

                <InvoiceAnalytic
                  title="Paid"
                  total={getInvoiceLength('paid')}
                  percent={getPercentByStatus('paid')}
                  price={getTotalAmount('paid')}
                  icon="solar:file-check-bold-duotone"
                  color={theme.vars.palette.success.main}
                />

                <InvoiceAnalytic
                  title="Pending"
                  total={getInvoiceLength('pending')}
                  percent={getPercentByStatus('pending')}
                  price={getTotalAmount('pending')}
                  icon="solar:sort-by-time-bold-duotone"
                  color={theme.vars.palette.warning.main}
                />

                <InvoiceAnalytic
                  title="Overdue"
                  total={getInvoiceLength('overdue')}
                  percent={getPercentByStatus('overdue')}
                  price={getTotalAmount('overdue')}
                  icon="solar:bell-bing-bold-duotone"
                  color={theme.vars.palette.error.main}
                />
              </Stack>
            </Scrollbar>
          </Card>

          <Card>
            <Tabs
              value={filters.state.status}
              onChange={handleFilterStatus}
              sx={{
                px: 2.5,
                boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
              }}
            >
              {TABS.map((tab) => (
                <Tab
                  key={tab.value}
                  value={tab.value}
                  label={tab.label}
                  iconPosition="end"
                  icon={
                    <Label
                      variant={
                        ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                        'soft'
                      }
                      color={tab.color}
                    >
                      {tab.count}
                    </Label>
                  }
                />
              ))}
            </Tabs>

            <InvoiceTableToolbar
              filters={filters}
              dateError={dateError}
              onResetPage={table.onResetPage}
              tableData={tableData}
            />

            {canReset && (
              <InvoiceTableFiltersResult
                filters={filters}
                onResetPage={table.onResetPage}
                totalResults={dataFiltered.length}
                sx={{ p: 2.5, pt: 0 }}
              />
            )}

            <Box sx={{ position: 'relative' }}>
              <TableSelectedAction
                dense={table.dense}
                numSelected={table.selected.length}
                rowCount={dataFiltered.length}
                onSelectAllRows={(checked) => {
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((row) => row.id)
                  );
                }}
                action={
                  <Stack direction="row">
                    <Tooltip title="Delete">
                      <IconButton color="primary" onClick={confirm.onTrue}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                }
              />

              <Scrollbar sx={{ minHeight: 444 }}>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={dataFiltered.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        dataFiltered.map((row) => row.id)
                      )
                    }
                  />

                  <TableBody>
                    {dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row) => (
                        <InvoiceTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onViewRow={() => handleViewRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                        />
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
        </RoleBasedGuard>
      </DashboardContent>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  dateError: boolean;
  inputData: IInvoice[];
  filters: IInvoiceTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters, dateError }: ApplyFilterProps) {
  const { name, status, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (invoice) =>
        invoice.invoiceNumber.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        invoice.invoiceTo.company.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((invoice) => invoice.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((invoice) => fIsBetween(invoice.createDate, startDate, endDate));
    }
  }

  return inputData;
}
