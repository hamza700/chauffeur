import type { IProviderAccount } from 'src/types/provider';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { ProviderQuickEditForm } from './provider-quick-edit-form';

// ----------------------------------------------------------------------

type Props = {
  row: IProviderAccount;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow: () => void;
  onRefreshData?: () => void;
};

export function ProviderTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onRefreshData,
}: Props) {
  const confirm = useBoolean();
  const quickEdit = useBoolean();

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <ListItemText
              disableTypography
              primary={
                <Typography variant="body2" noWrap>
                  {row.companyName}
                </Typography>
              }
              secondary={
                <Typography noWrap variant="body2" sx={{ color: 'text.disabled' }}>
                  {row.companyRegistrationNumber}
                </Typography>
              }
            />
          </Stack>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.email}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.phoneNumber}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.city}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.state}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.address}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.postCode}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.country}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'approved' && 'success') ||
              (row.status === 'pending' && 'warning') ||
              (row.status === 'rejected' && 'error') ||
              'default'
            }
          >
            {row.status}
          </Label>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center">
            <Tooltip title="Quick Edit" placement="top" arrow>
              <IconButton
                color={quickEdit.value ? 'inherit' : 'default'}
                onClick={quickEdit.onTrue}
              >
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>

            <IconButton color="error" onClick={() => confirm.onTrue()}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>

      <ProviderQuickEditForm
        currentProvider={row}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
        onRefreshData={onRefreshData}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
