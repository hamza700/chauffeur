'use client';

import type { IProviderAccount } from 'src/types/provider';

import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';

import { transformProviderData } from 'src/utils/data-transformers';

import { getDocument } from 'src/actions/documents';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard';
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
  const [documents, setDocuments] = useState<{
    companyPrivateHireOperatorLicenseFiles: string[];
    personalIDorPassportFiles: string[];
    vatRegistrationCertificateFiles: string[];
  }>({
    companyPrivateHireOperatorLicenseFiles: [],
    personalIDorPassportFiles: [],
    vatRegistrationCertificateFiles: [],
  });

  const tabs = useTabs('general');

  const fetchProviderAndDocuments = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch provider data
      const { data, error } = await getProviderById(providerId);
      if (error) {
        toast.error(error.message);
        return;
      }

      const transformedData = transformProviderData(data);
      setCurrentProvider(transformedData || undefined);

      // Fetch documents if we have provider data
      if (data) {
        try {
          const [operatorLicense, personalID, vatCertificate] = await Promise.all([
            getDocument(data.id, 'company_private_hire_license', 0, user?.access_token || ''),
            getDocument(data.id, 'proof_of_id', 0, user?.access_token || ''),
            getDocument(data.id, 'vat_registration', 0, user?.access_token || ''),
          ]);

          setDocuments({
            companyPrivateHireOperatorLicenseFiles: operatorLicense || [],
            personalIDorPassportFiles: personalID || [],
            vatRegistrationCertificateFiles: vatCertificate || [],
          });
        } catch (docError) {
          console.error('Error fetching documents:', docError);
          toast.error('Failed to fetch documents');
        }
      }
    } catch (err) {
      toast.error('Failed to fetch provider details');
    } finally {
      setLoading(false);
    }
  }, [providerId, user]);

  useEffect(() => {
    fetchProviderAndDocuments();
  }, [fetchProviderAndDocuments]);

  return (
    <DashboardContent>
      <RoleBasedGuard
        hasContent
        currentRole={user?.user_metadata?.roles}
        acceptRoles={['provider']}
        sx={{ py: 10 }}
      >
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

        {tabs.value === 'general' && (
          <AccountGeneral currentProvider={currentProvider} onRefetch={fetchProviderAndDocuments} />
        )}

        {tabs.value === 'documents' && (
          <AccountDocuments
            currentProvider={currentProvider}
            existingDocuments={documents}
            onRefetch={fetchProviderAndDocuments}
          />
        )}

        {tabs.value === 'payment' && (
          <AccountPaymentDetails
            currentProvider={currentProvider}
            onRefetch={fetchProviderAndDocuments}
          />
        )}
      </RoleBasedGuard>
    </DashboardContent>
  );
}
