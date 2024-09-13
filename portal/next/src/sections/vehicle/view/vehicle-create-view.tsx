'use client';

import { useTabs } from 'src/hooks/use-tabs';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { Iconify } from 'src/components/iconify';
import { VehicleNewEditForm } from '../vehicle-new-edit-form';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'vehicle',
    label: 'Vehicle Information',
    icon: <Iconify icon="solar:bus-bold" width={24} />,
  },
];

// ----------------------------------------------------------------------

export function VehicleCreateView() {
  const tabs = useTabs('vehicle');

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new vehicle"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Vehicles', href: paths.dashboard.vehicles.root },
          { name: 'New vehicle' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 3, md: 5 } }}>
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      {tabs.value === 'vehicle' && <VehicleNewEditForm />}
    </DashboardContent>
  );
}
