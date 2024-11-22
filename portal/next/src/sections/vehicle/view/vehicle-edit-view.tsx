'use client';

import type { IVehicleItem } from 'src/types/vehicle';

import { useState, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';

import { transformVehicleData } from 'src/utils/data-transformers';

import { getDocument } from 'src/actions/documents';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useAuthContext } from 'src/auth/hooks';
import { getVehicleById } from 'src/auth/context/supabase';

import { VehicleDocuments } from '../vehicle-documents';
import { VehicleNewEditForm } from '../vehicle-new-edit-form';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'vehicle',
    label: 'Vehicle Information',
    icon: <Iconify icon="solar:bus-bold" width={24} />,
  },
  {
    value: 'documents',
    label: 'Documents',
    icon: <Iconify icon="solar:file-text-bold" width={24} />,
  },
];

// ----------------------------------------------------------------------

type Props = {
  vehicleId: string;
};

export function VehicleEditView({ vehicleId }: Props) {
  const { user } = useAuthContext();
  const [currentVehicle, setCurrentVehicle] = useState<IVehicleItem | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<{
    vehiclePicUrl?: string;
    privateHireLicenseUrls: string[];
    motTestCertificateUrls: string[];
    vehicleInsuranceUrls: string[];
    vehicleRegistrationUrls: string[];
    leasingContractUrls: string[];
  }>({
    vehiclePicUrl: '',
    privateHireLicenseUrls: [],
    motTestCertificateUrls: [],
    vehicleInsuranceUrls: [],
    vehicleRegistrationUrls: [],
    leasingContractUrls: [],
  });

  const tabs = useTabs('vehicle');

  useEffect(() => {
    const fetchVehicleAndDocuments = async () => {
      try {
        setLoading(true);

        const { data, error } = await getVehicleById(vehicleId);
        if (error) {
          toast.error(error.message);
          return;
        }

        const transformedData = transformVehicleData(data);
        setCurrentVehicle(transformedData || undefined);

        if (data) {
          try {
            const [
              vehiclePic,
              privateHireLicense,
              motTestCertificate,
              vehicleInsurance,
              vehicleRegistration,
              leasingContract,
            ] = await Promise.all([
              getDocument(
                data.provider_id,
                'vehicle_pic',
                0,
                user?.access_token || '',
                'vehicles',
                vehicleId
              ),
              getDocument(
                data.provider_id,
                'private_hire_license',
                0,
                user?.access_token || '',
                'vehicles',
                vehicleId
              ),
              getDocument(
                data.provider_id,
                'mot_certificate',
                0,
                user?.access_token || '',
                'vehicles',
                vehicleId
              ),
              getDocument(
                data.provider_id,
                'insurance',
                0,
                user?.access_token || '',
                'vehicles',
                vehicleId
              ),
              getDocument(
                data.provider_id,
                'registration',
                0,
                user?.access_token || '',
                'vehicles',
                vehicleId
              ),
              getDocument(
                data.provider_id,
                'leasing_contract',
                0,
                user?.access_token || '',
                'vehicles',
                vehicleId
              ),
            ]);

            setDocuments({
              vehiclePicUrl: vehiclePic?.[0] || '',
              privateHireLicenseUrls: privateHireLicense || [],
              motTestCertificateUrls: motTestCertificate || [],
              vehicleInsuranceUrls: vehicleInsurance || [],
              vehicleRegistrationUrls: vehicleRegistration || [],
              leasingContractUrls: leasingContract || [],
            });
          } catch (docError) {
            console.error('Error fetching documents:', docError);
            toast.error('Failed to fetch documents');
          }
        }
      } catch (err) {
        toast.error('Failed to fetch vehicle details');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleAndDocuments();
  }, [vehicleId, user]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Vehicles', href: paths.dashboard.vehicles.root },
          { name: `${currentVehicle?.model}` },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 3, md: 5 } }}>
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      {tabs.value === 'vehicle' && <VehicleNewEditForm currentVehicle={currentVehicle} />}
      {tabs.value === 'documents' && (
        <VehicleDocuments currentVehicle={currentVehicle} existingDocuments={documents} />
      )}
    </DashboardContent>
  );
}
