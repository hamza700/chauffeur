import type { IStorageFile } from 'src/types/file';

import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDoubleClick } from 'src/hooks/use-double-click';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { fData } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { varAlpha } from 'src/theme/styles';
import { supabase } from 'src/lib/supabase';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { FileThumbnail } from 'src/components/file-thumbnail';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import {
  getVehicleById,
  getProviderById,
  getChauffeurById,
} from 'src/auth/context/supabase/action';

import { FileManagerFileDetails } from './file-manager-file-details';

// ----------------------------------------------------------------------

type Props = {
  row: IStorageFile;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow: () => void;
  onRefreshData: () => void;
};

export function FileManagerTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onRefreshData,
}: Props) {
  const theme = useTheme();

  const { copy } = useCopyToClipboard();

  const details = useBoolean();

  const confirm = useBoolean();

  const popover = usePopover();

  const [documentStatus, setDocumentStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocumentStatus = async () => {
      try {
        const pathParts = row.path.split('/');
        let id;

        if (row.documentCategory === 'provider') {
          id = pathParts[1];
        } else if (row.documentCategory === 'chauffeur' || row.documentCategory === 'vehicle') {
          id = pathParts[3];
        }

        if (!id) return;

        switch (row.documentCategory) {
          case 'provider': {
            const { data } = await getProviderById(id);
            if (data) {
              switch (row.documentType) {
                case 'company_private_hire_license':
                  setDocumentStatus(data.company_private_hire_operator_license_status);
                  break;
                case 'proof_of_id':
                  setDocumentStatus(data.personal_id_or_passport_status);
                  break;
                case 'vat_registration':
                  setDocumentStatus(data.vat_registration_certificate_status);
                  break;
                default:
                  console.warn(`Unknown provider document type: ${row.documentType}`);
                  setDocumentStatus('pending');
              }
            }
            break;
          }

          case 'chauffeur': {
            const { data } = await getChauffeurById(id);
            if (data) {
              switch (row.documentType) {
                case 'drivers_license':
                  setDocumentStatus(data.drivers_license_status);
                  break;
                case 'private_hire_license':
                  setDocumentStatus(data.private_hire_license_status);
                  break;
                case 'profile_pic':
                  setDocumentStatus(data.profile_pic_status);
                  break;
                default:
                  console.warn(`Unknown chauffeur document type: ${row.documentType}`);
                  setDocumentStatus('pending');
              }
            }
            break;
          }

          case 'vehicle': {
            const { data } = await getVehicleById(id);
            if (data) {
              switch (row.documentType) {
                case 'private_hire_license':
                  setDocumentStatus(data.private_hire_license_status);
                  break;
                case 'mot_certificate':
                  setDocumentStatus(data.mot_test_certificate_status);
                  break;
                case 'insurance':
                  setDocumentStatus(data.vehicle_insurance_status);
                  break;
                case 'registration':
                  setDocumentStatus(data.vehicle_registration_status);
                  break;
                case 'leasing_contract':
                  setDocumentStatus(data.leasing_contract_status);
                  break;
                case 'vehicle_pic':
                  setDocumentStatus(data.vehicle_pic_status);
                  break;
                default:
                  console.warn(`Unknown vehicle document type: ${row.documentType}`);
                  setDocumentStatus('pending');
              }
            }
            break;
          }

          default:
            console.warn(`Unknown document category: ${row.documentCategory}`);
            setDocumentStatus('pending');
        }
      } catch (error) {
        console.error('Error fetching document status:', error);
        setDocumentStatus('pending');
      }
    };

    fetchDocumentStatus();
  }, [row]);

  const handleGetSignedUrl = async () => {
    try {
      const {
        data: { signedUrl },
        error,
      } = await supabase.storage.from('documents').createSignedUrl(row.path, 3600); // 1 hour expiry

      if (error) throw error;
      return signedUrl;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      toast.error('Failed to get link');
      return null;
    }
  };

  const handleCopy = async () => {
    const url = await handleGetSignedUrl();
    if (url) {
      copy(url);
      toast.success('Link copied!');
    }
  };

  const handleClick = useDoubleClick({
    click: () => {
      details.onTrue();
    },
    doubleClick: () => console.info('DOUBLE CLICK'),
  });

  const defaultStyles = {
    borderTop: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    borderBottom: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    '&:first-of-type': {
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
      borderLeft: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    },
    '&:last-of-type': {
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      borderRight: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    },
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'chauffeur':
        return 'Chauffeur Document';
      case 'vehicle':
        return 'Vehicle Document';
      case 'provider':
        return 'Provider Document';
      default:
        return category;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase.storage.from('documents').remove([row.path]);

      if (error) throw error;

      toast.success('File deleted successfully');
      onDeleteRow(); // Update local UI state
      onRefreshData(); // Refresh the data from server
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  return (
    <>
      <TableRow
        selected={selected}
        sx={{
          borderRadius: 2,
          [`&.${tableRowClasses.selected}, &:hover`]: {
            backgroundColor: 'background.paper',
            boxShadow: theme.customShadows.z20,
            transition: theme.transitions.create(['background-color', 'box-shadow'], {
              duration: theme.transitions.duration.shortest,
            }),
            '&:hover': { backgroundColor: 'background.paper', boxShadow: theme.customShadows.z20 },
          },
          [`& .${tableCellClasses.root}`]: { ...defaultStyles },
          ...(details.value && { [`& .${tableCellClasses.root}`]: { ...defaultStyles } }),
        }}
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onDoubleClick={() => console.info('ON DOUBLE CLICK')}
            onClick={onSelectRow}
            inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': `row-checkbox` }}
          />
        </TableCell>

        <TableCell onClick={handleClick}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <FileThumbnail file={row.type} />

            <Stack spacing={0.5}>
              <Typography
                noWrap
                variant="inherit"
                sx={{
                  maxWidth: 360,
                  cursor: 'pointer',
                  ...(details.value && { fontWeight: 'fontWeightBold' }),
                }}
              >
                {row.name}
              </Typography>
              {(row.chauffeurId || row.vehicleId) && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {row.chauffeurId
                    ? `Chauffeur ID: ${row.chauffeurId}`
                    : `Vehicle ID: ${row.vehicleId}`}
                </Typography>
              )}
            </Stack>
          </Stack>
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          {fData(row.size)}
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          {row.documentType}
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          {getCategoryLabel(row.documentCategory)}
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={fDate(row.modifiedAt)}
            secondary={fTime(row.modifiedAt)}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
          />
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant="soft"
            color={
              (documentStatus === 'approved' && 'success') ||
              (documentStatus === 'rejected' && 'error') ||
              'warning'
            }
          >
            {documentStatus || 'pending'}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              details.onTrue();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            View Details
          </MenuItem>

          <MenuItem
            onClick={async () => {
              popover.onClose();
              await handleCopy();
            }}
          >
            <Iconify icon="eva:link-2-fill" />
            Copy Link
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <FileManagerFileDetails
        item={row}
        onCopyLink={handleCopy}
        open={details.value}
        onClose={details.onFalse}
        onDelete={handleDelete}
        onRefreshData={onRefreshData}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              await handleDelete();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
