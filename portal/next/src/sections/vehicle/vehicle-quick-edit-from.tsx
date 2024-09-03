'use client';

import type { IVehicleItem } from 'src/types/vehicle';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type VehicleQuickEditSchemaType = zod.infer<typeof VehicleQuickEditSchema>;

export const VehicleQuickEditSchema = zod.object({
  model: zod.string().min(1, { message: 'Model is required!' }),
  productionYear: zod.string().min(1, { message: 'Production year is required!' }),
  color: zod.string().min(1, { message: 'Color is required!' }),
  licensePlate: zod.string().min(1, { message: 'License plate is required!' }),
  serviceClass: zod.string().min(1, { message: 'Service class is required!' }),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  currentVehicle?: IVehicleItem;
};

export function VehicleQuickEditForm({ currentVehicle, open, onClose }: Props) {
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

  const methods = useForm<VehicleQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(VehicleQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const promise = new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      reset();
      onClose();

      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Update success!',
        error: 'Update error!',
      });

      await promise;

      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Quick Update</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Vehicle is waiting for confirmation
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <Field.Text name="model" label="Car Model" />
            <Field.Select name="productionYear" label="Production Year">
              <MenuItem value="" disabled>
                <em>None</em>
              </MenuItem>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <MenuItem key={year} value={year.toString()}>
                  {year}
                </MenuItem>
              ))}
            </Field.Select>
            <Field.Select name="color" label="Color">
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Black">Black</MenuItem>
              <MenuItem value="Silver">Silver</MenuItem>
            </Field.Select>
            <Field.Text name="licensePlate" label="License Plate" />
            <Field.Select name="serviceClass" label="Service Class">
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="First">First</MenuItem>
              <MenuItem value="Business">Business</MenuItem>
              <MenuItem value="Van">Van</MenuItem>
            </Field.Select>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
