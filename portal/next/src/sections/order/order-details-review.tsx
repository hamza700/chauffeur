import type { IBookingReview } from 'src/types/booking';

import { Card, Stack, Rating, Divider, CardHeader, Typography } from '@mui/material';

import { fDateTime } from 'src/utils/format-time';

type Props = {
  bookingReview: IBookingReview | null;
};

export function OrderDetailsReview({ bookingReview }: Props) {
  if (!bookingReview) {
    return null;
  }

  return (
    <Card>
      <CardHeader title="Customer Review" />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="subtitle2">Rating</Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Rating
              value={bookingReview.rating}
              precision={0.5}
              readOnly
              sx={{ color: 'primary.main' }}
            />
            <Typography variant="body2">({bookingReview.rating}/5)</Typography>
          </Stack>
        </Stack>

        <Divider />

        <Stack spacing={2}>
          <Typography variant="subtitle2">Comment</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {bookingReview.comment || 'No comment provided'}
          </Typography>
        </Stack>

        <Divider />

        <Stack spacing={2}>
          <Typography variant="subtitle2">Review Date</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {fDateTime(bookingReview.createdAt)}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
