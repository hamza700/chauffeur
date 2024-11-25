'use client';

import type { IFile, IFileFilters } from 'src/types/file';

import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { supabase } from 'src/lib/supabase';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable, rowInPage, getComparator } from 'src/components/table';

import { useMockedUser } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard';

import { FileManagerTable } from '../file-manager-table';
import { FileManagerFilters } from '../file-manager-filters';
import { FileManagerFiltersResult } from '../file-manager-filters-result';

// ----------------------------------------------------------------------

interface IStorageFile extends IFile {
  providerId: string;
  chauffeurId?: string;
  vehicleId?: string;
  documentType: string;
  documentCategory: 'chauffeur' | 'vehicle' | 'provider';
  path: string;
}

export function FileManagerView() {
  const { user } = useMockedUser();

  const table = useTable({ defaultRowsPerPage: 10 });

  const openDateRange = useBoolean();

  const confirm = useBoolean();

  const upload = useBoolean();

  const [loading, setLoading] = useState(false);

  const [tableData, setTableData] = useState<IStorageFile[]>([]);

  const filters = useSetState<IFileFilters>({
    name: '',
    status: '',
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
    (!!filters.state.startDate && !!filters.state.endDate) ||
    !!filters.state.status;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteItem = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteItems = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const renderFilters = (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
    >
      <FileManagerFilters
        filters={filters}
        dateError={dateError}
        onResetPage={table.onResetPage}
        openDateRange={openDateRange.value}
        onOpenDateRange={openDateRange.onTrue}
        onCloseDateRange={openDateRange.onFalse}
        options={{ status: ['pending', 'rejected', 'approved'] }}
      />
    </Stack>
  );

  const renderResults = (
    <FileManagerFiltersResult
      filters={filters}
      totalResults={dataFiltered.length}
      onResetPage={table.onResetPage}
    />
  );

  useEffect(() => {
    const fetchAllDocuments = async () => {
      if (user?.user_metadata?.roles !== 'admin') {
        console.log('🚫 User is not admin, skipping fetch');
        return;
      }

      try {
        console.log('🚀 Starting document fetch process...');
        setLoading(true);
        const documents: IStorageFile[] = [];

        // Get all providers
        console.log('📂 Fetching providers list...');
        const { data: providers } = await supabase.storage.from('documents').list('providers');

        if (!providers) {
          console.log('❌ No providers found');
          return;
        }
        console.log(`✅ Found ${providers.length} providers`);

        // Fetch all data in parallel
        const providerDocuments = await Promise.all(
          providers.map(async (provider) => {
            const providerId = provider.name;
            console.log(`\n📍 Processing provider: ${providerId}`);
            const providerDocs: IStorageFile[] = [];

            // First, get provider-level documents
            console.log(`  📑 Fetching provider-level documents...`);
            const { data: providerFiles } = await supabase.storage
              .from('documents')
              .list(`providers/${providerId}`);

            if (providerFiles) {
              // Get files from each non-folder item
              const providerLevelDocs = await Promise.all(
                providerFiles
                  .filter((doc) => !['chauffeurs', 'vehicles'].includes(doc.name))
                  .map(async (doc) => {
                    // Get the actual files in this directory
                    const { data: files } = await supabase.storage
                      .from('documents')
                      .list(`providers/${providerId}/${doc.name}`);

                    // Get provider details
                    const { data: providerDetails } = await supabase
                      .from('providers')
                      .select('company_name')
                      .eq('id', providerId)
                      .single();

                    return (
                      files?.map((file) => ({
                        id: `${providerId}-${doc.name}-${file.name}`,
                        name: `${providerDetails?.company_name || 'Unknown Provider'} (${providerId}) - ${file.name}`,
                        size: file.metadata?.size || 0,
                        type: file.metadata?.mimetype || 'application/octet-stream',
                        createdAt: new Date(file.created_at),
                        modifiedAt: new Date(file.updated_at),
                        path: `providers/${providerId}/${doc.name}/${file.name}`,
                        documentType: doc.name,
                        documentCategory: 'provider' as const,
                        providerId,
                        status: 'approved',
                      })) || []
                    );
                  })
              );

              console.log(`  ✅ Found ${providerLevelDocs.flat().length} provider-level documents`);
              providerDocs.push(...providerLevelDocs.flat());
            }

            // Get chauffeur folders
            console.log(`  👥 Fetching chauffeur folders...`);
            const { data: chauffeurFolders } = await supabase.storage
              .from('documents')
              .list(`providers/${providerId}/chauffeurs`);

            if (chauffeurFolders) {
              console.log(`  ✅ Found ${chauffeurFolders.length} chauffeurs`);

              // Fetch all chauffeur documents in parallel
              const chauffeurPromises = chauffeurFolders.map(async (folder) => {
                const chauffeurId = folder.name;
                console.log(`    🔍 Processing chauffeur: ${chauffeurId}`);

                // Get chauffeur details and document folders in parallel
                const [chauffeurDetails, chauffeurFoldersResponse] = await Promise.all([
                  supabase
                    .from('chauffeurs')
                    .select('first_name, last_name')
                    .eq('id', chauffeurId)
                    .single(),
                  supabase.storage
                    .from('documents')
                    .list(`providers/${providerId}/chauffeurs/${chauffeurId}`),
                ]);

                // Get files from each folder
                const chauffeurDocs = await Promise.all(
                  (chauffeurFoldersResponse.data || []).map(async (docFolder) => {
                    const { data: files } = await supabase.storage
                      .from('documents')
                      .list(`providers/${providerId}/chauffeurs/${chauffeurId}/${docFolder.name}`);

                    return (
                      files?.map((file) => ({
                        id: `${providerId}-${chauffeurId}-${docFolder.name}-${file.name}`,
                        name: chauffeurDetails.data
                          ? `${chauffeurDetails.data.first_name} ${chauffeurDetails.data.last_name} (${chauffeurId}) - ${file.name}`
                          : `Chauffeur (${chauffeurId}) - ${file.name}`,
                        size: file.metadata?.size || 0,
                        type: file.metadata?.mimetype || 'application/octet-stream',
                        createdAt: new Date(file.created_at),
                        modifiedAt: new Date(file.updated_at),
                        path: `providers/${providerId}/chauffeurs/${chauffeurId}/${docFolder.name}/${file.name}`,
                        documentType: docFolder.name,
                        documentCategory: 'chauffeur' as const,
                        providerId,
                        chauffeurId,
                        status: 'approved',
                      })) || []
                    );
                  })
                );

                return chauffeurDocs.flat();
              });

              const chauffeurDocuments = await Promise.all(chauffeurPromises);
              providerDocs.push(...chauffeurDocuments.flat());
              console.log(`  ✅ Completed processing chauffeur documents`);
            }

            // Get vehicle folders
            console.log(`  🚗 Fetching vehicle folders...`);
            const { data: vehicleFolders } = await supabase.storage
              .from('documents')
              .list(`providers/${providerId}/vehicles`);

            if (vehicleFolders) {
              console.log(`  ✅ Found ${vehicleFolders.length} vehicles`);

              // Fetch all vehicle documents in parallel
              const vehiclePromises = vehicleFolders.map(async (folder) => {
                const vehicleId = folder.name;
                console.log(`    🔍 Processing vehicle: ${vehicleId}`);

                // Get vehicle details and document folders in parallel
                const [vehicleDetails, vehicleFoldersResponse] = await Promise.all([
                  supabase.from('vehicles').select('license_plate').eq('id', vehicleId).single(),
                  supabase.storage
                    .from('documents')
                    .list(`providers/${providerId}/vehicles/${vehicleId}`),
                ]);

                // Get files from each folder
                const vehicleDocs = await Promise.all(
                  (vehicleFoldersResponse.data || []).map(async (docFolder) => {
                    const { data: files } = await supabase.storage
                      .from('documents')
                      .list(`providers/${providerId}/vehicles/${vehicleId}/${docFolder.name}`);

                    return (
                      files?.map((file) => ({
                        id: `${providerId}-${vehicleId}-${docFolder.name}-${file.name}`,
                        name: vehicleDetails.data?.license_plate
                          ? `${vehicleDetails.data.license_plate} (${vehicleId}) - ${file.name}`
                          : `Vehicle (${vehicleId}) - ${file.name}`,
                        size: file.metadata?.size || 0,
                        type: file.metadata?.mimetype || 'application/octet-stream',
                        createdAt: new Date(file.created_at),
                        modifiedAt: new Date(file.updated_at),
                        path: `providers/${providerId}/vehicles/${vehicleId}/${docFolder.name}/${file.name}`,
                        documentType: docFolder.name,
                        documentCategory: 'vehicle' as const,
                        providerId,
                        vehicleId,
                        status: 'approved',
                      })) || []
                    );
                  })
                );

                return vehicleDocs.flat();
              });

              const vehicleDocuments = await Promise.all(vehiclePromises);
              providerDocs.push(...vehicleDocuments.flat());
              console.log(`  ✅ Completed processing vehicle documents`);
            }

            console.log(`✅ Completed processing provider: ${providerId}`);
            return providerDocs;
          })
        );

        // Flatten all documents into a single array
        const allDocuments = providerDocuments.flat();
        console.log(`\n🎉 Fetch complete! Total documents found: ${allDocuments.length}`);
        setTableData(allDocuments);
      } catch (error) {
        console.error('❌ Error fetching documents:', error);
        toast.error('Failed to fetch documents');
      } finally {
        setLoading(false);
        console.log('🏁 Document fetch process finished');
      }
    };

    fetchAllDocuments();
  }, [user?.user_metadata?.roles]);

  return (
    <>
      <DashboardContent>
        <RoleBasedGuard
          hasContent
          currentRole={user?.user_metadata?.roles}
          acceptRoles={['admin']}
          sx={{ py: 10 }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h4">Documents</Typography>
          </Stack>

          <Stack spacing={2.5} sx={{ my: { xs: 3, md: 5 } }}>
            {renderFilters}

            {canReset && renderResults}
          </Stack>

          {notFound ? (
            <EmptyContent filled sx={{ py: 10 }} />
          ) : (
            <FileManagerTable
              table={table}
              dataFiltered={dataFiltered}
              onDeleteRow={handleDeleteItem}
              notFound={notFound}
              onOpenConfirm={confirm.onTrue}
            />
          )}
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
              handleDeleteItems();
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
  inputData: IStorageFile[];
  filters: IFileFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters, dateError }: ApplyFilterProps) {
  const { name, startDate, endDate, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (file) => file.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((file) => fIsBetween(file.createdAt, startDate, endDate));
    }
  }

  if (status) {
    inputData = inputData.filter((file) => file.status === status);
  }

  return inputData;
}
