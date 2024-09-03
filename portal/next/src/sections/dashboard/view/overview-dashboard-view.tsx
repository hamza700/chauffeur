'use client';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { _bookings } from 'src/_mock';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import { DashboardYearlySales } from '../dashboard-yearly-sales';
import { DashboardWidgetSummary } from '../dashboard-widget-summary';
import { DashboardBookingDetails } from '../dashboard-booking-details';

// ----------------------------------------------------------------------

export function OverviewDashboardView() {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={4}>
          <DashboardWidgetSummary
            title="Total Bookings"
            total={6}
            icon={`${CONFIG.site.basePath}/assets/icons/dashboard/hand-holding-us-dollar.svg`}
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <DashboardWidgetSummary
            title="Total Chauffeurs"
            total={3}
            color="success"
            icon={`${CONFIG.site.basePath}/assets/icons/dashboard/user-tie.svg`}
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <DashboardWidgetSummary
            title="Total Vehicles"
            total={2}
            color="secondary"
            icon={`${CONFIG.site.basePath}/assets/icons/dashboard/alternate-car.svg`}
          />
        </Grid>

        <Grid xs={12}>
          <DashboardYearlySales
            title="Yearly sales"
            subheader="(+43%) than last year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  name: '2022',
                  data: [
                    {
                      name: 'Total bookings',
                      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                    {
                      name: 'Total chauffeurs',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    },
                    {
                      name: 'Total vehicles',
                      data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                  ],
                },
                {
                  name: '2023',
                  data: [
                    {
                      name: 'Total bookings',
                      data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                    {
                      name: 'Total chauffeurs',
                      data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                    {
                      name: 'Total vehicles',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12}>
          <DashboardBookingDetails
            title="Booking details"
            tableData={_bookings}
            headLabel={[
              { id: 'destination', label: 'Destination' },
              { id: 'customer', label: 'Customer' },
              { id: 'checkIn', label: 'Check in' },
              { id: 'checkOut', label: 'Check out' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
