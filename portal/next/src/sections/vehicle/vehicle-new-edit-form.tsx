'use client';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';

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
  currentVehicle?: any; // Define the type for the vehicle
};

export function VehicleNewEditForm({ currentVehicle }: Props) {
  const router = useRouter();
  const confirm = useBoolean();

  const defaultValues = useMemo(
    () => ({
      model: currentVehicle?.model || '',
      productionYear: currentVehicle?.productionYear || '',
      color: currentVehicle?.colour || '',
      licensePlate: currentVehicle?.licensePlate || '',
      serviceClass: currentVehicle?.serviceClass || '',
    }),
    [currentVehicle]
  );

  const methods = useForm<NewVehicleSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewVehicleSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(currentVehicle ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.vehicle.root); // Update with the correct path
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDelete = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Vehicle deleted successfully');
      router.push(paths.dashboard.vehicle.root); // Update with the correct path
      // Implement additional delete logic here
    } catch (error) {
      console.error(error);
    }
  };

  const serviceClasses = CAR_MODELS.find((car) => car.value === values.model)?.serviceClass || [];

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
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentVehicle ? 'Create vehicle' : 'Save changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={<>Are you sure want to delete this vehicle? This action cannot be undone.</>}
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
