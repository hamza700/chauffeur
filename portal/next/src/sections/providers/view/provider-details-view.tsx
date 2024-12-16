'use client';

import type { IProviderAccount } from 'src/types/provider';

import { toast } from 'sonner';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';

import { transformProviderData } from 'src/utils/data-transformers';

import { getDocument } from 'src/actions/documents';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useAuthContext } from 'src/auth/hooks';
import { getProviderById } from 'src/auth/context/supabase/action';

import { ProviderGeneral } from '../provider-general';
import { ProviderDocuments } from '../provider-documents';
import { ProviderPaymentDetails } from '../provider-payment-details';

const TABS = [
  {
    value: 'general',
    label: 'General',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'documents',
    label: 'Documents',
    icon: <Iconify icon="solar:file-text-bold" width={24} />,
  },
  {
    value: 'payment',
    label: 'Payment',
    icon: <Iconify icon="solar:card-bold" width={24} />,
  },
];

type Props = {
  providerId: string;
};

export function ProviderDetailsView({ providerId }: Props) {
  const { user } = useAuthContext();
  const [currentProvider, setCurrentProvider] = useState<IProviderAccount | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState({
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
      <CustomBreadcrumbs
        heading="Provider Details"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Providers', href: paths.dashboard.providers.root },
          { name: currentProvider?.companyName || '' },
        ]}
      />

      <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 3, md: 5 } }}>
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      {tabs.value === 'general' && (
        <ProviderGeneral currentProvider={currentProvider} onRefetch={fetchProviderAndDocuments} />
      )}

      {tabs.value === 'documents' && (
        <ProviderDocuments
          currentProvider={currentProvider}
          existingDocuments={documents}
          onRefetch={fetchProviderAndDocuments}
        />
      )}

      {tabs.value === 'payment' && (
        <ProviderPaymentDetails
          currentProvider={currentProvider}
          onRefetch={fetchProviderAndDocuments}
        />
      )}
    </DashboardContent>
  );
}
