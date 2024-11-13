import type { IUserItem } from 'src/types/user';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { IBookingItem, IAvailableJobsItem } from 'src/types/order';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
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
} from 'src/utils/data-transformers';

import { ConfirmDialog } from 'src/components/custom-dialog';

import { useAuthContext } from 'src/auth/hooks';
import { getVehicles, getChauffeurs, insertBooking, deleteAvailableJob } from 'src/auth/context/supabase/action';

// ----------------------------------------------------------------------

type Props = {
  order?: IAvailableJobsItem | IBookingItem;
  onAcceptJob: () => void;
  onAssignDriver: (driver: IUserItem) => void;
};

export function OrderDetailsInfo({ order, onAcceptJob, onAssignDriver }: Props) {
  const { user } = useAuthContext();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [assignDriverOpen, setAssignDriverOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [eligibleChauffeurs, setEligibleChauffeurs] = useState<IUserItem[]>([]);

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
        }
      }
    };

    fetchChauffeurAndVehicles();
  }, [user?.id, order?.serviceClass]);

  const handleConfirmAcceptJob = async () => {
    if (order) {
      try {
        // Just trigger the UI update without database insertion
        onAcceptJob();
        setConfirmOpen(false);
      } catch (error) {
        console.error('Error accepting job:', error);
        // Add error handling/notification here
      }
    }
  };

  const handleAssignDriver = async () => {
    if (selectedDriver && order) {
      try {
        const chauffeurData = JSON.parse(selectedDriver) as IUserItem;

        // Insert into bookings table
        const bookingData = transformToBookingData({
          ...order,
          status: 'confirmed',
          providerId: user?.id,
          chauffeurId: chauffeurData.id,
        });

        await insertBooking(bookingData);
        
        // Delete from available_jobs table
        if (isBooking) {
          await deleteAvailableJob(order.id);
        }
        
        onAssignDriver(chauffeurData);
        setAssignDriverOpen(false);
      } catch (error) {
        console.error('Error assigning driver:', error);
        // Add error handling/notification here
      }
    }
  };

  const handleDriverChange = (event: SelectChangeEvent<string>) => {
    setSelectedDriver(event.target.value);
  };

  const isBooking = 'status' in order;

  return (
    <Card>
      <CardHeader title="Details" />
      <Stack spacing={3} sx={{ p: 3 }}>
        {isBooking && (
          <Stack spacing={1.5} sx={{ borderBottom: '1px dashed', pb: 1.5 }}>
            <Typography variant="subtitle2" gutterBottom>
              Customer:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {`${order.customerFirstName} ${order.customerLastName}`}
            </Typography>
          </Stack>
        )}
        <Stack spacing={1.5} sx={{ borderBottom: '1px dashed', pb: 1.5 }}>
          <Typography variant="subtitle2" gutterBottom>
            Payment:
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

        {isBooking && (order as IBookingItem).chauffeurId && (
          <Stack spacing={1.5}>
            <Typography variant="subtitle2" gutterBottom>
              Driver:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Name: {`${order.customerFirstName} ${order.customerLastName}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Car Registration: {(order as IBookingItem).chauffeurId}
            </Typography>
            {(order as IBookingItem).status === 'confirmed' && (
              <Button variant="outlined" color="primary" onClick={() => setAssignDriverOpen(true)}>
                Change Driver
              </Button>
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
    </Card>
  );
}
