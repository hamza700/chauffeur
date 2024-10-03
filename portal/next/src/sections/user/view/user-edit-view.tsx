'use client';

import type { IUserItem } from 'src/types/user';

import { useState, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';

import { transformChauffeurData } from 'src/utils/data-transformers';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { getChauffeurById } from 'src/auth/context/supabase';

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
  userId: string;
};

export function UserEditView({ userId }: Props) {
  const [currentUser, setCurrentUser] = useState<IUserItem | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tabs = useTabs('personal');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await getChauffeurById(userId);
        if (error) {
          setError(error.message);
        } else {
          const transformedData = transformChauffeurData(data);
          setCurrentUser(transformedData || undefined);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Chauffeurs', href: paths.dashboard.chauffeurs.root },
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
