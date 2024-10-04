'use client';

import type { IVehicleItem } from 'src/types/vehicle';

import { useState, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';

import { transformVehicleData } from 'src/utils/data-transformers';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

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
  const [currentVehicle, setCurrentVehicle] = useState<IVehicleItem | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const tabs = useTabs('vehicle');

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const { data, error } = await getVehicleById(vehicleId);
        if (error) {
          toast.error(error.message);
        } else {
          const transformedData = transformVehicleData(data);
          setCurrentVehicle(transformedData || undefined);
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Vehicles', href: paths.dashboard.vehicles.root },
          { name: `${currentVehicle?.brand} ${currentVehicle?.model}` },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 3, md: 5 } }}>
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      {tabs.value === 'vehicle' && <VehicleNewEditForm currentVehicle={currentVehicle} />}
      {tabs.value === 'documents' && <VehicleDocuments currentVehicle={currentVehicle} />}
    </DashboardContent>
  );
}
