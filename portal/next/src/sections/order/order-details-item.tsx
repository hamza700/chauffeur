import type { IBookingItem, IAvailableJobsItem } from 'src/types/order';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { fDate, fTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

type Props = {
  order: IAvailableJobsItem | IBookingItem;
};

export function OrderDetailsItems({ order }: Props) {
  return (
    <Card>
      <CardHeader title="Details" />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5} sx={{ borderBottom: '1px dashed', pb: 1.5 }}>
          <Typography variant="subtitle2" gutterBottom>
            Date & Time of Job:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Date: {fDate(order.date)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Time: {fTime(order.time)}
          </Typography>
        </Stack>

        <Stack spacing={1.5} sx={{ borderBottom: '1px dashed', pb: 1.5 }}>
          <Typography variant="subtitle2" gutterBottom>
            Service Details:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Booking Type: {order.bookingType}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Service Class: {order.serviceClass}
          </Typography>
          {order.bookingType === 'hourly' && (
            <Typography variant="body2" color="text.secondary">
              Hours: {order.hours}
            </Typography>
          )}
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2" gutterBottom>
            Pickup Location:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {order.pickupLocation}
          </Typography>
        </Stack>

        {order.bookingType === 'chauffeur' && (
          <Stack spacing={1.5} sx={{ borderBottom: '1px dashed', pb: 1.5 }}>
            <Typography variant="subtitle2" gutterBottom>
              Dropoff Location:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.dropoffLocation}
            </Typography>
          </Stack>
        )}

        <Stack spacing={1.5} sx={{ borderBottom: '1px dashed', pb: 1.5 }}>
          <Typography variant="subtitle2" gutterBottom>
            Journey Details:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Passengers: {order.passengers}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Luggage: {order.luggage}
          </Typography>
          {order.flightNumber && (
            <Typography variant="body2" color="text.secondary">
              Flight Number: {order.flightNumber}
            </Typography>
          )}
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
