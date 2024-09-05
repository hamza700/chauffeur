'use client';

import type { PartnerAgreement } from 'src/types/provider';

import React from 'react';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { Field } from 'src/components/hook-form';

// Define the Zod schema
export const PartnerAgreementSchema = zod.object({
  agreeToTerms: zod.boolean().refine((value) => value === true, {
    message: 'You must agree to the partner agreement to proceed.',
  }),
  signature: zod.string().min(1, { message: 'Please sign with your name to proceed.' }),
});

type PartnerAgreementSchemaType = zod.infer<typeof PartnerAgreementSchema>;

type Props = {
  currentAgreement?: PartnerAgreement;
  onSubmit: (data: PartnerAgreementSchemaType) => void;
};

export function PartnerAgreementStep({ currentAgreement, onSubmit }: Props) {
  const defaultValues = {
    agreeToTerms: currentAgreement?.agreeToTerms ?? false,
    signature: currentAgreement?.signature ?? '',
  };

  const methods = useForm<PartnerAgreementSchemaType>({
    mode: 'all',
    resolver: zodResolver(PartnerAgreementSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Partner Agreement
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Please review the following terms and conditions before proceeding.By agreeing to this
        partner agreement, you confirm that you have read, understood, and accepted the terms of
        this agreement.
      </Typography>

      <Divider sx={{ my: 3 }} />
      <Card sx={{ p: 3 }}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }}>
                <Typography variant="body2" sx={{ mb: 3 }}>
                  (Include your specific partner agreement details here, outlining the
                  responsibilities, rights, and obligations of both parties. Make sure this text is
                  comprehensive and clear to avoid any misunderstandings.)
                </Typography>
              </Card>

              {/* Signature Field */}
              <Field.Text
                name="signature"
                label="Sign with your name"
                error={!!errors.signature}
                helperText={errors.signature?.message}
                sx={{ mt: 2 }}
              />

              {/* Agreement Checkbox */}
              <Field.Checkbox name="agreeToTerms" label="I agree to the partner agreement" />
            </Stack>

            <input type="submit" style={{ display: 'none' }} />
          </form>
        </FormProvider>
      </Card>
    </Box>
  );
}
