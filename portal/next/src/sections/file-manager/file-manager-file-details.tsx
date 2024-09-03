import type { IFileManager } from 'src/types/file';
import type { DrawerProps } from '@mui/material/Drawer';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { fData } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { FileThumbnail } from 'src/components/file-thumbnail';

// ----------------------------------------------------------------------

type Props = DrawerProps & {
  item: IFileManager;
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
  const { name, url, type, status, size, modifiedAt } = item;

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
      <>
        <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
          <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
            Size
          </Box>
          {fData(size)}
        </Stack>

        <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
          <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
            Modified
          </Box>
          {fDateTime(modifiedAt)}
        </Stack>

        <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
          <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
            Type
          </Box>
          {type}
        </Stack>
      </>
    </Stack>
  );

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 320 } }}
        {...other}
      >
        <Scrollbar>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
            <Typography variant="h6"> Info </Typography>
          </Stack>

          <Stack
            spacing={2.5}
            justifyContent="center"
            sx={{ p: 2.5, bgcolor: 'background.neutral' }}
          >
            <FileThumbnail
              imageView
              file={type === 'folder' ? type : url}
              sx={{ width: 'auto', height: 'auto', alignSelf: 'flex-start' }}
              slotProps={{
                img: {
                  width: 320,
                  height: 'auto',
                  aspectRatio: '4/3',
                  objectFit: 'cover',
                },
                icon: { width: 64, height: 64 },
              }}
            />

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
