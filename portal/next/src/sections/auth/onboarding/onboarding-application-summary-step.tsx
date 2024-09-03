'use client';

import React from 'react';

import { Box, Divider, Typography } from '@mui/material';

export function ApplicationSummaryStep({ formData }) {
  return (
    <Box>
      <Typography variant="h6">Application Summary</Typography>
      <Typography variant="body1">Review your application details before submission.</Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Company Info</Typography>
      <Typography variant="body2">{JSON.stringify(formData.companyInfo, null, 2)}</Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">First Chauffeur</Typography>
      <Typography variant="body2">{JSON.stringify(formData.firstChauffeur, null, 2)}</Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">First Vehicle</Typography>
      <Typography variant="body2">{JSON.stringify(formData.firstVehicle, null, 2)}</Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Documents</Typography>
      <Typography variant="body2">{JSON.stringify(formData.documents, null, 2)}</Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Partner Agreement</Typography>
      <Typography variant="body2">{JSON.stringify(formData.partnerAgreement, null, 2)}</Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Payment Details</Typography>
      <Typography variant="body2">{JSON.stringify(formData.paymentDetails, null, 2)}</Typography>
    </Box>
  );
}
