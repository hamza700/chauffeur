'use client';

import { useState, useEffect } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import { useAuthContext } from 'src/auth/hooks';
import {
  getBookings,
  getVehicles,
  getChauffeurs,
  getAllVehicles,
  getAllChauffeurs,
} from 'src/auth/context/supabase/action';

import { DashboardYearlySales } from '../dashboard-yearly-sales';
import { DashboardWidgetSummary } from '../dashboard-widget-summary';

// ----------------------------------------------------------------------

export function OverviewDashboardView() {
  const { user } = useAuthContext();
  const [totals, setTotals] = useState({
    bookings: 0,
    chauffeurs: 0,
    vehicles: 0,
  });
  const [monthlyData, setMonthlyData] = useState<number[][]>([[], [], []]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user?.id) return;

        // Check if user is admin (adjust this condition based on your auth setup)
        const isAdmin = user.roles?.includes('admin');

        let bookingsRes;
        let chauffeursRes;
        let vehiclesRes;

        if (isAdmin) {
          // Admin gets all data
          [bookingsRes, chauffeursRes, vehiclesRes] = await Promise.all([
            getBookings(),
            getAllChauffeurs(),
            getAllVehicles(),
          ]);
        } else {
          [bookingsRes, chauffeursRes, vehiclesRes] = await Promise.all([
            getBookings(),
            getChauffeurs(user.id),
            getVehicles(user.id),
          ]);
        }

        console.log(bookingsRes, chauffeursRes, vehiclesRes);

        setTotals({
          bookings: bookingsRes.data?.length || 0,
          chauffeurs: chauffeursRes.data?.length || 0,
          vehicles: vehiclesRes.data?.length || 0,
        });

        // Process monthly data for current year only
        const currentYear = new Date().getFullYear();
        const monthlyTotals = Array.from({ length: 12 }, () => ({
          bookings: 0,
          chauffeurs: 0,
          vehicles: 0,
        }));

        // Process each data type
        bookingsRes.data?.forEach((booking) => {
          const date = new Date(booking.created_at);
          if (date.getFullYear() === currentYear) {
            monthlyTotals[date.getMonth()].bookings++;
          }
        });

        chauffeursRes.data?.forEach((chauffeur) => {
          const date = new Date(chauffeur.created_at);
          if (date.getFullYear() === currentYear) {
            monthlyTotals[date.getMonth()].chauffeurs++;
          }
        });

        vehiclesRes.data?.forEach((vehicle) => {
          const date = new Date(vehicle.created_at);
          if (date.getFullYear() === currentYear) {
            monthlyTotals[date.getMonth()].vehicles++;
          }
        });

        // Transform data for the chart
        setMonthlyData([
          monthlyTotals.map((m) => m.bookings),
          monthlyTotals.map((m) => m.chauffeurs),
          monthlyTotals.map((m) => m.vehicles),
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={4}>
          <DashboardWidgetSummary
            title="Total Bookings"
            total={totals.bookings}
            icon={`${CONFIG.site.basePath}/assets/icons/dashboard/hand-holding-us-dollar.svg`}
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <DashboardWidgetSummary
            title="Total Chauffeurs"
            total={totals.chauffeurs}
            color="success"
            icon={`${CONFIG.site.basePath}/assets/icons/dashboard/user-tie.svg`}
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <DashboardWidgetSummary
            title="Total Vehicles"
            total={totals.vehicles}
            color="secondary"
            icon={`${CONFIG.site.basePath}/assets/icons/dashboard/alternate-car.svg`}
          />
        </Grid>

        <Grid xs={12}>
          <DashboardYearlySales
            title="Yearly Activity"
            subheader="Monthly breakdown of bookings, chauffeurs, and vehicles"
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
                  name: 'Bookings',
                  data: monthlyData[0],
                },
                {
                  name: 'Chauffeurs',
                  data: monthlyData[1],
                },
                {
                  name: 'Vehicles',
                  data: monthlyData[2],
                },
              ],
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
