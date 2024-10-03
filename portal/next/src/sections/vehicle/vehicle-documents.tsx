'use client';

import type { IVehicleDocumentFields, IVehicleItem } from 'src/types/vehicle';

import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useCallback } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { transformToVehicleData } from 'src/utils/data-transformers';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { updateVehicle } from 'src/auth/context/supabase';

// ----------------------------------------------------------------------

export type VehicleDocumentsSchemaType = zod.infer<typeof VehicleDocumentsSchema>;

export const VehicleDocumentsSchema = zod.object({
  vehiclePicUrl: schemaHelper.file({
    message: { required_error: 'Vehicle picture is required!' },
  }),
  privateHireLicenseUrls: schemaHelper.files({
    message: { required_error: 'Private hire license is required!', minFiles: 1 },
  }),
  motTestCertificateUrls: schemaHelper.files({
    message: { required_error: 'MOT test certificate is required!', minFiles: 1 },
  }),
  vehicleInsuranceUrls: schemaHelper.files({
    message: { required_error: 'Vehicle insurance is required!', minFiles: 1 },
  }),
  vehicleRegistrationUrls: schemaHelper.files({
    message: { required_error: 'Vehicle registration is required!', minFiles: 1 },
  }),
  leasingContractUrls: schemaHelper.files().optional(),
  privateHireLicenseExpiryDate: schemaHelper.date({
    message: { required_error: 'Private hire license expiry date is required!' },
  }),
  motTestCertificateExpiryDate: schemaHelper.date({
    message: { required_error: 'MOT test certificate expiry date is required!' },
  }),
  vehicleInsuranceExpiryDate: schemaHelper.date({
    message: { required_error: 'Vehicle insurance expiry date is required!' },
  }),
});

// ----------------------------------------------------------------------

type Props = {
  currentVehicle?: IVehicleItem;
};

const FILE_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
];

export function VehicleDocuments({ currentVehicle }: Props) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      vehiclePicUrl: currentVehicle?.documents?.vehiclePicUrl || '',
      privateHireLicenseUrls: currentVehicle?.documents?.privateHireLicenseUrls || [],
      motTestCertificateUrls: currentVehicle?.documents?.motTestCertificateUrls || [],
      vehicleInsuranceUrls: currentVehicle?.documents?.vehicleInsuranceUrls || [],
      vehicleRegistrationUrls: currentVehicle?.documents?.vehicleRegistrationUrls || [],
      leasingContractUrls: currentVehicle?.documents?.leasingContractUrls || [],
      privateHireLicenseExpiryDate: currentVehicle?.documents?.privateHireLicenseExpiryDate || null,
      motTestCertificateExpiryDate: currentVehicle?.documents?.motTestCertificateExpiryDate || null,
      vehicleInsuranceExpiryDate: currentVehicle?.documents?.vehicleInsuranceExpiryDate || null,
    }),
    [currentVehicle]
  );

  const methods = useForm<VehicleDocumentsSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(VehicleDocumentsSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    watch,
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentVehicle) {
      reset(defaultValues);
    }
  }, [currentVehicle, defaultValues, reset]);

  const handleRemoveFile = (inputFile: File | string, fieldName: keyof VehicleDocumentsSchemaType) => {
    const fieldValue = values[fieldName];
    if (Array.isArray(fieldValue)) {
      const filtered = fieldValue.filter((file) => file !== inputFile);
      setValue(fieldName, filtered, { shouldValidate: true });
    } else if (typeof fieldValue === 'string') {
      setValue(fieldName, null, { shouldValidate: true });
    }
  };

  const handleRemoveAllFiles = (fieldName: keyof VehicleDocumentsSchemaType) => {
    setValue(fieldName, [], { shouldValidate: true });
  };

  const handleDrop = useCallback(
    (files: File[], fieldName: keyof VehicleDocumentsSchemaType) => {
      const currentFiles = values[fieldName];
      const updatedFiles = Array.isArray(currentFiles) ? [...currentFiles, ...files] : files[0];
      setValue(fieldName, updatedFiles, { shouldValidate: true });
    },
    [setValue, values]
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await updateVehicle(currentVehicle.id, transformToVehicleData(data));
      toast.success('Documents updated successfully!');
      router.push(paths.dashboard.vehicles.root);
      console.info('Updated data:', data);
    } catch (error) {
      console.error('Error updating documents:', error);
      toast.error('Failed to update documents. Please try again.');
    }
  });

  return (
    <FormProvider {...methods}>
      <Form methods={methods} onSubmit={onSubmit}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Typography variant="h6">Upload Documents</Typography>

            <DocumentSection
              title="Vehicle Picture"
              fieldName="vehiclePicUrl"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onDrop={handleDrop}
              currentStatus={currentVehicle?.documents?.vehiclePicStatus || 'pending'}
            />

            <Divider sx={{ my: 3 }} />

            <DocumentSection
              title="Private Hire License"
              fieldName="privateHireLicenseUrls"
              expiryField="privateHireLicenseExpiryDate"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onDrop={handleDrop}
              currentStatus={currentVehicle?.documents?.privateHireLicenseStatus || 'pending'}
            />

            <Divider sx={{ my: 3 }} />

            <DocumentSection
              title="MOT Test Certificate"
              fieldName="motTestCertificateUrls"
              expiryField="motTestCertificateExpiryDate"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onDrop={handleDrop}
              currentStatus={currentVehicle?.documents?.motTestCertificateStatus || 'pending'}
            />

            <Divider sx={{ my: 3 }} />

            <DocumentSection
              title="Vehicle Insurance"
              fieldName="vehicleInsuranceUrls"
              expiryField="vehicleInsuranceExpiryDate"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onDrop={handleDrop}
              currentStatus={currentVehicle?.documents?.vehicleInsuranceStatus || 'pending'}
            />

            <Divider sx={{ my: 3 }} />

            <DocumentSection
              title="Vehicle Registration"
              fieldName="vehicleRegistrationUrls"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onDrop={handleDrop}
              currentStatus={currentVehicle?.documents?.vehicleRegistrationStatus || 'pending'}
            />

            <Divider sx={{ my: 3 }} />

            <DocumentSection
              title="Leasing Contract"
              fieldName="leasingContractUrls"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onDrop={handleDrop}
              currentStatus={currentVehicle?.documents?.leasingContractStatus || 'pending'}
            />

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save changes
              </LoadingButton>
            </Stack>
          </Stack>
        </Card>
      </Form>
    </FormProvider>
  );
}

type DocumentSectionProps = {
  title: string;
  fieldName: keyof VehicleDocumentsSchemaType;
  expiryField?: keyof VehicleDocumentsSchemaType;
  onRemove: (file: File | string, fieldName: keyof VehicleDocumentsSchemaType) => void;
  onRemoveAll: (fieldName: keyof VehicleDocumentsSchemaType) => void;
  onDrop: (files: File[], fieldName: keyof VehicleDocumentsSchemaType) => void;
  currentStatus?: 'pending' | 'approved' | 'rejected';
};

function DocumentSection({
  title,
  fieldName,
  expiryField,
  onRemove,
  onRemoveAll,
  onDrop,
  currentStatus,
}: DocumentSectionProps) {
  const { watch } = useFormContext<VehicleDocumentsSchemaType>();
  const fieldValue = watch(fieldName);

  const getStatusLabel = (status: 'pending' | 'rejected' | 'approved') => {
    const statusOption = FILE_STATUS_OPTIONS.find((option) => option.value === status);
    return statusOption ? (
      <Label variant="filled" color={statusOption.color as 'warning' | 'success' | 'error'}>
        {statusOption.label}
      </Label>
    ) : null;
  };

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="subtitle2">{title}</Typography>
        {currentStatus && getStatusLabel(currentStatus)}
      </Stack>
      {expiryField && (
        <Field.DatePicker name={expiryField} label="Expiry Date" sx={{ width: '50%' }} />
      )}
      <Field.Upload
        name={fieldName}
        multiple={fieldName !== 'vehiclePicUrl'}
        thumbnail
        onRemove={(file) => onRemove(file, fieldName)}
        onRemoveAll={() => onRemoveAll(fieldName)}
        onDrop={(files) => onDrop(files, fieldName)}
      />
    </Stack>
  );
}