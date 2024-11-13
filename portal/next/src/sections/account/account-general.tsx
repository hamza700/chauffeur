'use client';

import type { IProviderAccount } from 'src/types/provider';

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

import { toast } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { updateProvider, deleteProvider } from 'src/auth/context/supabase';

// ----------------------------------------------------------------------

export type UpdateProviderSchemaType = zod.infer<typeof UpdateProviderSchema>;

export const UpdateProviderSchema = zod.object({
  companyName: zod.string().min(1, { message: 'Company Name is required!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  country: schemaHelper.objectOrNull<string | null>({
    message: { required_error: 'Country is required!' },
  }),
  address: zod.string().min(1, { message: 'Address is required!' }),
  state: zod.string().min(1, { message: 'State is required!' }),
  city: zod.string().min(1, { message: 'City is required!' }),
  postCode: zod.string().min(1, { message: 'Post code is required!' }),
  taxIdentificationNumber: zod
    .string()
    .min(1, { message: 'Tax Identification Number is required!' }),
  companyRegistrationNumber: zod
    .string()
    .min(1, { message: 'Company Registration Number is required!' }),
  vatNumber: zod.string().min(1, { message: 'VAT Number is required!' }),
  // Not required
  status: zod.string(),
  isOnboarded: zod.boolean(),
});

// ----------------------------------------------------------------------

type Props = {
  currentProvider?: IProviderAccount;
};

export function AccountGeneral({ currentProvider }: Props) {
  const router = useRouter();
  const confirm = useBoolean();

  const defaultValues = useMemo(
    () => ({
      status: currentProvider?.status || 'pending',
      isOnboarded: currentProvider?.isOnboarded || false,
      companyName: currentProvider?.companyName || '',
      phoneNumber: currentProvider?.phoneNumber || '',
      country: currentProvider?.country || '',
      address: currentProvider?.address || '',
      state: currentProvider?.state || '',
      city: currentProvider?.city || '',
      postCode: currentProvider?.postCode || '',
      taxIdentificationNumber: currentProvider?.taxIdentificationNumber || '',
      companyRegistrationNumber: currentProvider?.companyRegistrationNumber || '',
      vatNumber: currentProvider?.vatNumber || '',
    }),
    [currentProvider]
  );

  const methods = useForm<UpdateProviderSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(UpdateProviderSchema),
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
  }, [currentProvider, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const updateData = {
        company_name: data.companyName,
        phone_number: data.phoneNumber,
        country: data.country,
        address: data.address,
        state: data.state,
        city: data.city,
        post_code: data.postCode,
        tax_identification_number: data.taxIdentificationNumber,
        company_registration_number: data.companyRegistrationNumber,
        vat_number: data.vatNumber,
      };
      await updateProvider(currentProvider.id, updateData);
      toast.success('Update success!');
      router.refresh();
      console.info('DATA', data);
    } catch (error) {
      toast.error(error.details); // Use the error message from Supabase
      console.error(error);
    }
  });

  const handleDelete = async () => {
    try {
      if (currentProvider) {
        await deleteProvider(currentProvider.id);
        toast.success('Provider deleted successfully');
        router.push(paths.dashboard.settings);
      }
    } catch (error) {
      toast.error(error.details); // Use the error message from Supabase
      console.error(error);
    }
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Text name="companyName" label="Company Name" />
              <Field.Phone name="phoneNumber" label="Phone Number" />
              <Field.CountrySelect name="country" label="Country" placeholder="Choose a country" />
              <Field.Text name="address" label="Address" />
              <Field.Text name="state" label="State/region" />
              <Field.Text name="city" label="City" />
              <Field.Text name="postCode" label="Post code" />
              <Field.Text name="taxIdentificationNumber" label="Tax Identification Number" />
              <Field.Text name="companyRegistrationNumber" label="Company Registration Number" />
              <Field.Text name="vatNumber" label="VAT Number" />
            </Box>

            <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
              <Button variant="soft" color="error" onClick={confirm.onTrue}>
                Delete provider
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={<>Are you sure want to delete this provider? This action cannot be undone.</>}
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
