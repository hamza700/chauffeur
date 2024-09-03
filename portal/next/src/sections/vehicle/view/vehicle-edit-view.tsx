'use client';

import { useTabs } from 'src/hooks/use-tabs';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import type { IVehicleItem } from 'src/types/vehicle';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { Iconify } from 'src/components/iconify';
import { VehicleNewEditForm } from '../vehicle-new-edit-form';
import { VehicleDocuments } from '../vehicle-documents';

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
  vehicle?: IVehicleItem;
};

export function VehicleEditView({ vehicle: currentVehicle }: Props) {
  const tabs = useTabs('vehicle');

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Vehicles', href: paths.dashboard.vehicle.root },
          //   { name: `${currentUser?.firstName} ${currentUser?.lastName}` },
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
