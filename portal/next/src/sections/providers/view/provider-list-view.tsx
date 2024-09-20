'use client';

import type { IProviderAccount, IProvidersTableFilters } from 'src/types/provider';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import { Tooltip, IconButton } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

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

import { ProviderTableRow } from '../provider-table-row';
import { ProviderTableToolbar } from '../provider-table-toolbar';
import { ProviderTableFiltersResult } from '../provider-table-filters-result';

// ----------------------------------------------------------------------

export const mockProviderList: IProviderAccount[] = [
  {
    id: '1',
    city: 'New York',
    email: 'john.doe@example.com',
    state: 'NY',
    address: '123 Main St',
    postCode: '10001',
    isVerified: true,
    formCompleted: true,
    phoneNumber: '+123456789',
    country: 'USA',
    companyName: 'Doe Inc.',
    companyRegistrationNumber: '123456',
    status: 'active',
    companyPrivateHireOperatorLicenseUrls: ['https://example.com/license1.jpg'],
    companyPrivateHireOperatorLicenseExpiryDate: '2024-01-01T00:00:00.000Z',
    companyPrivateHireOperatorLicenseStatus: 'approved',
    personalIDorPassportUrls: ['https://example.com/id1.jpg'],
    personalIDorPassportExpiryDate: '2024-01-01T00:00:00.000Z',
    personalIDorPassportStatus: 'approved',
    vatRegistrationCertificateUrls: ['https://example.com/vat1.jpg'],
    vatRegistrationCertificateExpiryDate: '2024-01-01T00:00:00.000Z',
    vatRegistrationCertificateStatus: 'approved',
  },
  {
    id: '2',
    city: 'Los Angeles',
    email: 'liam.doe@example.com',
    state: 'CA',
    address: '456 Elm St',
    postCode: '90001',
    isVerified: true,
    formCompleted: true,
    phoneNumber: '+123456789',
    country: 'USA',
    companyName: 'Liam Inc.',
    companyRegistrationNumber: '654321',
    status: 'active',
    companyPrivateHireOperatorLicenseUrls: ['https://example.com/license2.jpg'],
    companyPrivateHireOperatorLicenseExpiryDate: '2024-01-01T00:00:00.000Z',
    companyPrivateHireOperatorLicenseStatus: 'approved',
    personalIDorPassportUrls: ['https://example.com/id2.jpg'],
    personalIDorPassportExpiryDate: '2024-01-01T00:00:00.000Z',
    personalIDorPassportStatus: 'approved',
    vatRegistrationCertificateUrls: ['https://example.com/vat2.jpg'],
    vatRegistrationCertificateExpiryDate: '2024-01-01T00:00:00.000Z',
    vatRegistrationCertificateStatus: 'approved',
  },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'rejected', label: 'Rejected' },
];

const TABLE_HEAD = [
  { id: 'companyName', label: 'Company Name' },
  { id: 'email', label: 'Email' },
  { id: 'phoneNumber', label: 'Phone Number' },
  { id: 'city', label: 'City' },
  { id: 'state', label: 'State' },
  { id: 'address', label: 'Address' },
  { id: 'postCode', label: 'Post Code' },
  { id: 'country', label: 'Country' },
  { id: 'status', label: 'Status' },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function ProviderListView() {
  const { user } = useMockedUser();

  const table = useTable();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<IProviderAccount[]>(mockProviderList);

  const filters = useSetState<IProvidersTableFilters>({ companyName: '', status: 'all' });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset = !!filters.state.companyName || filters.state.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

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
        <RoleBasedGuard hasContent currentRole={user?.user_metadata?.role} acceptRoles={['admin']} sx={{ py: 10 }}>
          <CustomBreadcrumbs
            heading="Providers"
            links={[
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Providers', href: paths.dashboard.providers },
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
                        (tab.value === 'active' && 'success') ||
                        (tab.value === 'pending' && 'warning') ||
                        (tab.value === 'rejected' && 'error') ||
                        'default'
                      }
                    >
                      {['active', 'pending', 'rejected'].includes(tab.value)
                        ? tableData.filter((user) => user.status === tab.value).length
                        : tableData.length}
                    </Label>
                  }
                />
              ))}
            </Tabs>

            <ProviderTableToolbar
              filters={filters}
              onResetPage={table.onResetPage}
              tableData={tableData}
            />

            {canReset && (
              <ProviderTableFiltersResult
                filters={filters}
                totalResults={dataFiltered.length}
                onResetPage={table.onResetPage}
                sx={{ p: 2.5, pt: 0 }}
              />
            )}

            <Box sx={{ position: 'relative' }}>
              <TableSelectedAction
                dense={table.dense}
                numSelected={table.selected.length}
                rowCount={dataFiltered.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((row) => row.id)
                  )
                }
                action={
                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                }
              />

              <Scrollbar>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
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
                        <ProviderTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
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
  inputData: IProviderAccount[];
  filters: IProvidersTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { companyName, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (companyName) {
    inputData = inputData.filter((user) => {
      const fullName = user.companyName.toLowerCase();
      return fullName.includes(companyName.toLowerCase());
    });
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  return inputData;
}
