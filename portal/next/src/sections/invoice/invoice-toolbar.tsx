import type { IInvoice } from 'src/types/invoice';

import { PDFDownloadLink } from '@react-pdf/renderer';

import Stack from '@mui/material/Stack';
import NoSsr from '@mui/material/NoSsr';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';

import { InvoicePDF } from './invoice-pdf';

// ----------------------------------------------------------------------

type Props = {
  invoice?: IInvoice;
  currentStatus: string;
  statusOptions: { value: string; label: string }[];
  onChangeStatus: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function InvoiceToolbar({ invoice, currentStatus, statusOptions, onChangeStatus }: Props) {
  const renderDownload = (
    <NoSsr>
      <PDFDownloadLink
        document={
          invoice ? <InvoicePDF invoice={invoice} currentStatus={currentStatus} /> : <span />
        }
        fileName={invoice?.invoiceNumber}
        style={{ textDecoration: 'none' }}
      >
        {({ loading }) => (
          <Tooltip title="Download">
            <Button
              variant="contained"
              startIcon={
                loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <Iconify icon="eva:cloud-download-fill" />
                )
              }
              sx={{ minWidth: 120 }}
            >
              {loading ? 'Loading...' : 'Download'}
            </Button>
          </Tooltip>
        )}
      </PDFDownloadLink>
    </NoSsr>
  );

  return (
    <Stack
      spacing={3}
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      sx={{ mb: { xs: 3, md: 5 } }}
    >
      <Stack direction="row" spacing={1} flexGrow={1} sx={{ width: 1 }}>
        {renderDownload}
      </Stack>

      <TextField
        fullWidth
        select
        label="Status"
        value={currentStatus}
        onChange={onChangeStatus}
        inputProps={{ id: `status-select-label` }}
        InputLabelProps={{ htmlFor: `status-select-label` }}
        sx={{ maxWidth: 160 }}
      >
        {statusOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}
