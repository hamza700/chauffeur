'use client';

import type { IUserDocumentFields } from 'src/types/user';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { UserNewFolderDialog } from './user-new-folder-dialog';

// ----------------------------------------------------------------------

export type UserDocumentsSchemaType = zod.infer<typeof UserDocumentsSchema>;

export const UserDocumentsSchema = zod.object({
  profilePicFile: schemaHelper.file({
    message: { required_error: 'Profile picture is required!' },
  }), // changed to singular
  driversLicenseFiles: schemaHelper.files({
    message: { required_error: "Driver's license is required!", minFiles: 1 },
  }), // ensuring at least 1 file is required
  privateHireLicenseFiles: schemaHelper.files({
    message: { required_error: 'Private hire license is required!', minFiles: 1 },
  }), // ensuring at least 1 file is required
  driversLicenseExpiry: schemaHelper.date({
    message: { required_error: "Driver's license expiry date is required!" },
  }),
  privateHireLicenseExpiry: schemaHelper.date({
    message: { required_error: 'Private hire license expiry date is required!' },
  }),
});

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUserDocumentFields;
};

const FILE_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
];

export function UserDocuments({ currentUser }: Props) {
  const router = useRouter();
  const upload = useBoolean();

  const defaultValues = useMemo(
    () => ({
      profilePicFile: currentUser?.profilePicUrl || '',
      driversLicenseFiles: currentUser?.driversLicenseUrls || [],
      privateHireLicenseFiles: currentUser?.privateHireLicenseUrls || [],
      driversLicenseExpiry: currentUser?.driversLicenseExpiryDate || null,
      privateHireLicenseExpiry: currentUser?.privateHireLicenseExpiryDate || null,
    }),
    [currentUser]
  );

  const methods = useForm<UserDocumentsSchemaType>({
    mode: 'onSubmit', // explicitly set validation mode
    resolver: zodResolver(UserDocumentsSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentUser) {
      reset(defaultValues);
    }
  }, [currentUser, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    console.log('Form submitted'); // Check if onSubmit is called
    console.log('Submitting data:', data); // Debug log for form data
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Documents updated successfully!');
      router.push(paths.dashboard.chauffeurs.root);
      console.info('DATA', data);
    } catch (error) {
      console.error('Error submitting form:', error); // Improved error handling
      toast.error('Failed to update documents. Please try again.');
    }
  });

  const handleDownload = (url: string) => {
    console.log('Downloading file:', url); // Debug log for download
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || 'download';
    link.click();
  };

  const getStatusLabel = (status: 'pending' | 'rejected' | 'approved') => {
    const statusOption = FILE_STATUS_OPTIONS.find((option) => option.value === status);
    const statusLabel = statusOption ? statusOption.label : 'Unknown status';
    const statusColor = statusOption
      ? (statusOption.color as 'default' | 'success' | 'warning' | 'error')
      : 'default';
    return (
      <Label variant="filled" color={statusColor}>
        {statusLabel}
      </Label>
    );
  };

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Typography variant="h6">Upload Documents</Typography>

            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle2">Profile Picture</Typography>
                {currentUser?.profilePicUrl && getStatusLabel(currentUser.profilePicStatus)}
              </Stack>
              {currentUser?.profilePicUrl && (
                <img
                  src={currentUser.profilePicUrl}
                  alt="Profile Pic"
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    marginRight: '8px',
                  }}
                />
              )}
              <Stack direction="row" alignItems="center" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="eva:cloud-download-fill" />}
                  onClick={() => handleDownload(currentUser?.profilePicUrl || '')}
                >
                  Download
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                  onClick={upload.onTrue}
                >
                  Upload
                </Button>
              </Stack>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle2">Driver&rsquo;s License</Typography>
                {currentUser?.driversLicenseStatus &&
                  getStatusLabel(currentUser.driversLicenseStatus)}
              </Stack>
              <Field.DatePicker
                name="driversLicenseExpiry"
                label="Expiry Date"
                sx={{ width: '50%' }}
              />
              <Stack direction="row" spacing={1.5}>
                {currentUser?.driversLicenseUrls.map((url, index) => (
                  <img
                    key={url + index}
                    src={url}
                    alt="Driver's License"
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '50%',
                    }}
                  />
                ))}
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="eva:cloud-download-fill" />}
                  onClick={() => handleDownload(currentUser?.driversLicenseUrls[0] || '')}
                >
                  Download
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                  onClick={upload.onTrue}
                >
                  Upload
                </Button>
              </Stack>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle2">Private Hire License</Typography>
                {currentUser?.privateHireLicenseStatus &&
                  getStatusLabel(currentUser.privateHireLicenseStatus)}
              </Stack>
              <Field.DatePicker
                name="privateHireLicenseExpiry"
                label="Expiry Date"
                sx={{ width: '50%' }}
              />
              <Stack direction="row" spacing={1.5}>
                {currentUser?.privateHireLicenseUrls.map((url, index) => (
                  <img
                    key={url + index}
                    src={url}
                    alt="Private Hire License"
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '50%',
                    }}
                  />
                ))}
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="eva:cloud-download-fill" />}
                  onClick={() => handleDownload(currentUser?.privateHireLicenseUrls[0] || '')}
                >
                  Download
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                  onClick={upload.onTrue}
                >
                  Upload
                </Button>
              </Stack>
            </Stack>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save changes
              </LoadingButton>
            </Stack>
          </Stack>
        </Card>
      </Form>

      <UserNewFolderDialog open={upload.value} onClose={upload.onFalse} />
    </>
  );
}
