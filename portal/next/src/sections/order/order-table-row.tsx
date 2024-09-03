import type { IOrderItem } from 'src/types/order';

import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  row: IOrderItem;
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
          secondary={fTime(row.date)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
        />
      </TableCell>

      <TableCell>{row.pickupLocation}</TableCell>

      <TableCell>{row.dropoffLocation}</TableCell>

      <TableCell>{row.serviceClass}</TableCell>

      <TableCell>
        <ListItemText
          primary={fCurrency(row.totalAmount)}
          secondary={row.distance}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
        />
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === 'completed' && 'success') ||
            (row.status === 'upcoming' && 'warning') ||
            (row.status === 'offers' && 'info') ||
            'default'
          }
        >
          {row.status}
        </Label>
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
