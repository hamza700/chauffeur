'use client';

import type { IProviderAccount } from 'src/types/user';

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

import { AccountNewFolderDialog } from './account-new-folder-dialog';

// ----------------------------------------------------------------------

export type UserDocumentsSchemaType = zod.infer<typeof UserDocumentsSchema>;

export const UserDocumentsSchema = zod.object({
  companyPrivateHireOperatorLicenseFiles: schemaHelper.files({
    message: { required_error: 'Private hire operator license is required!', minFiles: 1 },
  }),
  personalIDorPassportFiles: schemaHelper.files({
    message: { required_error: 'Personal ID or passport is required!', minFiles: 1 },
  }),
  vatRegistrationCertificateFiles: schemaHelper.files({
    message: { required_error: 'VAT registration certificate is required!', minFiles: 1 },
  }),
  companyPrivateHireOperatorLicenseExpiry: schemaHelper.date({
    message: { required_error: 'Private hire operator license expiry date is required!' },
  }),
  personalIDorPassportExpiry: schemaHelper.date({
    message: { required_error: 'Personal ID or passport expiry date is required!' },
  }),
  vatRegistrationCertificateExpiry: schemaHelper.date({
    message: { required_error: 'VAT registration certificate expiry date is required!' },
  }),
});

// ----------------------------------------------------------------------

type Props = {
  currentProvider?: IProviderAccount;
};

const FILE_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
];

export function AccountDocuments({ currentProvider }: Props) {
  const router = useRouter();
  const upload = useBoolean();

  const defaultValues = useMemo(
    () => ({
      companyPrivateHireOperatorLicenseFiles:
        currentProvider?.companyPrivateHireOperatorLicenseUrls || [],
      personalIDorPassportFiles: currentProvider?.personalIDorPassportUrls || [],
      vatRegistrationCertificateFiles: currentProvider?.vatRegistrationCertificateUrls || [],
      companyPrivateHireOperatorLicenseExpiry:
        currentProvider?.companyPrivateHireOperatorLicenseExpiryDate || null,
      personalIDorPassportExpiry: currentProvider?.personalIDorPassportExpiryDate || null,
      vatRegistrationCertificateExpiry:
        currentProvider?.vatRegistrationCertificateExpiryDate || null,
    }),
    [currentProvider]
  );

  const methods = useForm<UserDocumentsSchemaType>({
    mode: 'onSubmit',
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
    if (currentProvider) {
      reset(defaultValues);
    }
  }, [currentProvider, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    console.log('Form submitted');
    console.log('Submitting data:', data);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Documents updated successfully!');
      router.push(paths.dashboard.providers.root);
      console.info('DATA', data);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to update documents. Please try again.');
    }
  });

  const handleDownload = (url: string) => {
    console.log('Downloading file:', url);
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
                <Typography variant="subtitle2">Company Private Hire Operator License</Typography>
                {currentProvider?.companyPrivateHireOperatorLicenseStatus &&
                  getStatusLabel(currentProvider.companyPrivateHireOperatorLicenseStatus)}
              </Stack>
              <Field.DatePicker
                name="companyPrivateHireOperatorLicenseExpiry"
                label="Expiry Date"
                sx={{ width: '50%' }}
              />
              <Stack direction="row" spacing={1.5}>
                {currentProvider?.companyPrivateHireOperatorLicenseUrls.map((url, index) => (
                  <img
                    key={url + index}
                    src={url}
                    alt="Private Hire Operator License"
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
                  onClick={() =>
                    handleDownload(currentProvider?.companyPrivateHireOperatorLicenseUrls[0] || '')
                  }
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
                <Typography variant="subtitle2">Personal ID or Passport</Typography>
                {currentProvider?.personalIDorPassportStatus &&
                  getStatusLabel(currentProvider.personalIDorPassportStatus)}
              </Stack>
              <Field.DatePicker
                name="personalIDorPassportExpiry"
                label="Expiry Date"
                sx={{ width: '50%' }}
              />
              <Stack direction="row" spacing={1.5}>
                {currentProvider?.personalIDorPassportUrls.map((url, index) => (
                  <img
                    key={url + index}
                    src={url}
                    alt="Personal ID or Passport"
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
                  onClick={() => handleDownload(currentProvider?.personalIDorPassportUrls[0] || '')}
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
                <Typography variant="subtitle2">VAT Registration Certificate</Typography>
                {currentProvider?.vatRegistrationCertificateStatus &&
                  getStatusLabel(currentProvider.vatRegistrationCertificateStatus)}
              </Stack>
              <Field.DatePicker
                name="vatRegistrationCertificateExpiry"
                label="Expiry Date"
                sx={{ width: '50%' }}
              />
              <Stack direction="row" spacing={1.5}>
                {currentProvider?.vatRegistrationCertificateUrls.map((url, index) => (
                  <img
                    key={url + index}
                    src={url}
                    alt="VAT Registration Certificate"
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
                  onClick={() =>
                    handleDownload(currentProvider?.vatRegistrationCertificateUrls[0] || '')
                  }
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

      <AccountNewFolderDialog open={upload.value} onClose={upload.onFalse} />
    </>
  );
}
