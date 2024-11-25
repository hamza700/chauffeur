import type { IStorageFile } from 'src/types/file';
import type { DrawerProps } from '@mui/material/Drawer';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { fData } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

import { supabase } from 'src/lib/supabase';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { FileThumbnail } from 'src/components/file-thumbnail';

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

  const [currentStatus, setCurrentStatus] = useState(status);
  const [confirm, setConfirm] = useState(false);

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentStatus(event.target.value);
  };

  const handleDelete = () => {
    setConfirm(true);
  };

  const handleConfirmDelete = () => {
    setConfirm(false);
    onDelete();
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

        <Stack direction="row" sx={{ typography: 'caption' }}>
          <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
            Status
          </Box>
          {status}
        </Stack>
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

            <TextField
              select
              label="Status"
              value={currentStatus}
              onChange={handleStatusChange}
              fullWidth
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
            </TextField>
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 2.5 }}>
          <Button
            fullWidth
            variant="soft"
            color="error"
            size="large"
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      </Drawer>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Delete"
        content="Are you sure you want to delete?"
        action={
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}
