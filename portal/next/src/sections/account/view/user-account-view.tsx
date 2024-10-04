'use client';

import type { IProviderAccount } from 'src/types/provider';

import { useState, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';

import { transformProviderData } from 'src/utils/data-transformers';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useAuthContext } from 'src/auth/hooks';
import { getProviderById } from 'src/auth/context/supabase';

import { AccountGeneral } from '../account-general';
import { AccountDocuments } from '../account-documents';
import { AccountPaymentDetails } from '../account-payment-details';
// ----------------------------------------------------------------------

const TABS = [
  { value: 'general', label: 'General', icon: <Iconify icon="solar:user-id-bold" width={24} /> },
  {
    value: 'documents',
    label: 'Documents',
    icon: <Iconify icon="solar:file-text-bold" width={24} />,
  },
  { value: 'payment', label: 'Payment', icon: <Iconify icon="solar:card-bold" width={24} /> },
];

// ----------------------------------------------------------------------

export function AccountView() {
  const { user } = useAuthContext();
  const providerId = user?.id;
  const [currentProvider, setCurrentProvider] = useState<IProviderAccount | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const tabs = useTabs('general');

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const { data, error } = await getProviderById(providerId);
        if (error) {
          toast.error(error.message);
        } else {
          const transformedData = transformProviderData(data);
          setCurrentProvider(transformedData || undefined);
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [providerId]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Account"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.settings },
          { name: 'Account' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 3, md: 5 } }}>
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      {tabs.value === 'general' && <AccountGeneral currentProvider={currentProvider} />}

      {tabs.value === 'documents' && <AccountDocuments currentProvider={currentProvider} />}

      {tabs.value === 'payment' && <AccountPaymentDetails currentProvider={currentProvider} />}
    </DashboardContent>
  );
}
