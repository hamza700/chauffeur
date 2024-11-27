'use client';

import type { IUserItem } from 'src/types/user';

import { useState, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';

import { transformChauffeurData } from 'src/utils/data-transformers';

import { getDocument } from 'src/actions/documents';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useAuthContext } from 'src/auth/hooks';
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
  const { user } = useAuthContext();
  const [currentUser, setCurrentUser] = useState<IUserItem | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<{
    profilePicUrl?: string;
    driversLicenseUrls: string[];
    privateHireLicenseUrls: string[];
  }>({
    profilePicUrl: '',
    driversLicenseUrls: [],
    privateHireLicenseUrls: [],
  });
  
  const tabs = useTabs('personal');

  useEffect(() => {
    const fetchUserAndDocuments = async () => {
      try {
        setLoading(true);

        // Fetch user data
        const { data, error } = await getChauffeurById(userId);
        if (error) {
          toast.error(error.message);
          return;
        }

        const transformedData = transformChauffeurData(data);
        setCurrentUser(transformedData || undefined);

        // Fetch documents if we have user data
        if (data) {
          try {
            const [profilePics, driversLicenses, privateHireLicenses] = await Promise.all([
              getDocument(
                data.provider_id,
                'profile_pic',
                0,
                user?.access_token || '',
                'chauffeurs',
                userId
              ),
              getDocument(
                data.provider_id,
                'drivers_license',
                0,
                user?.access_token || '',
                'chauffeurs',
                userId
              ),
              getDocument(
                data.provider_id,
                'private_hire_license',
                0,
                user?.access_token || '',
                'chauffeurs',
                userId
              ),
            ]);

            setDocuments({
              profilePicUrl: profilePics?.[0] || '',
              driversLicenseUrls: driversLicenses || [],
              privateHireLicenseUrls: privateHireLicenses || [],
            });
          } catch (docError) {
            console.error('Error fetching documents:', docError);
            toast.error('Failed to fetch documents');
          }
        }
      } catch (err) {
        toast.error('Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndDocuments();
  }, [userId, user]);

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

      {tabs.value === 'personal' && (
        <UserNewEditForm currentUser={currentUser} profilePicUrl={documents.profilePicUrl} />
      )}
      {tabs.value === 'documents' && (
        <UserDocuments
          currentUser={currentUser} 
          existingDocuments={documents}
        />
      )}
    </DashboardContent>
  );
}
