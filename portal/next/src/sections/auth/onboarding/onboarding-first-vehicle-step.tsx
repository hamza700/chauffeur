'use client';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';

import { Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const CAR_MODELS = [
  { value: 'Audi A6', serviceClass: ['Business'] },
  { value: 'Audi A8', serviceClass: ['Business', 'First'] },
  { value: 'BMW 5-Series', serviceClass: ['Business'] },
  { value: 'BMW 7-Series', serviceClass: ['Business', 'First'] },
  { value: 'BMW i5', serviceClass: ['Business'] },
  { value: 'BMW i7', serviceClass: ['Business', 'First'] },
  { value: 'Genesis G80 electric', serviceClass: ['Business'] },
  { value: 'Genesis G90', serviceClass: ['Business', 'First'] },
  { value: 'Land Rover Range Rover', serviceClass: ['First'] },
  { value: 'Lucid Air', serviceClass: ['First'] },
  { value: 'Mercedes EQS-SUV', serviceClass: ['First'] },
  { value: 'Mercedes-Benz E-Class', serviceClass: ['Business'] },
  { value: 'Mercedes-Benz EQE', serviceClass: ['Business'] },
  { value: 'Mercedes-Benz EQE-SUV', serviceClass: ['Business'] },
  { value: 'Mercedes-Benz EQS', serviceClass: ['Business', 'First'] },
  { value: 'Mercedes-Benz EQV', serviceClass: ['Van'] },
  { value: 'Mercedes-Benz S-Class', serviceClass: ['First'] },
  { value: 'Mercedes-Benz V-Class', serviceClass: ['Van'] },
  { value: 'Mercedes-Benz eVito', serviceClass: ['Van'] },
];

const COLOR_OPTIONS = ['Black', 'Silver'];
const YEAR_OPTIONS = Array.from(new Array(5), (_, index) =>
  (new Date().getFullYear() - index).toString()
);

// ----------------------------------------------------------------------

export type NewVehicleSchemaType = zod.infer<typeof NewVehicleSchema>;

export const NewVehicleSchema = zod.object({
  model: zod.string().min(1, { message: 'Model is required!' }),
  productionYear: zod.string().min(1, { message: 'Production year is required!' }),
  color: zod.string().min(1, { message: 'Color is required!' }),
  licensePlate: zod.string().min(1, { message: 'License plate is required!' }),
  serviceClass: zod.string().min(1, { message: 'Service class is required!' }),
});

// ----------------------------------------------------------------------

type Props = {
  currentVehicle?: NewVehicleSchemaType;
  onSubmit: (data: NewVehicleSchemaType) => void;
};

export function FirstVehicleStep({ currentVehicle, onSubmit }: Props) {
  const defaultValues = useMemo(
    () => ({
      model: currentVehicle?.model || '',
      productionYear: currentVehicle?.productionYear || '',
      color: currentVehicle?.color || '',
      licensePlate: currentVehicle?.licensePlate || '',
      serviceClass: currentVehicle?.serviceClass || '',
    }),
    [currentVehicle]
  );

  const methods = useForm<NewVehicleSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewVehicleSchema),
    defaultValues,
  });

  const { handleSubmit, watch } = methods;

  const values = watch();

  const serviceClasses = CAR_MODELS.find((car) => car.value === values.model)?.serviceClass || [];

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
        >
          <Field.Select
            name="model"
            label="Car Model"
            InputLabelProps={{ shrink: true }}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select a car model
            </MenuItem>
            {CAR_MODELS.map((car) => (
              <MenuItem key={car.value} value={car.value}>
                {car.value}
              </MenuItem>
            ))}
          </Field.Select>

          <Field.Select
            name="productionYear"
            label="Production Year"
            InputLabelProps={{ shrink: true }}
            displayEmpty
            disabled={!values.model}
          >
            <MenuItem value="" disabled>
              Select a production year
            </MenuItem>
            {YEAR_OPTIONS.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Field.Select>

          <Field.Select
            name="color"
            label="Color"
            InputLabelProps={{ shrink: true }}
            displayEmpty
            disabled={!values.model}
          >
            <MenuItem value="" disabled>
              Select a color
            </MenuItem>
            {COLOR_OPTIONS.map((color) => (
              <MenuItem key={color} value={color}>
                {color}
              </MenuItem>
            ))}
          </Field.Select>

          <Field.Text name="licensePlate" label="License Plate" />

          <Field.Select
            name="serviceClass"
            label="Service Class"
            InputLabelProps={{ shrink: true }}
            displayEmpty
            disabled={!values.model}
          >
            <MenuItem value="" disabled>
              Select a service class
            </MenuItem>
            {serviceClasses.map((serviceClass) => (
              <MenuItem key={serviceClass} value={serviceClass}>
                {serviceClass}
              </MenuItem>
            ))}
          </Field.Select>
        </Stack>
        <input type="submit" style={{ display: 'none' }} />
      </form>
    </FormProvider>
  );
}
