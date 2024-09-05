'use client';

import type { IVehicleDocumentFields } from 'src/types/vehicle';

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

import { VehicleNewFolderDialog } from './vehicle-new-folder-dialog';

// ----------------------------------------------------------------------

export type VehicleDocumentsSchemaType = zod.infer<typeof VehicleDocumentsSchema>;

export const VehicleDocumentsSchema = zod.object({
  privateHireLicenseFiles: schemaHelper.files({
    message: { required_error: 'Private hire license is required!' },
  }),
  privateHireLicenseExpiry: schemaHelper.date({
    message: {
      required_error: 'Private hire license expiry date is required!',
    },
  }),
  motTestCertificateFiles: schemaHelper.files({
    message: { required_error: 'MOT test certificate is required!' },
  }),
  motTestCertificateExpiry: schemaHelper.date({
    message: {
      required_error: 'MOT test certificate expiry date is required!',
    },
  }),
  vehiclePicFile: schemaHelper.file({
    message: { required_error: 'Vehicle picture is required!' },
  }),
  vehicleInsuranceFiles: schemaHelper.files({
    message: { required_error: 'Vehicle insurance is required!' },
  }),
  vehicleInsuranceExpiry: schemaHelper.date({
    message: { required_error: 'Vehicle insurance expiry date is required!' },
  }),
  vehicleRegistrationFiles: schemaHelper.files({
    message: { required_error: 'Vehicle registration is required!' },
  }),
  leasingContractFiles: schemaHelper
    .files({ message: { required_error: 'Leasing contract is required!' } })
    .optional(),
});

// ----------------------------------------------------------------------

type Props = {
  currentVehicle?: IVehicleDocumentFields;
};

const FILE_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
];

export function VehicleDocuments({ currentVehicle }: Props) {
  const router = useRouter();
  const upload = useBoolean();

  const defaultValues = useMemo(
    () => ({
      privateHireLicenseFiles: currentVehicle?.privateHireLicenseUrls || [],
      privateHireLicenseExpiry: currentVehicle?.privateHireLicenseExpiryDate || null,
      motTestCertificateFiles: currentVehicle?.motTestCertificateUrls || [],
      motTestCertificateExpiry: currentVehicle?.motTestCertificateExpiryDate || null,
      vehiclePicFile: currentVehicle?.vehiclePicUrl || '',
      vehicleInsuranceFiles: currentVehicle?.vehicleInsuranceUrls || [],
      vehicleInsuranceExpiry: currentVehicle?.vehicleInsuranceExpiryDate || null,
      vehicleRegistrationFiles: currentVehicle?.vehicleRegistrationUrls || [],
      leasingContractFiles: currentVehicle?.leasingContractUrls || [],
    }),
    [currentVehicle]
  );

  const methods = useForm<VehicleDocumentsSchemaType>({
    mode: 'onSubmit', // explicitly set validation mode
    resolver: zodResolver(VehicleDocumentsSchema),
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
    if (currentVehicle) {
      reset(defaultValues);
    }
  }, [currentVehicle, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    console.log('Form submitted'); // Check if onSubmit is called
    console.log('Submitting data:', data); // Debug log for form data
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Documents updated successfully!');
      router.push(paths.dashboard.vehicle.root);
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
                <Typography variant="subtitle2">Vehicle Picture</Typography>
                {currentVehicle?.vehiclePicUrl && getStatusLabel(currentVehicle.vehiclePicStatus)}
              </Stack>
              {currentVehicle?.vehiclePicUrl && (
                <img
                  src={currentVehicle.vehiclePicUrl}
                  alt="Vehicle Pic"
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
                  onClick={() => handleDownload(currentVehicle?.vehiclePicUrl || '')}
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
                {currentVehicle?.privateHireLicenseStatus &&
                  getStatusLabel(currentVehicle.privateHireLicenseStatus)}
              </Stack>
              <Field.DatePicker
                name="privateHireLicenseExpiry"
                label="Expiry Date"
                sx={{ width: '50%' }}
              />
              <Stack direction="row" spacing={1.5}>
                {currentVehicle?.privateHireLicenseUrls.map((url, index) => (
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
                  onClick={() => handleDownload(currentVehicle?.privateHireLicenseUrls[0] || '')}
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
                <Typography variant="subtitle2">MOT Test Certificate</Typography>
                {currentVehicle?.motTestCertificateStatus &&
                  getStatusLabel(currentVehicle.motTestCertificateStatus)}
              </Stack>
              <Field.DatePicker
                name="motTestCertificateExpiry"
                label="Expiry Date"
                sx={{ width: '50%' }}
              />
              <Stack direction="row" spacing={1.5}>
                {currentVehicle?.motTestCertificateUrls.map((url, index) => (
                  <img
                    key={url + index}
                    src={url}
                    alt="MOT Test Certificate"
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
                  onClick={() => handleDownload(currentVehicle?.motTestCertificateUrls[0] || '')}
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
                <Typography variant="subtitle2">Vehicle Insurance</Typography>
                {currentVehicle?.vehicleInsuranceStatus &&
                  getStatusLabel(currentVehicle.vehicleInsuranceStatus)}
              </Stack>
              <Field.DatePicker
                name="vehicleInsuranceExpiry"
                label="Expiry Date"
                sx={{ width: '50%' }}
              />
              <Stack direction="row" spacing={1.5}>
                {currentVehicle?.vehicleInsuranceUrls.map((url, index) => (
                  <img
                    key={url + index}
                    src={url}
                    alt="Vehicle Insurance"
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
                  onClick={() => handleDownload(currentVehicle?.vehicleInsuranceUrls[0] || '')}
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
                <Typography variant="subtitle2">Vehicle Registration</Typography>
                {currentVehicle?.vehicleRegistrationStatus &&
                  getStatusLabel(currentVehicle.vehicleRegistrationStatus)}
              </Stack>
              <Stack direction="row" spacing={1.5}>
                {currentVehicle?.vehicleRegistrationUrls.map((url, index) => (
                  <img
                    key={url + index}
                    src={url}
                    alt="Vehicle Registration"
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
                  onClick={() => handleDownload(currentVehicle?.vehicleRegistrationUrls[0] || '')}
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

            {currentVehicle?.leasingContractUrls && (
              <>
                <Divider sx={{ my: 3 }} />
                <Stack spacing={1.5}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle2">Leasing Contract</Typography>
                    {currentVehicle?.leasingContractStatus &&
                      getStatusLabel(currentVehicle.leasingContractStatus)}
                  </Stack>
                  <Stack direction="row" spacing={1.5}>
                    {currentVehicle?.leasingContractUrls.map((url, index) => (
                      <img
                        key={url + index}
                        src={url}
                        alt="Leasing Contract"
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
                      onClick={() => handleDownload(currentVehicle?.leasingContractUrls?.[0] || '')}
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
              </>
            )}

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save changes
              </LoadingButton>
            </Stack>
          </Stack>
        </Card>
      </Form>

      <VehicleNewFolderDialog open={upload.value} onClose={upload.onFalse} />
    </>
  );
}
