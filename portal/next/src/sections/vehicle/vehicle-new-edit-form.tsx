'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
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

import { uuidv4 } from 'src/utils/uuidv4';
import { transformToVehicleData } from 'src/utils/data-transformers';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { useAuthContext } from 'src/auth/hooks';
import { deleteVehicle, insertVehicle, updateVehicle } from 'src/auth/context/supabase';

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
  colour: zod.string().min(1, { message: 'Color is required!' }),
  licensePlate: zod.string().min(1, { message: 'License plate is required!' }),
  serviceClass: zod.string().min(1, { message: 'Service class is required!' }),
});

// ----------------------------------------------------------------------

type Props = {
  currentVehicle?: any; // Define the type for the vehicle
};

export function VehicleNewEditForm({ currentVehicle }: Props) {
  const { user } = useAuthContext();
  const userId = user?.id;

  const router = useRouter();
  const confirm = useBoolean();

  const defaultValues = useMemo(
    () => ({
      model: currentVehicle?.model || '',
      productionYear: currentVehicle?.productionYear || '',
      colour: currentVehicle?.colour || '',
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

  useEffect(() => {
    reset(defaultValues);
  }, [currentVehicle, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (currentVehicle) {
        // Update existing user
        const updateData = {
          model: data.model,
          production_year: data.productionYear,
          colour: data.colour,
          license_plate: data.licensePlate,
          service_class: data.serviceClass,
        };
        await updateVehicle(currentVehicle.id, updateData);
        toast.success('Update success!');
      } else {
        const vehicleData = transformToVehicleData({
          ...data,
          providerId: userId,
          id: uuidv4(),
          status: 'pending',
          createdAt: new Date().toISOString(),
        });

        await insertVehicle(vehicleData);

        toast.success('Create success!');
      }
      reset();
      router.push(paths.dashboard.vehicles.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDelete = async () => {
    try {
      if (currentVehicle) {
        await deleteVehicle(currentVehicle.id);
        toast.success('Vehicle deleted successfully');
        router.push(paths.dashboard.vehicles.root);
      }
    } catch (error) {
      toast.error(error.details); // Use the error message from Supabase
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
                name="colour"
                label="Color"
                InputLabelProps={{ shrink: true }}
                displayEmpty
                disabled={!values.model}
              >
                <MenuItem value="" disabled>
                  Select a colour
                </MenuItem>
                {COLOR_OPTIONS.map((colour) => (
                  <MenuItem key={colour} value={colour}>
                    {colour}
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

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 3 }}
            >
              {currentVehicle && (
                <Button variant="soft" color="error" onClick={confirm.onTrue}>
                  Delete vehicle
                </Button>
              )}
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
