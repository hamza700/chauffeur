'use client';

import type { PaymentDetails } from 'src/types/provider';

import React from 'react';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { Form, Field } from 'src/components/hook-form';

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

type PaymentDetailsSchemaType = zod.infer<typeof PaymentDetailsSchema>;

type Props = {
  currentPaymentDetails?: PaymentDetails;
  onSubmit: (data: PaymentDetailsSchemaType) => void;
};

export function PaymentDetailsStep({ currentPaymentDetails, onSubmit }: Props) {
  const defaultValues = {
    paymentMethod: currentPaymentDetails?.paymentMethod || '',
    paypalEmail: currentPaymentDetails?.paypalEmail || null,
    bankAccountOwnerName: currentPaymentDetails?.bankAccountOwnerName || null,
    bankName: currentPaymentDetails?.bankName || null,
    bankCountry: currentPaymentDetails?.bankCountry || null,
    bankAccountNumber: currentPaymentDetails?.bankAccountNumber || null,
    iban: currentPaymentDetails?.iban || null,
    swiftCode: currentPaymentDetails?.swiftCode || null,
  };

  const methods = useForm<PaymentDetailsSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(PaymentDetailsSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const values = watch();

  const handleSubmitForm = handleSubmit(onSubmit);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Payment Details
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Please fill in the details of your payment. Make sure all the information is accurate before
        proceeding.
      </Typography>

      <Divider sx={{ my: 3 }} />
      <Card sx={{ p: 3 }}>
        <FormProvider {...methods}>
          <Form methods={methods} onSubmit={handleSubmitForm}>
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
            </Stack>
            <input type="submit" style={{ display: 'none' }} />
          </Form>
        </FormProvider>
      </Card>
    </Box>
  );
}