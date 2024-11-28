'use client';

import type { IVehicleItem } from 'src/types/vehicle';

import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useCallback } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { uploadDocuments } from 'src/actions/documents';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { updateVehicle } from 'src/auth/context/supabase';

// ----------------------------------------------------------------------

export type VehicleDocumentsSchemaType = zod.infer<typeof VehicleDocumentsSchema>;

export const VehicleDocumentsSchema = zod.object({
  vehiclePicUrls: schemaHelper.files({ optional: true }),
  privateHireLicenseUrls: schemaHelper.files({ optional: true }),
  motTestCertificateUrls: schemaHelper.files({ optional: true }),
  vehicleInsuranceUrls: schemaHelper.files({ optional: true }),
  vehicleRegistrationUrls: schemaHelper.files({ optional: true }),
  leasingContractUrls: schemaHelper.files({ optional: true }),
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
  existingDocuments: {
    vehiclePicUrls: string[];
    privateHireLicenseUrls: string[];
    motTestCertificateUrls: string[];
    vehicleInsuranceUrls: string[];
    vehicleRegistrationUrls: string[];
    leasingContractUrls: string[];
  };
};

const FILE_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
];

export function VehicleDocuments({ currentVehicle, existingDocuments }: Props) {
  const router = useRouter();
  const { user } = useAuthContext();

  const defaultValues = useMemo(
    () => ({
      vehiclePicUrls: [],
      privateHireLicenseUrls: [],
      motTestCertificateUrls: [],
      vehicleInsuranceUrls: [],
      vehicleRegistrationUrls: [],
      leasingContractUrls: [],
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

  const handleRemoveFile = (
    inputFile: File | string,
    fieldName: keyof VehicleDocumentsSchemaType
  ) => {
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
      if (!user?.access_token || !currentVehicle?.id) {
        throw new Error('User not authenticated or vehicle ID missing');
      }

      // Upload new documents only if they were changed
      const uploadPromises = [];

      // Helper function to handle document uploads
      const handleDocumentUpload = (
        files: (File | string)[] | null | undefined,
        documentType: string
      ) => {
        if (files?.length) {
          const newFiles = files.filter((file): file is File => file instanceof File);
          if (newFiles.length) {
            uploadPromises.push(
              uploadDocuments(
                newFiles,
                currentVehicle.providerId,
                documentType,
                user.access_token,
                'vehicles',
                currentVehicle.id
              )
            );
          }
        }
      };

      handleDocumentUpload(data.vehiclePicUrls, 'vehicle_pic');
      handleDocumentUpload(data.privateHireLicenseUrls, 'private_hire_license');
      handleDocumentUpload(data.motTestCertificateUrls, 'mot_test_certificate');
      handleDocumentUpload(data.vehicleInsuranceUrls, 'vehicle_insurance');
      handleDocumentUpload(data.vehicleRegistrationUrls, 'vehicle_registration');
      handleDocumentUpload(data.leasingContractUrls, 'leasing_contract');

      if (uploadPromises.length) {
        await Promise.all(uploadPromises);
      }

      // Update vehicle data only for changed dates
      const updateData: Record<string, any> = {};

      if (
        data.privateHireLicenseExpiryDate !==
        currentVehicle?.documents?.privateHireLicenseExpiryDate
      ) {
        updateData.private_hire_license_expiry_date = data.privateHireLicenseExpiryDate;
      }

      if (
        data.motTestCertificateExpiryDate !==
        currentVehicle?.documents?.motTestCertificateExpiryDate
      ) {
        updateData.mot_test_certificate_expiry_date = data.motTestCertificateExpiryDate;
      }

      if (
        data.vehicleInsuranceExpiryDate !== currentVehicle?.documents?.vehicleInsuranceExpiryDate
      ) {
        updateData.vehicle_insurance_expiry_date = data.vehicleInsuranceExpiryDate;
      }

      if (Object.keys(updateData).length) {
        await updateVehicle(currentVehicle.id, updateData);
      }

      toast.success('Documents updated successfully!');
      router.push(paths.dashboard.vehicles.root);
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
              fieldName="vehiclePicUrls"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onDrop={handleDrop}
              currentStatus={currentVehicle?.documents?.vehiclePicStatus || 'pending'}
              existingFiles={existingDocuments.vehiclePicUrls}
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
              existingFiles={existingDocuments.privateHireLicenseUrls}
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
              existingFiles={existingDocuments.motTestCertificateUrls}
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
              existingFiles={existingDocuments.vehicleInsuranceUrls}
            />

            <Divider sx={{ my: 3 }} />

            <DocumentSection
              title="Vehicle Registration"
              fieldName="vehicleRegistrationUrls"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onDrop={handleDrop}
              currentStatus={currentVehicle?.documents?.vehicleRegistrationStatus || 'pending'}
              existingFiles={existingDocuments.vehicleRegistrationUrls}
            />

            <Divider sx={{ my: 3 }} />

            <DocumentSection
              title="Leasing Contract"
              fieldName="leasingContractUrls"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onDrop={handleDrop}
              currentStatus={currentVehicle?.documents?.leasingContractStatus || 'pending'}
              existingFiles={existingDocuments.leasingContractUrls}
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
  existingFiles?: string[];
};

function DocumentSection({
  title,
  fieldName,
  expiryField,
  onRemove,
  onRemoveAll,
  onDrop,
  currentStatus,
  existingFiles = [],
}: DocumentSectionProps) {
  const { watch } = useFormContext<VehicleDocumentsSchemaType>();

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

      {existingFiles.length > 0 && (
        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          sx={{
            gap: 2,
            my: 2,
          }}
        >
          {existingFiles.map((url, index) => (
            <Box
              key={`existing-${url}-${index}`}
              sx={{
                position: 'relative',
                borderRadius: 1,
                overflow: 'hidden',
                width: 200,
                height: 200,
                boxShadow: (theme) => theme.customShadows.z8,
                '&:hover .overlay': {
                  opacity: 1,
                },
              }}
            >
              <img
                src={url}
                alt={`${title} ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <Box
                className="overlay"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  p: 1,
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  textAlign: 'center',
                }}
              >
                {`File ${index + 1} of ${existingFiles.length}`}
              </Box>
            </Box>
          ))}
        </Stack>
      )}

      <Field.Upload
        name={fieldName}
        multiple
        thumbnail
        onRemove={(file) => onRemove(file, fieldName)}
        onRemoveAll={() => onRemoveAll(fieldName)}
        onDrop={(files) => onDrop(files, fieldName)}
      />
    </Stack>
  );
}
