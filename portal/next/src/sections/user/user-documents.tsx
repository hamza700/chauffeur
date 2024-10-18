'use client';

import type { IUserItem } from 'src/types/user';

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

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { updateChauffeur } from 'src/auth/context/supabase';

// ----------------------------------------------------------------------

export type UserDocumentsSchemaType = zod.infer<typeof UserDocumentsSchema>;

export const UserDocumentsSchema = zod.object({
  profilePicUrl: schemaHelper.file({
    message: { required_error: 'Profile picture is required!' },
  }),
  driversLicenseUrls: schemaHelper.files({
    message: { required_error: "Driver's license is required!", minFiles: 1 },
  }),
  privateHireLicenseUrls: schemaHelper.files({
    message: { required_error: 'Private hire license is required!', minFiles: 1 },
  }),
  driversLicenseExpiryDate: schemaHelper.date({
    message: { required_error: "Driver's license expiry date is required!" },
  }),
  privateHireLicenseExpiryDate: schemaHelper.date({
    message: { required_error: 'Private hire license expiry date is required!' },
  }),
});

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUserItem;
};

const FILE_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
];

export function UserDocuments({ currentUser }: Props) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      profilePicUrl: currentUser?.documents?.profilePicUrl || '',
      driversLicenseUrls: currentUser?.documents?.driversLicenseUrls || [],
      privateHireLicenseUrls: currentUser?.documents?.privateHireLicenseUrls || [],
      driversLicenseExpiryDate: currentUser?.documents?.driversLicenseExpiryDate || null,
      privateHireLicenseExpiryDate: currentUser?.documents?.privateHireLicenseExpiryDate || null,
    }),
    [currentUser]
  );

  const methods = useForm<UserDocumentsSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(UserDocumentsSchema),
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
    if (currentUser) {
      reset(defaultValues);
    }
  }, [currentUser, defaultValues, reset]);

  const handleRemoveFile = (inputFile: File | string, fieldName: keyof UserDocumentsSchemaType) => {
    const fieldValue = values[fieldName];
    if (Array.isArray(fieldValue)) {
      const filtered = fieldValue.filter((file) => file !== inputFile);
      setValue(fieldName, filtered, { shouldValidate: true });
    } else if (typeof fieldValue === 'string') {
      setValue(fieldName, null, { shouldValidate: true });
    }
  };

  const handleRemoveAllFiles = (fieldName: keyof UserDocumentsSchemaType) => {
    setValue(fieldName, [], { shouldValidate: true });
  };

  const handleDrop = useCallback(
    (files: File[], fieldName: keyof UserDocumentsSchemaType) => {
      const currentFiles = values[fieldName];
      const updatedFiles = Array.isArray(currentFiles) ? [...currentFiles, ...files] : files[0];
      setValue(fieldName, updatedFiles, { shouldValidate: true });
    },
    [setValue, values]
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Implement your update logic here
      await new Promise((resolve) => setTimeout(resolve, 500));
      const updateData = {  
        drivers_license_expiry_date: data.driversLicenseExpiryDate,
        private_hire_license_expiry_date: data.privateHireLicenseExpiryDate,
      };
      await updateChauffeur(currentUser.id, updateData);
      toast.success('Documents updated successfully!');
      router.push(paths.dashboard.chauffeurs.root);
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
              title="Profile Picture"
              fieldName="profilePicUrl"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onDrop={handleDrop}
              currentStatus={currentUser?.documents?.profilePicStatus || 'pending'}
            />

            <Divider sx={{ my: 3 }} />

            <DocumentSection
              title="Driver's License"
              fieldName="driversLicenseUrls"
              expiryField="driversLicenseExpiryDate"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onDrop={handleDrop}
              currentStatus={currentUser?.documents?.driversLicenseStatus || 'pending'}
            />

            <Divider sx={{ my: 3 }} />

            <DocumentSection
              title="Private Hire License"
              fieldName="privateHireLicenseUrls"
              expiryField="privateHireLicenseExpiryDate"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onDrop={handleDrop}
              currentStatus={currentUser?.documents?.privateHireLicenseStatus || 'pending'}
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
  fieldName: keyof UserDocumentsSchemaType;
  expiryField?: keyof UserDocumentsSchemaType;
  onRemove: (file: File | string, fieldName: keyof UserDocumentsSchemaType) => void;
  onRemoveAll: (fieldName: keyof UserDocumentsSchemaType) => void;
  onDrop: (files: File[], fieldName: keyof UserDocumentsSchemaType) => void;
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
  const { watch } = useFormContext<UserDocumentsSchemaType>();
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
        multiple={fieldName !== 'profilePicUrl'}
        thumbnail
        onRemove={(file) => onRemove(file, fieldName)}
        onRemoveAll={() => onRemoveAll(fieldName)}
        onDrop={(files) => onDrop(files, fieldName)}
      />
    </Stack>
  );
}
