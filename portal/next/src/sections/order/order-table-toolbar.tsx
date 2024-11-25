import type { IDatePickerControl } from 'src/types/common';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import type { IBookingItem, IOrderTableFilters } from 'src/types/booking';

import * as XLSX from 'xlsx';
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formHelperTextClasses } from '@mui/material/FormHelperText';

import { Iconify } from 'src/components/iconify';

const exportToExcel = (data: IBookingItem[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths
  const columnWidths = [
    { wpx: 120 }, // Order Number
    { wpx: 120 }, // Date
    { wpx: 120 }, // Booking Type
    { wpx: 200 }, // Pickup Location
    { wpx: 200 }, // Dropoff Location
    { wpx: 120 }, // Service Class
    { wpx: 100 }, // Hours
    { wpx: 100 }, // Price
    { wpx: 80 }, // Empty for buttons
  ];
  worksheet['!cols'] = columnWidths;

  // Apply header styles
  const header = XLSX.utils.encode_row(0);
  for (let C = 0; C < data.length; C++) {
    const cell_address = XLSX.utils.encode_cell({ c: C, r: 0 });
    const cell = worksheet[cell_address];
    if (cell) {
      cell.s = {
        font: { bold: true },
        alignment: { horizontal: 'center', vertical: 'center' },
        fill: { fgColor: { rgb: 'FFFF00' } },
      };
    }
  }

  // Apply borders and alignment to all cells
  const range = XLSX.utils.decode_range(worksheet['!ref'] || '');
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = XLSX.utils.encode_cell({ c: C, r: R });
      const cell = worksheet[cell_address];
      if (cell) {
        cell.s = {
          border: {
            top: { style: 'thin', color: { auto: 1 } },
            right: { style: 'thin', color: { auto: 1 } },
            bottom: { style: 'thin', color: { auto: 1 } },
            left: { style: 'thin', color: { auto: 1 } },
          },
          alignment: { horizontal: 'center', vertical: 'center' },
        };
      }
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// ----------------------------------------------------------------------

type Props = {
  dateError: boolean;
  onResetPage: () => void;
  filters: UseSetStateReturn<IOrderTableFilters>;
  tableData: IBookingItem[];
};

export function OrderTableToolbar({ filters, onResetPage, dateError, tableData }: Props) {
  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      filters.setState({ name: event.target.value });
    },
    [filters, onResetPage]
  );

  const handleFilterStartDate = useCallback(
    (newValue: IDatePickerControl) => {
      onResetPage();
      filters.setState({ startDate: newValue });
    },
    [filters, onResetPage]
  );

  const handleFilterEndDate = useCallback(
    (newValue: IDatePickerControl) => {
      onResetPage();
      filters.setState({ endDate: newValue });
    },
    [filters, onResetPage]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      <DatePicker
        label="Start date"
        value={filters.state.startDate}
        onChange={handleFilterStartDate}
        slotProps={{ textField: { fullWidth: true } }}
        sx={{ maxWidth: { md: 200 } }}
      />

      <DatePicker
        label="End date"
        value={filters.state.endDate}
        onChange={handleFilterEndDate}
        slotProps={{
          textField: {
            fullWidth: true,
            error: dateError,
            helperText: dateError ? 'End date must be later than start date' : null,
          },
        }}
        sx={{
          maxWidth: { md: 200 },
          [`& .${formHelperTextClasses.root}`]: {
            position: { md: 'absolute' },
            bottom: { md: -40 },
          },
        }}
      />

      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          value={filters.state.name}
          onChange={handleFilterName}
          placeholder="Search order number or location..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="outlined"
          startIcon={<Iconify icon="solar:export-bold" />}
          onClick={() => exportToExcel(tableData, 'Bookings')}
        >
          Export
        </Button>
      </Stack>
    </Stack>
  );
}
