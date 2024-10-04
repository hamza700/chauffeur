'use client';

import type { IProviderAccount } from 'src/types/provider';

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

import { transformToProviderData } from 'src/utils/data-transformers';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { updateProvider } from 'src/auth/context/supabase';

// ----------------------------------------------------------------------

export type ProviderDocumentsSchemaType = zod.infer<typeof ProviderDocumentsSchema>;

export const ProviderDocumentsSchema = zod.object({
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

  const defaultValues = useMemo(
    () => ({
      companyPrivateHireOperatorLicenseFiles: currentProvider?.documents.companyPrivateHireOperatorLicenseUrls || [],
      personalIDorPassportFiles: currentProvider?.documents.personalIDorPassportUrls || [],
      vatRegistrationCertificateFiles: currentProvider?.documents.vatRegistrationCertificateUrls || [],
      companyPrivateHireOperatorLicenseExpiry: currentProvider?.documents.companyPrivateHireOperatorLicenseExpiryDate || null,
      personalIDorPassportExpiry: currentProvider?.documents.personalIDorPassportExpiryDate || null,
      vatRegistrationCertificateExpiry: currentProvider?.documents.vatRegistrationCertificateExpiryDate || null,
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

  const handleRemoveFile = (inputFile: File | string, fieldName: keyof ProviderDocumentsSchemaType) => {
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
      const updatedFiles = Array.isArray(currentFiles)
        ? [...currentFiles, ...files]
        : files[0];
      setValue(fieldName, updatedFiles, { shouldValidate: true });
    },
    [setValue, values]
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await updateProvider(currentProvider.id, transformToProviderData(data));
      toast.success('Update success!');
      router.push(paths.dashboard.settings);
      console.info('DATA', data);
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
              currentStatus={currentProvider?.documents.companyPrivateHireOperatorLicenseStatus || 'pending'}
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
            />

            <Divider sx={{ my: 3 }} />

            <DocumentSection
              title="VAT Registration Certificate"
              fieldName="vatRegistrationCertificateFiles"
              expiryField="vatRegistrationCertificateExpiry"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onDrop={handleDrop}
              currentStatus={currentProvider?.documents.vatRegistrationCertificateStatus || 'pending'}
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
  expiryField: keyof ProviderDocumentsSchemaType;
  onRemove: (file: File | string, fieldName: keyof ProviderDocumentsSchemaType) => void;
  onRemoveAll: (fieldName: keyof ProviderDocumentsSchemaType) => void;
  onDrop: (files: File[], fieldName: keyof ProviderDocumentsSchemaType) => void;
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
  const { watch } = useFormContext<ProviderDocumentsSchemaType>();
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
      <Field.DatePicker name={expiryField} label="Expiry Date" sx={{ width: '50%' }} />
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