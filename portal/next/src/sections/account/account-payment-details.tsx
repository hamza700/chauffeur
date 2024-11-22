'use client';

import type { IProviderAccount } from 'src/types/provider';

import { z as zod } from 'zod';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { updateProvider } from 'src/auth/context/supabase';

// ----------------------------------------------------------------------

const PaymentDetailsSchema = zod.object({
  paymentMethod: zod.enum(
    ['paypal', 'bankTransferDTAZV', 'bankTransferDomestic', 'bankTransferInternational'],
    {
      errorMap: () => ({ message: 'Payment method is required!' }),
    }
  ),
  paypalEmail: zod.string().email({ message: 'Invalid email' }).optional().nullable(),
  bankAccountOwnerName: zod.string().optional().nullable(),
  bankName: zod.string().optional().nullable(),
  bankCountry: zod.string().nullable().optional(),
  bankAccountNumber: zod.string().optional().nullable(),
  iban: zod.string().optional().nullable(),
  swiftCode: zod.string().optional().nullable(),
});

export type PaymentDetailsSchemaType = zod.infer<typeof PaymentDetailsSchema>;

// ----------------------------------------------------------------------

type Props = {
  currentProvider?: IProviderAccount;
};

export function AccountPaymentDetails({ currentProvider }: Props) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      paymentMethod: currentProvider?.paymentDetails?.paymentMethod || '',
      paypalEmail: currentProvider?.paymentDetails?.paypalEmail || null,
      bankAccountOwnerName: currentProvider?.paymentDetails?.bankAccountOwnerName || null,
      bankName: currentProvider?.paymentDetails?.bankName || null,
      bankCountry: currentProvider?.paymentDetails?.bankCountry || null,
      bankAccountNumber: currentProvider?.paymentDetails?.bankAccountNumber || null,
      iban: currentProvider?.paymentDetails?.iban || null,
      swiftCode: currentProvider?.paymentDetails?.swiftCode || null,
    }),
    [currentProvider]
  );

  const methods = useForm<PaymentDetailsSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(PaymentDetailsSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentProvider) {
      console.log('Resetting form with values:', defaultValues);
      reset(defaultValues);
    }
  }, [currentProvider, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const updateData = {
        payment_method: data.paymentMethod,
        paypal_email: data.paypalEmail,
        bank_account_owner_name: data.bankAccountOwnerName,
        bank_name: data.bankName,
        bank_country: data.bankCountry,
        bank_account_number: data.bankAccountNumber,
        iban: data.iban,
        swift_code: data.swiftCode,
      };
      await updateProvider(currentProvider?.id, updateData);
      toast.success('Payment details updated successfully!');
      router.refresh();
    } catch (error) {
      console.error('Error updating payment details:', error);
      toast.error('Failed to update payment details. Please try again.');
    }
  });

  return (
    <FormProvider {...methods}>
      <Form methods={methods} onSubmit={onSubmit}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Payment Details
          </Typography>
          <Stack spacing={3}>
            <Field.Select name="paymentMethod" label="Select Payment Method" required fullWidth>
              <MenuItem value="" disabled>
                Select Payment Method
              </MenuItem>
              <MenuItem value="paypal">Paypal</MenuItem>
              <MenuItem value="bankTransferDTAZV">Bank Transfer (DTAZV)</MenuItem>
              <MenuItem value="bankTransferDomestic">Bank Transfer (Domestic Transfer)</MenuItem>
              <MenuItem value="bankTransferInternational">
                Bank Transfer (International Transfer)
              </MenuItem>
            </Field.Select>

            {values.paymentMethod === 'paypal' && (
              <Field.Text
                name="paypalEmail"
                label="Paypal Email"
                required
                fullWidth
                error={!!errors.paypalEmail}
                helperText={errors.paypalEmail?.message}
              />
            )}

            {values.paymentMethod !== 'paypal' && values.paymentMethod && (
              <>
                <Field.Text
                  name="bankAccountOwnerName"
                  label="Bank Account Owner Name"
                  required
                  fullWidth
                  error={!!errors.bankAccountOwnerName}
                  helperText={errors.bankAccountOwnerName?.message}
                />
                <Field.Text
                  name="bankName"
                  label="Bank Name"
                  required
                  fullWidth
                  error={!!errors.bankName}
                  helperText={errors.bankName?.message}
                />
                <Field.CountrySelect
                  name="bankCountry"
                  label="Bank Country"
                  placeholder="Choose a country"
                  required
                  fullWidth
                  error={!!errors.bankCountry}
                />
                <Field.Text
                  name="bankAccountNumber"
                  label="Bank Account Number"
                  required
                  fullWidth
                  error={!!errors.bankAccountNumber}
                  helperText={errors.bankAccountNumber?.message}
                />
                <Field.Text
                  name="iban"
                  label="IBAN"
                  required
                  fullWidth
                  error={!!errors.iban}
                  helperText={errors.iban?.message}
                />
                <Field.Text name="swiftCode" label="SWIFT Code" fullWidth />
              </>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Box>
          </Stack>
        </Card>
      </Form>
    </FormProvider>
  );
}
