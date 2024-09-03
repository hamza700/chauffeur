import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import type { IVehicleItem, IVehicleTableFilters } from 'src/types/vehicle';

import * as XLSX from 'xlsx';
import { useCallback } from 'react';

import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

const exportToExcel = (data: IVehicleItem[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths
  const columnWidths = [
    { wpx: 120 }, // License Plate
    { wpx: 200 }, // Car Model
    { wpx: 120 }, // Colour
    { wpx: 120 }, // Production Year
    { wpx: 200 }, // Service Class
    { wpx: 100 }, // Status
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
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Vehicles');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// ----------------------------------------------------------------------

type Props = {
  onResetPage: () => void;
  filters: UseSetStateReturn<IVehicleTableFilters>;
  tableData: IVehicleItem[];
};

export function VehicleTableToolbar({ filters, onResetPage, tableData }: Props) {
  const handleFilterLicensePlate = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      filters.setState({ licensePlate: event.target.value });
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
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          value={filters.state.licensePlate}
          onChange={handleFilterLicensePlate}
          placeholder="Search by License Plate..."
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
          onClick={() => exportToExcel(tableData, 'Vehicles')}
        >
          Export
        </Button>
      </Stack>
    </Stack>
  );
}
