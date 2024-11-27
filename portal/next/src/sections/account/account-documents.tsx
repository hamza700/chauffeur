'use client';

import type { IProviderAccount } from 'src/types/provider';

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

import { useRouter } from 'src/routes/hooks';

import { uploadDocuments } from 'src/actions/documents';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { updateProvider } from 'src/auth/context/supabase';

// ----------------------------------------------------------------------

export type ProviderDocumentsSchemaType = zod.infer<typeof ProviderDocumentsSchema>;

export const ProviderDocumentsSchema = zod.object({
  companyPrivateHireOperatorLicenseFiles: schemaHelper.files({ optional: true }),
  personalIDorPassportFiles: schemaHelper.files({ optional: true }),
  vatRegistrationCertificateFiles: schemaHelper.files({ optional: true }),
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
  onRefetch?: () => void;
  existingDocuments: {
    companyPrivateHireOperatorLicenseFiles: string[];
    personalIDorPassportFiles: string[];
    vatRegistrationCertificateFiles: string[];
  };
};

const FILE_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
];

export function AccountDocuments({ currentProvider, existingDocuments, onRefetch }: Props) {
  const router = useRouter();
  const { user } = useAuthContext();

  const defaultValues = useMemo(
    () => ({
      companyPrivateHireOperatorLicenseFiles: [],
      personalIDorPassportFiles: [],
      vatRegistrationCertificateFiles: [],
      companyPrivateHireOperatorLicenseExpiry:
        currentProvider?.documents.companyPrivateHireOperatorLicenseExpiryDate || null,
      personalIDorPassportExpiry: currentProvider?.documents.personalIDorPassportExpiryDate || null,
      vatRegistrationCertificateExpiry:
        currentProvider?.documents.vatRegistrationCertificateExpiryDate || null,
    }),
    [currentProvider]
  );

  const methods = useForm<ProviderDocumentsSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(ProviderDocumentsSchema),
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
    if (currentProvider) {
      reset(defaultValues);
    }
  }, [currentProvider, defaultValues, reset]);

  const handleRemoveFile = (
    inputFile: File | string,
    fieldName: keyof ProviderDocumentsSchemaType
  ) => {
    const fieldValue = values[fieldName];
    if (Array.isArray(fieldValue)) {
      const filtered = fieldValue.filter((file) => file !== inputFile);
      setValue(fieldName, filtered, { shouldValidate: true });
    }
  };

  const handleRemoveAllFiles = (fieldName: keyof ProviderDocumentsSchemaType) => {
    setValue(fieldName, [], { shouldValidate: true });
  };

  const handleDrop = useCallback(
    (files: File[], fieldName: keyof ProviderDocumentsSchemaType) => {
      const currentFiles = values[fieldName];
      const updatedFiles = Array.isArray(currentFiles) ? [...currentFiles, ...files] : files[0];
      setValue(fieldName, updatedFiles, { shouldValidate: true });
    },
    [setValue, values]
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!user?.access_token || !currentProvider?.id) {
        throw new Error('User not authenticated');
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
              uploadDocuments(newFiles, currentProvider.id, documentType, user.access_token)
            );
          }
        }
      };

      handleDocumentUpload(
        data.companyPrivateHireOperatorLicenseFiles,
        'company_private_hire_license'
      );
      handleDocumentUpload(data.personalIDorPassportFiles, 'proof_of_id');
      handleDocumentUpload(data.vatRegistrationCertificateFiles, 'vat_registration');

      if (uploadPromises.length) {
        await Promise.all(uploadPromises);
      }

      // Update provider data only for changed dates
      const updateData: Record<string, any> = {};

      if (
        data.companyPrivateHireOperatorLicenseExpiry !==
        currentProvider?.documents.companyPrivateHireOperatorLicenseExpiryDate
      ) {
        updateData.company_private_hire_operator_license_expiry_date =
          data.companyPrivateHireOperatorLicenseExpiry;
      }

      if (
        data.personalIDorPassportExpiry !==
        currentProvider?.documents.personalIDorPassportExpiryDate
      ) {
        updateData.personal_id_or_passport_expiry_date = data.personalIDorPassportExpiry;
      }

      if (
        data.vatRegistrationCertificateExpiry !==
        currentProvider?.documents.vatRegistrationCertificateExpiryDate
      ) {
        updateData.vat_registration_certificate_expiry_date = data.vatRegistrationCertificateExpiry;
      }

      if (Object.keys(updateData).length) {
        await updateProvider(currentProvider.id, updateData);
      }

      toast.success('Documents updated successfully!');
      onRefetch?.();
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
              title="Company Private Hire Operator License"
              fieldName="companyPrivateHireOperatorLicenseFiles"
              expiryField="companyPrivateHireOperatorLicenseExpiry"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onDrop={handleDrop}
              currentStatus={
                currentProvider?.documents.companyPrivateHireOperatorLicenseStatus || 'pending'
              }
              existingFiles={existingDocuments.companyPrivateHireOperatorLicenseFiles}
            />

            <Divider sx={{ my: 3 }} />

            <DocumentSection
              title="Personal ID or Passport"
              fieldName="personalIDorPassportFiles"
              expiryField="personalIDorPassportExpiry"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onDrop={handleDrop}
              currentStatus={currentProvider?.documents.personalIDorPassportStatus || 'pending'}
              existingFiles={existingDocuments.personalIDorPassportFiles}
            />

            <Divider sx={{ my: 3 }} />

            <DocumentSection
              title="VAT Registration Certificate"
              fieldName="vatRegistrationCertificateFiles"
              expiryField="vatRegistrationCertificateExpiry"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onDrop={handleDrop}
              currentStatus={
                currentProvider?.documents.vatRegistrationCertificateStatus || 'pending'
              }
              existingFiles={existingDocuments.vatRegistrationCertificateFiles}
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
  fieldName: keyof ProviderDocumentsSchemaType;
  expiryField?: keyof ProviderDocumentsSchemaType;
  onRemove: (file: File | string, fieldName: keyof ProviderDocumentsSchemaType) => void;
  onRemoveAll: (fieldName: keyof ProviderDocumentsSchemaType) => void;
  onDrop: (files: File[], fieldName: keyof ProviderDocumentsSchemaType) => void;
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
  const { watch } = useFormContext<ProviderDocumentsSchemaType>();

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
                width: 200, // Fixed width
                height: 200, // Fixed height
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
                  objectFit: 'cover', // This will maintain aspect ratio
                }}
              />
              {/* Optional overlay with file number */}
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
