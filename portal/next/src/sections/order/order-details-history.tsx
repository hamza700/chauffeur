import type { IBookingHistoryItem } from 'src/types/booking';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

import { fDateTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

type Props = {
  bookingHistory: IBookingHistoryItem | null;
  status: string;
};

export function OrderDetailsHistory({ bookingHistory, status }: Props) {
  if (!bookingHistory) {
    return null;
  }

  return (
    <Card>
      <CardHeader title="Timeline" />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Timeline
          sx={{
            p: 0,
            m: 0,
            [`& .${timelineItemClasses.root}:before`]: { flex: 0, padding: 0 },
          }}
        >
          {bookingHistory.startTime && (
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="primary" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="subtitle2">Journey Started</Typography>
                <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
                  {fDateTime(bookingHistory.startTime)}
                </Box>
              </TimelineContent>
            </TimelineItem>
          )}

          {bookingHistory.arrivedPickupTime && (
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="primary" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="subtitle2">Arrived at Pickup Location</Typography>
                <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
                  {fDateTime(bookingHistory.arrivedPickupTime)}
                </Box>
              </TimelineContent>
            </TimelineItem>
          )}

          {bookingHistory.customerOnboardedTime && (
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="primary" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="subtitle2">Customer Onboarded</Typography>
                <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
                  {fDateTime(bookingHistory.customerOnboardedTime)}
                </Box>
              </TimelineContent>
            </TimelineItem>
          )}

          {bookingHistory.arrivedDestinationTime && (
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="success" />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="subtitle2">Arrived at Destination</Typography>
                <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
                  {fDateTime(bookingHistory.arrivedDestinationTime)}
                </Box>
              </TimelineContent>
            </TimelineItem>
          )}
        </Timeline>
      </Stack>
    </Card>
  );
}
