'use client';

import type { IUserItem } from 'src/types/user';

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
import { updateChauffeur } from 'src/auth/context/supabase';

// ----------------------------------------------------------------------

export type UserDocumentsSchemaType = zod.infer<typeof UserDocumentsSchema>;

export const UserDocumentsSchema = zod.object({
  profilePicUrls: schemaHelper.files({ optional: true }),
  driversLicenseUrls: schemaHelper.files({ optional: true }),
  privateHireLicenseUrls: schemaHelper.files({ optional: true }),
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
  existingDocuments: {
    profilePicUrls: string[];
    driversLicenseUrls: string[];
    privateHireLicenseUrls: string[];
  };
};

const FILE_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
];

export function UserDocuments({ currentUser, existingDocuments }: Props) {
  const router = useRouter();
  const { user } = useAuthContext();

  const defaultValues = useMemo(
    () => ({
      driversLicenseExpiryDate: currentUser?.documents?.driversLicenseExpiryDate || null,
      privateHireLicenseExpiryDate: currentUser?.documents?.privateHireLicenseExpiryDate || null,
      profilePicUrls: [],
      driversLicenseUrls: [],
      privateHireLicenseUrls: [],
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
      if (!user?.access_token || !currentUser?.id) {
        throw new Error('User not authenticated');
      }

      // Upload new documents only if they were changed
      const uploadPromises = [];

      if (data.profilePicUrls?.length) {
        const newFiles = data.profilePicUrls.filter((file): file is File => file instanceof File);
        if (newFiles.length) {
          uploadPromises.push(
            uploadDocuments(
              newFiles,
              currentUser.providerId,
              'profile_pic',
              user.access_token,
              'chauffeurs',
              currentUser.id
            )
          );
        }
      }

      if (data.driversLicenseUrls?.length) {
        const newFiles = data.driversLicenseUrls.filter(
          (file): file is File => file instanceof File
        );
        if (newFiles.length) {
          uploadPromises.push(
            uploadDocuments(
              newFiles,
              currentUser.providerId,
              'drivers_license',
              user.access_token,
              'chauffeurs',
              currentUser.id
            )
          );
        }
      }

      if (data.privateHireLicenseUrls?.length) {
        const newFiles = data.privateHireLicenseUrls.filter(
          (file): file is File => file instanceof File
        );
        if (newFiles.length) {
          uploadPromises.push(
            uploadDocuments(
              newFiles,
              currentUser.providerId,
              'private_hire_license',
              user.access_token,
              'chauffeurs',
              currentUser.id
            )
          );
        }
      }

      if (uploadPromises.length) {
        await Promise.all(uploadPromises);
      }

      // Update chauffeur data only for changed dates
      const updateData: Record<string, any> = {};

      if (data.driversLicenseExpiryDate !== currentUser?.documents?.driversLicenseExpiryDate) {
        updateData.drivers_license_expiry_date = data.driversLicenseExpiryDate;
      }

      if (
        data.privateHireLicenseExpiryDate !== currentUser?.documents?.privateHireLicenseExpiryDate
      ) {
        updateData.private_hire_license_expiry_date = data.privateHireLicenseExpiryDate;
      }

      if (Object.keys(updateData).length) {
        await updateChauffeur(currentUser.id, updateData);
      }

      toast.success('Documents updated successfully!');
      router.push(paths.dashboard.chauffeurs.root);
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
              fieldName="profilePicUrls"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onDrop={handleDrop}
              currentStatus={currentUser?.documents?.profilePicStatus || 'pending'}
              existingFiles={existingDocuments.profilePicUrls}
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
              existingFiles={existingDocuments.driversLicenseUrls}
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
              existingFiles={existingDocuments.privateHireLicenseUrls}
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
  const { watch } = useFormContext<UserDocumentsSchemaType>();

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
