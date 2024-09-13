'use client';

// This ensures the component is a client component

import type { IOrderItem, IOrderDriver } from 'src/types/order';

import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { OrderDetailsInfo } from '../order-details-info';
import { OrderDetailsItems } from '../order-details-item';
import { OrderDetailsToolbar } from '../order-details-toolbar';
import { OrderDetailsHistory } from '../order-details-history';

// ----------------------------------------------------------------------

type Props = {
  order?: IOrderItem;
};

export function OrderDetailsView({ order }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(order?.status);

  const handleAcceptJob = () => {
    if (order) {
      setStatus('upcoming');
      router.push(paths.dashboard.bookings.root);
    }
  };

  const handleAssignDriver = (driver: IOrderDriver) => {
    if (order) {
      order.driver = driver;
      setStatus('upcoming');
    }
  };

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <DashboardContent>
      <OrderDetailsToolbar
        backLink={paths.dashboard.bookings.root}
        orderNumber={order.orderNumber}
        status={status}
        createdAt={new Date(order.date)} // Convert string to Date
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            {order && <OrderDetailsItems order={order} />}
            {order && <OrderDetailsHistory history={order.history} status={status} />}
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <OrderDetailsInfo
            order={order}
            onAcceptJob={handleAcceptJob}
            onAssignDriver={handleAssignDriver}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
