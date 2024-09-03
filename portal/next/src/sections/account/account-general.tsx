import type { IProviderAccount } from 'src/types/provider';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type UpdateProviderSchemaType = zod.infer<typeof UpdateProviderSchema>;

export const UpdateProviderSchema = zod.object({
  companyName: zod.string().min(1, { message: 'Company Name is required!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  country: schemaHelper.objectOrNull({ message: { required_error: 'Country is required!' } }),
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
});

type Props = {
  currentProvider?: IProviderAccount;
};

export function AccountGeneral({ currentProvider }: Props) {
  const defaultValues = {
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
  };

  const methods = useForm<UpdateProviderSchemaType>({
    mode: 'all',
    resolver: zodResolver(UpdateProviderSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Update success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Text name="companyName" label="Company Name" />
              <Field.Phone name="phoneNumber" label="Phone number" />
              <Field.CountrySelect name="country" label="Country" placeholder="Choose a country" />
              <Field.Text name="address" label="Address" />
              <Field.Text name="state" label="State/region" />
              <Field.Text name="city" label="City" />
              <Field.Text name="postCode" label="Post code" />
              <Field.Text name="taxIdentificationNumber" label="Tax Identification NUmber" />
              <Field.Text name="companyRegistrationNumber" label="Company Registration Number" />
              <Field.Text name="vatNumber" label="VAT Number" />
            </Box>

            <Stack spacing={3} direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button variant="contained" color="error">
                Delete user
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
