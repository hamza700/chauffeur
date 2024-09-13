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

import { Field, schemaHelper } from 'src/components/hook-form';

// Define the basic schema using Zod for the payment method selection
const PaymentMethodSchema = zod.object({
  paymentMethod: zod.string().min(1, { message: 'Payment method is required!' }),
});

// Define the PayPal schema
const PayPalSchema = zod.object({
  paypalEmail: zod
    .string()
    .min(1, { message: 'Paypal email is required!' })
    .email({ message: 'Paypal email must be a valid email address!' }),
});

// Define the Bank Transfer schema
const BankTransferSchema = zod.object({
  bankAccountOwnerName: zod.string().min(1, { message: 'Bank account owner name is required!' }),
  bankName: zod.string().min(1, { message: 'Bank name is required!' }),
  bankCountry: schemaHelper.objectOrNull({
    message: { required_error: 'Bank country is required!' },
  }),
  bankAccountNumber: zod.string().min(1, { message: 'Bank account number is required!' }),
  iban: zod.string().min(1, { message: 'IBAN is required!' }),
  swiftCode: zod.string().optional(), // Optional field
});

type PaymentDetailsSchemaType = zod.infer<typeof PaymentMethodSchema> &
  Partial<zod.infer<typeof PayPalSchema>> &
  Partial<zod.infer<typeof BankTransferSchema>>;

type Props = {
  currentPaymentDetails?: PaymentDetails;
  onSubmit: (data: PaymentDetailsSchemaType) => void;
};

export function PaymentDetailsStep({ currentPaymentDetails, onSubmit }: Props) {
  const defaultValues = {
    paymentMethod: currentPaymentDetails?.paymentMethod || '',
    paypalEmail: currentPaymentDetails?.paypalEmail || '',
    bankAccountOwnerName: currentPaymentDetails?.bankAccountOwnerName || '',
    bankName: currentPaymentDetails?.bankName || '',
    bankCountry: currentPaymentDetails?.bankCountry || '',
    bankAccountNumber: currentPaymentDetails?.bankAccountNumber || '',
    iban: currentPaymentDetails?.iban || '',
    swiftCode: currentPaymentDetails?.swiftCode || '',
  };

  const methods = useForm<PaymentDetailsSchemaType>({
    mode: 'all',
    resolver: zodResolver(PaymentMethodSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = methods;

  const selectedPaymentMethod = watch('paymentMethod');

  // Handle dynamic validation
  const handlePaymentMethodChange = (method: string) => {
    setValue('paymentMethod', method);
    if (method === 'paypal') {
      methods.register('paypalEmail');
      trigger(); // Revalidate the form
    } else {
      methods.register('bankAccountOwnerName');
      methods.register('bankName');
      methods.register('bankCountry');
      methods.register('bankAccountNumber');
      methods.register('iban');
      methods.register('swiftCode');
      trigger(); // Revalidate the form
    }
  };

  const handleSubmitForm = async () => {
    let schemaToValidate;
    if (selectedPaymentMethod === 'paypal') {
      schemaToValidate = PaymentMethodSchema.merge(PayPalSchema);
    } else {
      schemaToValidate = PaymentMethodSchema.merge(BankTransferSchema);
    }
    const validationResult = await schemaToValidate.safeParseAsync(getValues());

    if (validationResult.success) {
      onSubmit(validationResult.data as PaymentDetailsSchemaType);
    } else {
      validationResult.error.errors.forEach((error) => {
        const fieldName = error.path[0] as keyof typeof errors;
        methods.setError(fieldName, { type: 'manual', message: error.message });
      });
    }
  };

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
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <Stack spacing={3}>
              <Field.Select
                name="paymentMethod"
                label="Select Payment Method"
                required
                fullWidth
                displayEmpty
                onChange={(e) => handlePaymentMethodChange(e.target.value)}
                // Don't set error and helperText here to avoid double display
              >
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

              {selectedPaymentMethod === 'paypal' && (
                <Field.Text
                  name="paypalEmail"
                  label="Paypal Email"
                  required
                  fullWidth
                  error={!!errors.paypalEmail}
                  helperText={errors.paypalEmail?.message}
                  sx={{ mt: 2 }}
                />
              )}

              {selectedPaymentMethod !== 'paypal' && selectedPaymentMethod && (
                <>
                  <Field.Text
                    name="bankAccountOwnerName"
                    label="Bank Account Owner Name"
                    required
                    fullWidth
                    error={!!errors.bankAccountOwnerName}
                    helperText={errors.bankAccountOwnerName?.message}
                    sx={{ mt: 2 }}
                  />
                  <Field.Text
                    name="bankName"
                    label="Bank Name"
                    required
                    fullWidth
                    error={!!errors.bankName}
                    helperText={errors.bankName?.message}
                    sx={{ mt: 2 }}
                  />
                  <Field.CountrySelect
                    name="bankCountry"
                    label="Bank Country"
                    placeholder="Choose a country"
                    required
                    fullWidth
                    error={!!errors.bankCountry}
                    helperText={errors.bankCountry?.message}
                    sx={{ mt: 2 }}
                  />
                  <Field.Text
                    name="bankAccountNumber"
                    label="Bank Account Number"
                    required
                    fullWidth
                    error={!!errors.bankAccountNumber}
                    helperText={errors.bankAccountNumber?.message}
                    sx={{ mt: 2 }}
                  />
                  <Field.Text
                    name="iban"
                    label="IBAN"
                    required
                    fullWidth
                    error={!!errors.iban}
                    helperText={errors.iban?.message}
                    sx={{ mt: 2 }}
                  />
                  <Field.Text name="swiftCode" label="SWIFT Code" fullWidth sx={{ mt: 2 }} />
                </>
              )}
            </Stack>
            <input type="submit" style={{ display: 'none' }} />
          </form>
        </FormProvider>
      </Card>
    </Box>
  );
}
