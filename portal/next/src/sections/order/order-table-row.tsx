import type { IBookingItem, IAvailableJobsItem } from 'src/types/booking';

import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  row: IBookingItem | IAvailableJobsItem;
  onViewRow: () => void;
};

export function OrderTableRow({ row, onViewRow }: Props) {
  return (
    <TableRow hover>
      <TableCell>
        <Link color="inherit" onClick={onViewRow} underline="always" sx={{ cursor: 'pointer' }}>
          {row.orderNumber}
        </Link>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(row.date)}
          secondary={fTime(row.time)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
        />
      </TableCell>

      <TableCell>{row.bookingType}</TableCell>

      <TableCell>{row.pickupLocation}</TableCell>

      <TableCell>{row.dropoffLocation}</TableCell>

      <TableCell>{row.serviceClass}</TableCell>

      <TableCell>{row.hours}</TableCell>

      <TableCell>
        <ListItemText
          primary={fCurrency(row.driverAmount)}
          secondary={row.distance}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
        />
      </TableCell>

      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
        <Button variant="outlined" color="primary" onClick={onViewRow}>
          <Iconify icon="solar:eye-bold" />
          View Details
        </Button>
      </TableCell>
    </TableRow>
  );
}
