import type { IUserItem } from 'src/types/user';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { IBookingItem, IAvailableJobsItem } from 'src/types/booking';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { fCurrency } from 'src/utils/format-number';
import {
  transformVehicleData,
  transformToBookingData,
  transformChauffeurData,
  transformToAvailableJobsData,
} from 'src/utils/data-transformers';

import { toast } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { useAuthContext } from 'src/auth/hooks';
import {
  getVehicles,
  getChauffeurs,
  insertBooking,
  updateBooking,
  deleteBooking,
  deleteAvailableJob,
  insertAvailableJob,
} from 'src/auth/context/supabase/action';

// ----------------------------------------------------------------------

type Props = {
  order: IAvailableJobsItem | IBookingItem;
  onAcceptJob: () => void;
  onAssignDriver: (driver: IUserItem) => void;
  onCancelJob?: () => void;
};

export function OrderDetailsInfo({ order, onAcceptJob, onAssignDriver, onCancelJob }: Props) {
  const { user } = useAuthContext();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [assignDriverOpen, setAssignDriverOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [eligibleChauffeurs, setEligibleChauffeurs] = useState<IUserItem[]>([]);
  const [cancelJobOpen, setCancelJobOpen] = useState(false);

  useEffect(() => {
    const fetchChauffeurAndVehicles = async () => {
      if (user?.id && order?.serviceClass) {
        try {
          // Get all chauffeurs for this provider
          const { data: chauffeursData } = await getChauffeurs(user.id);
          if (!chauffeursData) return;

          // Get all vehicles for this provider
          const { data: vehiclesData } = await getVehicles(user.id);
          if (!vehiclesData) return;

          // Transform the data
          const chauffeurs = chauffeursData.map(transformChauffeurData);
          const vehicles = vehiclesData.map(transformVehicleData);

          // Filter chauffeurs based on multiple criteria
          const eligible = chauffeurs.filter((chauffeur) => {
            // Check chauffeur status
            if (chauffeur.status !== 'approved' || !chauffeur.isOnboarded) {
              return false;
            }

            // Find matching vehicle for this chauffeur
            const chauffeurVehicle = vehicles.find(
              (vehicle) => vehicle.licensePlate === chauffeur.licensePlate
            );

            // Check vehicle criteria
            if (!chauffeurVehicle) return false;

            return (
              chauffeurVehicle.status === 'approved' &&
              chauffeurVehicle.serviceClass === order.serviceClass
            );
          });

          setEligibleChauffeurs(eligible);
        } catch (error) {
          console.error('Error fetching chauffeur and vehicle data:', error);
          toast.error('Error fetching chauffeur and vehicle data');
        }
      }
    };

    fetchChauffeurAndVehicles();
  }, [user?.id, order?.serviceClass]);

  const handleConfirmAcceptJob = async () => {
    if (order) {
      try {
        // Just update UI state, no database operation yet
        onAcceptJob();
        setConfirmOpen(false);
      } catch (error) {
        console.error('Error accepting job:', error);
        toast.error('Error accepting job');
      }
    }
  };

  const handleAssignDriver = async () => {
    if (selectedDriver && order) {
      try {
        const chauffeurData = JSON.parse(selectedDriver) as IUserItem;

        if (isBooking && (order as IBookingItem).chauffeurId) {
          // Case 1: Changing driver for existing booking
          await updateBooking(order.id, {
            chauffeur_id: chauffeurData.id,
            status: 'confirmed',
          });
        } else {
          // Case 2: First time assigning driver (creates booking)
          const bookingData = transformToBookingData({
            ...order,
            status: 'confirmed',
            providerId: user?.id,
            chauffeurId: chauffeurData.id,
            createdAt: new Date().toISOString(),
          });

          const { data: newBooking } = await insertBooking(bookingData);

          // Delete from available_jobs if this was a new job
          if (newBooking) {
            await deleteAvailableJob(order.id);
          }
        }

        onAssignDriver(chauffeurData);
        setAssignDriverOpen(false);
      } catch (error) {
        console.error('Error assigning driver:', error);
        toast.error('Error assigning driver');
      }
    }
  };

  const handleDriverChange = (event: SelectChangeEvent<string>) => {
    setSelectedDriver(event.target.value);
  };

  const handleCancelJob = async () => {
    if (order) {
      try {
        // Transform booking back to available job format
        const availableJobData = transformToAvailableJobsData({
          ...order,
          createdAt: new Date().toISOString(),
          // Remove booking-specific fields
          status: undefined,
          chauffeurId: undefined,
          providerId: undefined,
        });

        // Insert into available_jobs table first
        const { data: newAvailableJob } = await insertAvailableJob(availableJobData);

        if (newAvailableJob) {
          // Only delete from bookings if insert was successful
          await deleteBooking(order.id);

          // Close dialog and update UI
          setCancelJobOpen(false);

          // Call the callback to update parent component
          if (onCancelJob) {
            onCancelJob();
          }
        } else {
          throw new Error('Failed to create available job');
        }
      } catch (error) {
        console.error('Error in handleCancelJob:', error);
        toast.error('Failed to cancel job. Please try again.');
      }
    }
  };

  const isBooking = 'status' in order;

  return (
    <Card>
      <CardHeader title="Price Details" />
      <Stack spacing={3} sx={{ p: 3 }}>
        {isBooking && (
          <Stack spacing={1.5}>
            <Typography variant="subtitle2" gutterBottom>
              Customer
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Name:{`${order.customerFirstName} ${order.customerLastName}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: {order.customerEmail}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone Number: {order.customerPhoneNumber}
            </Typography>
          </Stack>
        )}

        <Divider />

        <Stack spacing={1.5}>
          <Typography variant="subtitle2" gutterBottom>
            Payment
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Amount: {fCurrency(order?.driverAmount || 0)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Service Class: {order?.serviceClass}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Distance: {order?.distance}
          </Typography>
        </Stack>

        <Divider />

        {isBooking && (order as IBookingItem).chauffeurId && (
          <Stack spacing={1.5}>
            <Typography variant="subtitle2" gutterBottom>
              Driver
            </Typography>
            {eligibleChauffeurs.map(
              (chauffeur) =>
                chauffeur.id === (order as IBookingItem).chauffeurId && (
                  <Box key={chauffeur.id}>
                    <Typography variant="body2" color="text.secondary">
                      Name: {`${chauffeur.firstName} ${chauffeur.lastName}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Car Registration: {chauffeur.licensePlate}
                    </Typography>
                  </Box>
                )
            )}
            {(order as IBookingItem).status !== 'completed' && (
              <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={() => setAssignDriverOpen(true)}
                >
                  Change Driver
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  onClick={() => setCancelJobOpen(true)}
                >
                  Cancel Job
                </Button>
              </Stack>
            )}
          </Stack>
        )}

        {!isBooking && (
          <Button variant="contained" color="primary" onClick={() => setConfirmOpen(true)}>
            Accept Job
          </Button>
        )}

        {isBooking &&
          (order as IBookingItem).status === 'confirmed' &&
          !(order as IBookingItem).chauffeurId && (
            <Button variant="contained" color="primary" onClick={() => setAssignDriverOpen(true)}>
              Assign Driver
            </Button>
          )}
      </Stack>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Accept Job"
        content="Are you sure you want to accept this job?"
        action={
          <Button variant="contained" color="primary" onClick={handleConfirmAcceptJob}>
            Accept
          </Button>
        }
      />

      <ConfirmDialog
        open={assignDriverOpen}
        onClose={() => setAssignDriverOpen(false)}
        title="Assign Driver"
        content={
          <Box>
            <FormControl fullWidth>
              <InputLabel>Driver</InputLabel>
              <Select value={selectedDriver} onChange={handleDriverChange} label="Driver">
                {eligibleChauffeurs.map((chauffeur) => (
                  <MenuItem key={chauffeur.id} value={JSON.stringify(chauffeur)}>
                    {`${chauffeur.firstName} ${chauffeur.lastName} - ${chauffeur.licensePlate}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        }
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={handleAssignDriver}
            disabled={!selectedDriver}
          >
            Assign
          </Button>
        }
      />

      <ConfirmDialog
        open={cancelJobOpen}
        onClose={() => setCancelJobOpen(false)}
        title="Cancel Job"
        content="Are you sure you want to cancel this job? This action cannot be undone."
        action={
          <Button variant="contained" color="error" onClick={handleCancelJob}>
            Cancel Job
          </Button>
        }
      />
    </Card>
  );
}
