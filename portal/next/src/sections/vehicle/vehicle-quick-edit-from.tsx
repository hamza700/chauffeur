'use client';

import type { IVehicleItem } from 'src/types/vehicle';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { updateVehicle } from 'src/auth/context/supabase'; // Import the updateVehicle function
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export type VehicleQuickEditSchemaType = zod.infer<typeof VehicleQuickEditSchema>;

export const VehicleQuickEditSchema = zod.object({
  status: zod.string().min(1, { message: 'Status is required!' }),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  currentVehicle?: IVehicleItem;
};

export function VehicleQuickEditForm({ currentVehicle, open, onClose }: Props) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      status: currentVehicle?.status || '',
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
    if (!currentVehicle) return;

    try {
      const { data: updatedData, error } = await updateVehicle(currentVehicle.id, data);
      if (error) {
        throw error;
      }

      reset();
      onClose();

      toast.success('Update success!');
      router.refresh();
      console.info('Updated Data', updatedData);
    } catch (error) {
      toast.error('Update error!');
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={onClose}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Update Status</DialogTitle>

        <DialogContent>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns="1fr"
          >
            <Field.Select name="status">
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
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
