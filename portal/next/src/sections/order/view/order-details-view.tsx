'use client';

import type { IUserItem } from 'src/types/user';
import type { IBookingItem, IAvailableJobsItem } from 'src/types/order';

import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { transformBookingData, transformAvailableJobsData } from 'src/utils/data-transformers';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';

import { getBookingById, getAvailableJobById } from 'src/auth/context/supabase/action';

import { OrderDetailsInfo } from '../order-details-info';
import { OrderDetailsItems } from '../order-details-item';
import { OrderDetailsToolbar } from '../order-details-toolbar';
import { OrderDetailsHistory } from '../order-details-history';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export function OrderDetailsView({ id }: Props) {
  const router = useRouter();
  const [currentOrder, setCurrentOrder] = useState<IAvailableJobsItem | IBookingItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Try to fetch as available job first
        const { data: availableJobData } = await getAvailableJobById(id);

        if (availableJobData) {
          setCurrentOrder(transformAvailableJobsData(availableJobData));
          return;
        }

        // If not an available job, try to fetch as booking
        const { data: bookingData } = await getBookingById(id);

        if (bookingData) {
          setCurrentOrder(transformBookingData(bookingData));
        }
      } catch (err) {
        toast.error('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

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

            {isBooking && (
              <OrderDetailsHistory
                history={(currentOrder as IBookingItem).history}
                status={(currentOrder as IBookingItem).status}
              />
            )}
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <OrderDetailsInfo
            order={currentOrder}
            onAcceptJob={handleAcceptJob}
            onAssignDriver={handleAssignDriver}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
