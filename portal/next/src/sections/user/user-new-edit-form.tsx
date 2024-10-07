'use client';

import type { IUserItem } from 'src/types/user';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { transformToChauffeurData } from 'src/utils/data-transformers';

import { signUpChauffeur } from 'src/actions/chauffeur';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { updateChauffeur, deleteChauffeur } from 'src/auth/context/supabase';

// ----------------------------------------------------------------------

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  firstName: zod.string().min(1, { message: 'First name is required!' }),
  lastName: zod.string().min(1, { message: 'Last name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  country: schemaHelper.objectOrNull<string | null>({
    message: { required_error: 'Country is required!' },
  }),
  driversLicense: zod.string().min(1, { message: "Driver's license is required!" }),
  privateHireLicense: zod.string().min(1, { message: 'Private hire license is required!' }),
  licensePlate: zod.string().min(1, { message: 'License plate is required!' }),
  // Not required
  status: zod.string(),
  isVerified: zod.boolean(),
});

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUserItem;
};

export function UserNewEditForm({ currentUser }: Props) {
  const { user } = useAuthContext();
  const userId = user?.id;

  const router = useRouter();
  const confirm = useBoolean();

  const defaultValues = useMemo(
    () => ({
      status: currentUser?.status || 'pending',
      isVerified: currentUser?.isVerified || true,
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      country: currentUser?.country || '',
      driversLicense: currentUser?.driversLicense || '',
      privateHireLicense: currentUser?.privateHireLicense || '',
      licensePlate: currentUser?.licensePlate || '',
    }),
    [currentUser]
  );

  const methods = useForm<NewUserSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
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
    reset(defaultValues);
  }, [currentUser, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (currentUser) {
        // Update existing user
        await updateChauffeur(currentUser.id, transformToChauffeurData(data));
        toast.success('Update success!');
      } else {
        const chauffeurData = {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          phone_number: data.phoneNumber,
          country: data.country,
          drivers_license: data.driversLicense,
          private_hire_license: data.privateHireLicense,
          license_plate: data.licensePlate,
          provider_id: userId,
        };

        await signUpChauffeur(chauffeurData, user?.access_token);

        toast.success('Create success!');
      }
      reset();
      router.push(paths.dashboard.chauffeurs.root);
      console.info('DATA', data);
    } catch (error) {
      toast.error(error.details); // Use the error message from Supabase
      console.error(error);
    }
  });

  const handleDelete = async () => {
    try {
      if (currentUser) {
        await deleteChauffeur(currentUser.id);
        toast.success('User deleted successfully');
        router.push(paths.dashboard.chauffeurs.root);
      }
    } catch (error) {
      toast.error(error.details); // Use the error message from Supabase
      console.error(error);
    }
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {currentUser && (
          <Grid xs={12} md={4}>
            <Card sx={{ pt: 10, pb: 5, px: 3 }}>
              <Label
                color={
                  (values.status === 'active' && 'success') ||
                  (values.status === 'rejected' && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>

              <Box sx={{ mb: 5, textAlign: 'center' }}>
                <Box
                  component="img"
                  src={currentUser.documents.profilePicUrl}
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    mx: 'auto',
                  }}
                />
              </Box>
            </Card>
          </Grid>
        )}

        <Grid xs={12} md={currentUser ? 8 : 12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Text name="firstName" label="First Name" />
              <Field.Text name="lastName" label="Last Name" />
              <Field.Text name="email" label="Email Address" />
              <Field.Phone name="phoneNumber" label="Phone Number" />
              <Field.Text name="driversLicense" label="Driver's License" />
              <Field.Text name="privateHireLicense" label="Private Hire License" />
              <Field.Text name="licensePlate" label="License Plate" />
              <Field.CountrySelect
                fullWidth
                name="country"
                label="Country"
                placeholder="Choose a country"
              />
            </Box>

            <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
              {currentUser && (
                <Button variant="soft" color="error" onClick={confirm.onTrue}>
                  Delete user
                </Button>
              )}
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Create user' : 'Save changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={<>Are you sure want to delete this user? This action cannot be undone.</>}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDelete();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </Form>
  );
}
