'use client';

import type { PartnerAgreement } from 'src/types/provider';

import React from 'react';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
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
  const methods = useForm<PartnerAgreementSchemaType>({
    mode: 'all',
    resolver: zodResolver(PartnerAgreementSchema),
    defaultValues: {
      agreeToTerms: currentAgreement?.agreeToTerms ?? false,
      signature: currentAgreement?.signature ?? '',
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Partner Agreement
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Please review the following terms and conditions carefully before proceeding. By
              agreeing to this partner agreement, you confirm that you have read, understood, and
              accepted the terms of this agreement.
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              (Include your specific partner agreement details here, outlining the responsibilities,
              rights, and obligations of both parties. Make sure this text is comprehensive and
              clear to avoid any misunderstandings.)
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
  );
}
