import type { IStorageFile } from 'src/types/file';
import type { DrawerProps } from '@mui/material/Drawer';
import type { VehicleData, ProviderData, ChauffeurData } from 'src/auth/context/supabase/action';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { fData } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

import { supabase } from 'src/lib/supabase';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { FileThumbnail } from 'src/components/file-thumbnail';

import {
  updateVehicle,
  getVehicleById,
  updateProvider,
  getProviderById,
  updateChauffeur,
  getChauffeurById,
} from 'src/auth/context/supabase/action';

// ----------------------------------------------------------------------

type Props = DrawerProps & {
  item: IStorageFile;
  onClose: () => void;
  onDelete: () => void;
  onCopyLink: () => void;
};

export function FileManagerFileDetails({
  item,
  open,
  onClose,
  onDelete,
  onCopyLink,
  ...other
}: Props) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { name, type, status, size, modifiedAt, path } = item;
  const [documentStatus, setDocumentStatus] = useState<string | null>(null);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(documentStatus || 'pending');
  const [confirmDelete, setConfirmDelete] = useState(false);
  useEffect(() => {
    const getSignedUrl = async () => {
      try {
        setLoading(true);

        // Split the path to get the directory and filename
        const pathParts = path.split('/');
        const fileName = pathParts.pop(); // Get the last part (filename)
        const directory = pathParts.join('/'); // Rejoin the rest of the path

        console.log('Directory:', directory);
        console.log('Filename:', fileName);

        // Get signed URL with the same approach as getDocument
        const {
          data: { signedUrl },
          error,
        } = await supabase.storage
          .from('documents')
          .createSignedUrl(`${directory}/${fileName}`, 3600);

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (signedUrl) {
          console.log('Signed URL created successfully');
          setSignedUrl(signedUrl);
        }
      } catch (error) {
        console.error('Error getting signed URL:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open && path) {
      getSignedUrl();
    }

    return () => {
      setSignedUrl(null);
      setLoading(true);
    };
  }, [path, open]);

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        setLoading(true);
        const docType = item.documentType;
        const category = item.documentCategory;

        // Parse entityId from path based on category
        // Provider path: providers/003dab27-2e0f-4963-87bd-b00ab7cf509a/company_private_hire_license/0
        // Chauffeur path: providers/{providerId}/chauffeurs/{chauffeurId}/drivers_license/0
        // Vehicle path: providers/{providerId}/vehicles/{vehicleId}/vehicle_insurance/0
        const pathParts = item.path.split('/');
        let id;

        if (category === 'provider') {
          id = pathParts[1]; // Provider UUID is at index 1
        } else if (category === 'chauffeur') {
          id = pathParts[3]; // Chauffeur ID is at index 3
        } else if (category === 'vehicle') {
          id = pathParts[3]; // Vehicle ID is at index 3
        }

        console.log('Fetching details for:', { category, docType, id, path: item.path });

        if (!id) {
          console.error('No entity ID found in path:', item.path);
          return;
        }

        switch (category) {
          case 'provider': {
            const { data } = await getProviderById(id);
            console.log('Provider data:', data);
            if (data) {
              switch (docType) {
                case 'company_private_hire_license':
                  setDocumentStatus(data.company_private_hire_operator_license_status);
                  setExpiryDate(data.company_private_hire_operator_license_expiry_date);
                  console.log(
                    'Setting expiry date:',
                    data.company_private_hire_operator_license_expiry_date
                  );
                  break;
                case 'proof_of_id':
                  setDocumentStatus(data.personal_id_or_passport_status);
                  setExpiryDate(data.personal_id_or_passport_expiry_date);
                  break;
                case 'vat_registration':
                  setDocumentStatus(data.vat_registration_certificate_status);
                  setExpiryDate(data.vat_registration_certificate_expiry_date);
                  break;
                default:
                  console.warn(`Unknown provider document type: ${docType}`);
                  setDocumentStatus('pending');
                  setExpiryDate(null);
              }
            }
            break;
          }

          case 'chauffeur': {
            const { data } = await getChauffeurById(id);
            console.log('Chauffeur data:', data);
            if (data) {
              switch (docType) {
                case 'drivers_license':
                  setDocumentStatus(data.drivers_license_status);
                  setExpiryDate(data.drivers_license_expiry_date);
                  break;
                case 'private_hire_license':
                  setDocumentStatus(data.private_hire_license_status);
                  setExpiryDate(data.private_hire_license_expiry_date);
                  break;
                case 'profile_pic':
                  setDocumentStatus(data.profile_pic_status);
                  setExpiryDate(null);
                  break;
                default:
                  console.warn(`Unknown chauffeur document type: ${docType}`);
                  setDocumentStatus('pending');
                  setExpiryDate(null);
              }
            }
            break;
          }

          case 'vehicle': {
            const { data } = await getVehicleById(id);
            console.log('Vehicle data:', data);
            if (data) {
              switch (docType) {
                case 'private_hire_license':
                  setDocumentStatus(data.private_hire_license_status);
                  setExpiryDate(data.private_hire_license_expiry_date);
                  break;
                case 'mot_certificate':
                  setDocumentStatus(data.mot_test_certificate_status);
                  setExpiryDate(data.mot_test_certificate_expiry_date);
                  break;
                case 'insurance':
                  setDocumentStatus(data.vehicle_insurance_status);
                  setExpiryDate(data.vehicle_insurance_expiry_date);
                  break;
                case 'registration':
                  setDocumentStatus(data.vehicle_registration_status);
                  setExpiryDate(null);
                  break;
                case 'leasing_contract':
                  setDocumentStatus(data.leasing_contract_status);
                  setExpiryDate(null);
                  break;
                case 'vehicle_pic':
                  setDocumentStatus(data.vehicle_pic_status);
                  setExpiryDate(null);
                  break;
                default:
                  console.warn(`Unknown vehicle document type: ${docType}`);
                  setDocumentStatus('pending');
                  setExpiryDate(null);
              }
            }
            break;
          }

          default:
            console.warn(`Unknown document category: ${category}`);
            setDocumentStatus('pending');
            setExpiryDate(null);
        }
      } catch (error) {
        console.error('Error fetching document details:', error);
        setDocumentStatus('pending');
        setExpiryDate(null);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchDocumentDetails();
    }
  }, [open, item]);

  const handleStatusUpdate = async () => {
    try {
      const pathParts = item.path.split('/');
      let id;

      if (item.documentCategory === 'provider') {
        id = pathParts[1];
      } else if (item.documentCategory === 'chauffeur' || item.documentCategory === 'vehicle') {
        id = pathParts[3];
      }

      if (!id) return;

      switch (item.documentCategory) {
        case 'provider': {
          const updatedFields: Partial<ProviderData> = {};
          switch (item.documentType) {
            case 'company_private_hire_license':
              updatedFields.company_private_hire_operator_license_status = newStatus;
              break;
            case 'proof_of_id':
              updatedFields.personal_id_or_passport_status = newStatus;
              break;
            case 'vat_registration':
              updatedFields.vat_registration_certificate_status = newStatus;
              break;
            default:
              console.warn(`Unknown provider document type: ${item.documentType}`);
              return;
          }
          await updateProvider(id, updatedFields);
          break;
        }
        case 'chauffeur': {
          const updatedFields: Partial<ChauffeurData> = {};
          switch (item.documentType) {
            case 'drivers_license':
              updatedFields.drivers_license_status = newStatus;
              break;
            case 'private_hire_license':
              updatedFields.private_hire_license_status = newStatus;
              break;
            case 'profile_pic':
              updatedFields.profile_pic_status = newStatus;
              break;
            default:
              console.warn(`Unknown chauffeur document type: ${item.documentType}`);
              return;
          }
          await updateChauffeur(id, updatedFields);
          break;
        }
        case 'vehicle': {
          const updatedFields: Partial<VehicleData> = {};
          switch (item.documentType) {
            case 'private_hire_license':
              updatedFields.private_hire_license_status = newStatus;
              break;
            case 'mot_certificate':
              updatedFields.mot_test_certificate_status = newStatus;
              break;
            case 'insurance':
              updatedFields.vehicle_insurance_status = newStatus;
              break;
            case 'registration':
              updatedFields.vehicle_registration_status = newStatus;
              break;
            case 'leasing_contract':
              updatedFields.leasing_contract_status = newStatus;
              break;
            case 'vehicle_pic':
              updatedFields.vehicle_pic_status = newStatus;
              break;
            default:
              console.warn(`Unknown vehicle document type: ${item.documentType}`);
              return;
          }
          await updateVehicle(id, updatedFields);
          break;
        }
        default:
          console.warn(`Unknown document category: ${item.documentCategory}`);
          return;
      }

      setDocumentStatus(newStatus);
      setStatusDialogOpen(false);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const renderImage = (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 1,
        overflow: 'hidden',
        width: '100%',
        height: 400,
        mb: 2,
        boxShadow: (theme) => theme.customShadows.z8,
        bgcolor: 'background.neutral',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {loading ? (
        <Skeleton variant="rectangular" width="100%" height="100%" />
      ) : signedUrl ? (
        <Box
          component="img"
          src={signedUrl}
          alt={name}
          sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Failed to load image
          </Typography>
        </Box>
      )}
    </Box>
  );

  const renderProperties = (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
      >
        Properties
        <IconButton size="small">
          <Iconify icon="eva:arrow-ios-upward-fill" />
        </IconButton>
      </Stack>

      <Stack spacing={1.5}>
        <Stack direction="row" sx={{ typography: 'caption' }}>
          <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
            Size
          </Box>
          {fData(size)}
        </Stack>

        <Stack direction="row" sx={{ typography: 'caption' }}>
          <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
            Modified
          </Box>
          {fDateTime(modifiedAt)}
        </Stack>

        <Stack direction="row" sx={{ typography: 'caption' }}>
          <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
            Type
          </Box>
          {type}
        </Stack>
      </Stack>
    </Stack>
  );

  const renderStatus = (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
      >
        Status
        <IconButton size="small">
          <Iconify icon="eva:arrow-ios-upward-fill" />
        </IconButton>
      </Stack>

      <Stack spacing={1.5}>
        <Label
          variant="soft"
          color={
            (documentStatus === 'approved' && 'success') ||
            (documentStatus === 'rejected' && 'error') ||
            'warning'
          }
          sx={{ py: 2, px: 3, width: '100%', textAlign: 'center' }}
        >
          {documentStatus || 'pending'}
        </Label>
      </Stack>
    </Stack>
  );

  const renderExpiryDate = expiryDate && (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
      >
        Expiry Date
        <IconButton size="small">
          <Iconify icon="eva:arrow-ios-upward-fill" />
        </IconButton>
      </Stack>

      <Stack spacing={1.5}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {fDateTime(expiryDate)}
        </Typography>
      </Stack>
    </Stack>
  );

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{
          sx: {
            width: {
              xs: '100%',
              sm: 460,
              md: 520,
            },
          },
        }}
        {...other}
      >
        <Scrollbar>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
            <Typography variant="h6"> Info </Typography>
            <IconButton onClick={onClose}>
              <Iconify icon="mingcute:close-line" />
            </IconButton>
          </Stack>

          <Stack
            spacing={2.5}
            justifyContent="center"
            sx={{ p: 2.5, bgcolor: 'background.neutral' }}
          >
            {type?.startsWith('image/') ? (
              renderImage
            ) : (
              <FileThumbnail
                file={type === 'folder' ? type : name}
                sx={{ width: 'auto', height: 'auto' }}
              />
            )}

            <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>
              {name}
            </Typography>

            <Divider sx={{ borderStyle: 'dashed' }} />

            {renderProperties}
            <Divider sx={{ borderStyle: 'dashed' }} />
            {renderStatus}
            {expiryDate && (
              <>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {renderExpiryDate}
              </>
            )}

            <Button
              fullWidth
              variant="soft"
              color="inherit"
              size="large"
              startIcon={<Iconify icon="eva:link-2-fill" />}
              onClick={onCopyLink}
            >
              Copy Link
            </Button>
          </Stack>
        </Scrollbar>

        <Stack direction="row" spacing={2} sx={{ p: 2.5 }}>
          <Button
            fullWidth
            variant="soft"
            color="error"
            size="large"
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            onClick={() => setConfirmDelete(true)}
          >
            Delete
          </Button>

          <Button
            fullWidth
            variant="soft"
            color="primary"
            size="large"
            startIcon={<Iconify icon="eva:edit-fill" />}
            onClick={() => setStatusDialogOpen(true)}
          >
            Update Status
          </Button>
        </Stack>
      </Drawer>

      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Change Document Status</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              await onDelete();
              onClose();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
