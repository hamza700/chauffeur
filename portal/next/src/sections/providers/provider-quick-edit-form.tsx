import type { IProviderAccount } from 'src/types/user';

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

import { updateProvider } from 'src/auth/context/supabase';

// ----------------------------------------------------------------------

export type ProviderQuickEditSchemaType = zod.infer<typeof ProviderQuickEditSchema>;

export const ProviderQuickEditSchema = zod.object({
  status: zod.string().min(1, { message: 'Status is required!' }),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  currentProvider?: IProviderAccount;
  onRefreshData?: () => void;
};

export function ProviderQuickEditForm({ currentProvider, open, onClose, onRefreshData }: Props) {
  const defaultValues = useMemo(
    () => ({
      status: currentProvider?.status || '',
    }),
    [currentProvider]
  );

  const methods = useForm<ProviderQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(ProviderQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    if (!currentProvider) return;

    try {
      const { data: updatedData, error } = await updateProvider(currentProvider.id, data);
      if (error) {
        throw error;
      }

      reset();
      onClose();
      toast.success('Update success!');
      onRefreshData?.();
      console.info('Updated Data', updatedData);
    } catch (error) {
      toast.error('Update error!');
      console.error(error);
    }
  });

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Update Status</DialogTitle>

        <DialogContent>
          <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns="1fr">
            <Field.Select name="status">
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
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