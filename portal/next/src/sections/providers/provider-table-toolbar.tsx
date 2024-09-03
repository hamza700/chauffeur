import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import type { IProviderAccount, IProvidersTableFilters } from 'src/types/user';

import * as XLSX from 'xlsx';
import { useCallback } from 'react';

import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

const exportToExcel = (data: IProviderAccount[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths
  const columnWidths = [
    { wpx: 120 }, // Company Name
    { wpx: 200 }, // Email
    { wpx: 150 }, // Phone Number
    { wpx: 120 }, // City
    { wpx: 120 }, // State
    { wpx: 200 }, // Address
    { wpx: 100 }, // Post Code
    { wpx: 100 }, // Country
    { wpx: 100 }, // Status
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
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Providers');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// ----------------------------------------------------------------------

type Props = {
  onResetPage: () => void;
  filters: UseSetStateReturn<IProvidersTableFilters>;
  tableData: IProviderAccount[];
};

export function ProviderTableToolbar({ filters, onResetPage, tableData }: Props) {
  const handleFilterCompanyName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      filters.setState({ companyName: event.target.value });
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
          value={filters.state.companyName}
          onChange={handleFilterCompanyName}
          placeholder="Search by Company Name..."
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
          onClick={() => exportToExcel(tableData, 'Providers')}
        >
          Export
        </Button>{' '}
      </Stack>
    </Stack>
  );
}
