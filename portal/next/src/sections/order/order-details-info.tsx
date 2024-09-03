import type { SelectChangeEvent } from '@mui/material/Select';
import type { IOrderItem, IOrderDriver } from 'src/types/order';

import { useState } from 'react';

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

import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

type Props = {
  order?: IOrderItem;
  onAcceptJob: () => void;
  onAssignDriver: (driver: IOrderDriver) => void;
};

export function OrderDetailsInfo({ order, onAcceptJob, onAssignDriver }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [assignDriverOpen, setAssignDriverOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<IOrderDriver | string>(
    order?.driver ? JSON.stringify(order.driver) : ''
  );

  const handleConfirmAcceptJob = () => {
    onAcceptJob();
    setConfirmOpen(false);
  };

  const handleAssignDriver = () => {
    if (selectedDriver && typeof selectedDriver === 'string') {
      onAssignDriver(JSON.parse(selectedDriver));
      setAssignDriverOpen(false);
    }
  };

  const handleDriverChange = (event: SelectChangeEvent<string>) => {
    setSelectedDriver(event.target.value);
  };

  return (
    <Card>
      <CardHeader title="Details" />
      <Stack spacing={3} sx={{ p: 3 }}>
        {(order?.status === 'upcoming' || order?.status === 'completed') && (
          <Stack spacing={1.5} sx={{ borderBottom: '1px dashed', pb: 1.5 }}>
            <Typography variant="subtitle2" gutterBottom>
              Customer:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order?.customer.name}
            </Typography>
          </Stack>
        )}
        <Stack spacing={1.5} sx={{ borderBottom: '1px dashed', pb: 1.5 }}>
          <Typography variant="subtitle2" gutterBottom>
            Payment:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Amount: {fCurrency(order?.totalAmount)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Service Class: {order?.serviceClass}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Distance: {order?.distance} km
          </Typography>
        </Stack>
        {order?.driver && (
          <Stack spacing={1.5}>
            <Typography variant="subtitle2" gutterBottom>
              Driver:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Name: {order?.driver.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Car Registration: {order?.driver.carRegistration}
            </Typography>
            {order?.status === 'upcoming' && (
              <Button variant="outlined" color="primary" onClick={() => setAssignDriverOpen(true)}>
                Change Driver
              </Button>
            )}
          </Stack>
        )}
        {order?.status === 'offers' && (
          <Button variant="contained" color="primary" onClick={() => setConfirmOpen(true)}>
            Accept Job
          </Button>
        )}
        {order?.status === 'upcoming' && !order?.driver && (
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
                <MenuItem value={JSON.stringify({ name: 'Driver 1', carRegistration: 'XYZ 123' })}>
                  Driver 1 - XYZ 123
                </MenuItem>
                <MenuItem value={JSON.stringify({ name: 'Driver 2', carRegistration: 'ABC 456' })}>
                  Driver 2 - ABC 456
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        }
        action={
          <Button variant="contained" color="primary" onClick={handleAssignDriver}>
            Assign
          </Button>
        }
      />
    </Card>
  );
}
