'use client';

import type { IUserItem } from 'src/types/user';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserDocuments } from '../user-documents';
import { UserNewEditForm } from '../user-new-edit-form';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'personal',
    label: 'Personal Information',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'documents',
    label: 'Documents',
    icon: <Iconify icon="solar:file-text-bold" width={24} />,
  },
];

// ----------------------------------------------------------------------

type Props = {
  user?: IUserItem;
};

export function UserEditView({ user: currentUser }: Props) {
  const tabs = useTabs('personal');

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Chauffeurs', href: paths.dashboard.chauffeur.root },
          { name: `${currentUser?.firstName} ${currentUser?.lastName}` },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 3, md: 5 } }}>
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      {tabs.value === 'personal' && <UserNewEditForm currentUser={currentUser} />}
      {tabs.value === 'documents' && <UserDocuments currentUser={currentUser} />}
    </DashboardContent>
  );
}
