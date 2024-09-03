'use client';

import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Stack from '@mui/material/Stack';

import { Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type UpdateChauffeurSchemaType = zod.infer<typeof UpdateChauffeurSchema>;

export const UpdateChauffeurSchema = zod.object({
  firstName: zod.string().min(1, { message: 'First Name is required!' }),
  lastName: zod.string().min(1, { message: 'Last Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email Address is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  driversLicense: zod.string().min(1, { message: "Driver's License is required!" }),
  privateHireLicense: zod.string().min(1, { message: 'Private Hire License is required!' }),
  licensePlate: zod.string().min(1, { message: 'License Plate is required!' }),
  country: schemaHelper.objectOrNull({
    message: { required_error: 'Country is required!' },
  }),
});

type Props = {
  currentChauffeur?: UpdateChauffeurSchemaType;
  onSubmit: (data: UpdateChauffeurSchemaType) => void;
};

export function FirstChauffeurStep({ currentChauffeur, onSubmit }: Props) {
  const defaultValues: UpdateChauffeurSchemaType = {
    firstName: currentChauffeur?.firstName || '',
    lastName: currentChauffeur?.lastName || '',
    email: currentChauffeur?.email || '',
    phoneNumber: currentChauffeur?.phoneNumber || '',
    driversLicense: currentChauffeur?.driversLicense || '',
    privateHireLicense: currentChauffeur?.privateHireLicense || '',
    licensePlate: currentChauffeur?.licensePlate || '',
    country: currentChauffeur?.country || null,
  };

  const methods = useForm<UpdateChauffeurSchemaType>({
    mode: 'all',
    resolver: zodResolver(UpdateChauffeurSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
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
          <Field.CountrySelect name="country" label="Country" placeholder="Choose a country" />
        </Stack>
        <input type="submit" style={{ display: 'none' }} />
      </form>
    </FormProvider>
  );
}
