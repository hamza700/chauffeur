import type { IOrderItem } from 'src/types/order';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { fDateTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

type Props = {
  order: IOrderItem;
};

export function OrderDetailsItems({ order }: Props) {
  return (
    <Card>
      <CardHeader title="Details" />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5} sx={{ borderBottom: '1px dashed', pb: 1.5 }}>
          <Typography variant="subtitle2" gutterBottom>
            Date of Job:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {fDateTime(order.date)}
          </Typography>
        </Stack>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2" gutterBottom>
            Pickup Location:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {order.pickupLocation}
          </Typography>
        </Stack>
        <Stack spacing={1.5} sx={{ borderBottom: '1px dashed', pb: 1.5 }}>
          <Typography variant="subtitle2" gutterBottom>
            Dropoff Location:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {order.dropoffLocation}
          </Typography>
        </Stack>
        {order.specialRequests && (
          <Stack spacing={1.5}>
            <Typography variant="subtitle2" gutterBottom>
              Special Requests:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.specialRequests}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
