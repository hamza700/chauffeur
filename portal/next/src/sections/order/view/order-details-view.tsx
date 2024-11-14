'use client';

import type { IUserItem } from 'src/types/user';
import type {
  IBookingItem,
  IBookingReview,
  IAvailableJobsItem,
  IBookingHistoryItem,
} from 'src/types/booking';

import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import {
  transformBookingData,
  transformAvailableJobsData,
  transformBookingReviewData,
  transformBookingHistoryData,
} from 'src/utils/data-transformers';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';

import {
  getBookingById,
  getAvailableJobById,
  getBookingReviewById,
  getBookingHistoryById,
} from 'src/auth/context/supabase/action';

import { OrderDetailsInfo } from '../order-details-info';
import { OrderDetailsItems } from '../order-details-item';
import { OrderDetailsReview } from '../order-details-review';
import { OrderDetailsToolbar } from '../order-details-toolbar';
import { OrderDetailsHistory } from '../order-details-history';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export function OrderDetailsView({ id }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [currentOrder, setCurrentOrder] = useState<IAvailableJobsItem | IBookingItem | null>(null);
  const [bookingHistory, setBookingHistory] = useState<IBookingHistoryItem | null>(null);
  const [bookingReview, setBookingReview] = useState<IBookingReview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const isAvailableJob = pathname?.includes('available-job');

        if (isAvailableJob) {
          const { data: availableJobData } = await getAvailableJobById(id);
          if (availableJobData) {
            setCurrentOrder(transformAvailableJobsData(availableJobData));
          }
        } else {
          const { data: bookingData } = await getBookingById(id);
          if (bookingData) {
            const transformedBooking = transformBookingData(bookingData);
            setCurrentOrder(transformedBooking);

            if (transformedBooking.status === 'completed') {
              const { data: historyData } = await getBookingHistoryById(id);
              if (historyData) {
                setBookingHistory(transformBookingHistoryData(historyData));
              }

              const { data: reviewData } = await getBookingReviewById(id);
              if (reviewData) {
                setBookingReview(transformBookingReviewData(reviewData));
              }
            }
          }
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id, pathname]);

  const isBooking = currentOrder && 'status' in currentOrder;

  const handleAcceptJob = () => {
    if (currentOrder && !isBooking) {
      // Update local state
      setCurrentOrder({
        ...currentOrder,
        status: 'confirmed',
      } as IBookingItem);
    }
  };

  const handleAssignDriver = (driver: IUserItem) => {
    if (currentOrder) {
      // Update local state with driver information
      setCurrentOrder({
        ...currentOrder,
        chauffeurId: driver.id,
        status: 'confirmed',
      } as IBookingItem);

      // Redirect to bookings list
      router.push(paths.dashboard.bookings.root);
    }
  };

  if (!currentOrder) {
    return null;
  }

  return (
    <DashboardContent>
      <OrderDetailsToolbar
        backLink={paths.dashboard.bookings.root}
        orderNumber={currentOrder.orderNumber}
        status={isBooking ? (currentOrder as IBookingItem).status : 'offers'}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <OrderDetailsItems order={currentOrder} />

            {isBooking && (currentOrder as IBookingItem).status === 'completed' && (
              <OrderDetailsHistory
                bookingHistory={bookingHistory}
                status={(currentOrder as IBookingItem).status}
              />
            )}
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <Stack spacing={3}>
            <OrderDetailsInfo
              order={currentOrder}
              onAcceptJob={handleAcceptJob}
              onAssignDriver={handleAssignDriver}
              onCancelJob={() => {
                router.push(paths.dashboard.bookings.root);
              }}
            />

            {isBooking && (currentOrder as IBookingItem).status === 'completed' && (
              <OrderDetailsReview bookingReview={bookingReview} />
            )}
          </Stack>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
