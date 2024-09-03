import type { IDateValue } from 'src/types/common';

import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  status?: string;
  backLink: string;
  orderNumber?: string;
  createdAt?: IDateValue;
};

export function OrderDetailsToolbar({ status, backLink, orderNumber }: Props) {
  const popover = usePopover();

  return (
    <Stack spacing={3} direction={{ xs: 'column', md: 'row' }} sx={{ mb: { xs: 3, md: 5 } }}>
      <Stack spacing={1} direction="row" alignItems="flex-start">
        <IconButton component={RouterLink} href={backLink}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>

        <Stack spacing={0.5}>
          <Stack spacing={1} direction="row" alignItems="center">
            <Typography variant="h4"> Order {orderNumber} </Typography>
            <Label
              variant="soft"
              color={
                (status === 'completed' && 'success') ||
                (status === 'pending' && 'warning') ||
                (status === 'cancelled' && 'error') ||
                'default'
              }
            >
              {status}
            </Label>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
