'use client';

import React from 'react';

import { Box, Card, Stack, Divider, Typography } from '@mui/material';

type Props = {
  formData: any;
};

export function ApplicationSummaryStep({ formData }: Props) {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Application Summary
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Please review your application details before final submission.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Stack spacing={3}>
        {/* Company Info */}
        <Card sx={{ p: 2 }}>
          <Typography variant="h6">Company Info</Typography>
          <Typography variant="body2" color="textSecondary">
            Company Name: {formData.companyInfo?.companyName || 'N/A'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Phone Number: {formData.companyInfo?.phoneNumber || 'N/A'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Country: {formData.companyInfo?.country?.name || 'N/A'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Address: {formData.companyInfo?.address || 'N/A'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            State: {formData.companyInfo?.state || 'N/A'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            City: {formData.companyInfo?.city || 'N/A'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Post Code: {formData.companyInfo?.postCode || 'N/A'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Tax Identification Number: {formData.companyInfo?.taxIdentificationNumber || 'N/A'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Company Registration Number: {formData.companyInfo?.companyRegistrationNumber || 'N/A'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            VAT Number: {formData.companyInfo?.vatNumber || 'N/A'}
          </Typography>
        </Card>

        <Divider />

        {/* First Chauffeur Info */}
        <Card sx={{ p: 2 }}>
          <Typography variant="h6">First Chauffeur</Typography>
          <Typography variant="body2" color="textSecondary">
            Name:{' '}
            {`${formData.firstChauffeur?.firstName || 'N/A'} ${formData.firstChauffeur?.lastName || ''}`}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Email: {formData.firstChauffeur?.email || 'N/A'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Phone Number: {formData.firstChauffeur?.phoneNumber || 'N/A'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Drivers License: {formData.firstChauffeur?.driversLicense || 'N/A'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Private Hire License: {formData.firstChauffeur?.privateHireLicense || 'N/A'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            License Plate: {formData.firstChauffeur?.licensePlate || 'N/A'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Country: {formData.firstChauffeur?.country?.name || 'N/A'}
          </Typography>
        </Card>

        <Divider />

        {/* First Vehicle Info */}
        <Card sx={{ p: 2 }}>
          <Typography variant="h6">First Vehicle</Typography>
          <Typography variant="body2" color="textSecondary">
            Model: {formData.firstVehicle?.model || 'N/A'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Production Year: {formData.firstVehicle?.productionYear || 'N/A'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Color: {formData.firstVehicle?.color || 'N/A'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            License Plate: {formData.firstVehicle?.licensePlate || 'N/A'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Service Class: {formData.firstVehicle?.serviceClass || 'N/A'}
          </Typography>
        </Card>

        <Divider />

        {/* Documents */}
        <Card sx={{ p: 2 }}>
          <Typography variant="h6">Documents</Typography>
          <Typography variant="body2" color="textSecondary">
            Private Hire License:{' '}
            {formData.providerDocuments?.companyPrivateHireOperatorLicenseUrls?.length > 0
              ? 'Uploaded'
              : 'Not Uploaded'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Passport or ID:{' '}
            {formData.providerDocuments?.personalIDorPassportUrls?.length > 0
              ? 'Uploaded'
              : 'Not Uploaded'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            VAT Registration:{' '}
            {formData.providerDocuments?.vatRegistrationCertificateUrls?.length > 0
              ? 'Uploaded'
              : 'Not Uploaded'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Company Registration:{' '}
            {formData.providerDocuments?.companyRegistrationCertificateUrls?.length > 0
              ? 'Uploaded'
              : 'Not Uploaded'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Profile Picture:{' '}
            {formData.chauffeurDocuments?.profilePicUrl ? 'Uploaded' : 'Not Uploaded'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Passport or ID:{' '}
            {formData.chauffeurDocuments?.passportOrIDUrls?.length > 0
              ? 'Uploaded'
              : 'Not Uploaded'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Private Hire License:{' '}
            {formData.chauffeurDocuments?.privateHireLicenseUrls?.length > 0
              ? 'Uploaded'
              : 'Not Uploaded'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Drivers License:{' '}
            {formData.chauffeurDocuments?.driversLicenseUrls?.length > 0
              ? 'Uploaded'
              : 'Not Uploaded'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Vehicle Registration:{' '}
            {formData.vehicleDocuments?.vehicleRegistrationUrls?.length > 0
              ? 'Uploaded'
              : 'Not Uploaded'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Vehicle Insurance:{' '}
            {formData.vehicleDocuments?.vehicleInsuranceUrls?.length > 0
              ? 'Uploaded'
              : 'Not Uploaded'}
          </Typography>
        </Card>

        <Divider />

        {/* Partner Agreement */}
        <Card sx={{ p: 2 }}>
          <Typography variant="h6">Partner Agreement</Typography>
          <Typography variant="body2" color="textSecondary">
            Agreement: {formData.partnerAgreement?.agreeToTerms ? 'Agreed' : 'Not Agreed'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Signature: {formData.partnerAgreement?.signature || 'N/A'}
          </Typography>
        </Card>

        <Divider />

        {/* Payment Details */}
        <Card sx={{ p: 2 }}>
          <Typography variant="h6">Payment Details</Typography>
          <Typography variant="body2" color="textSecondary">
            Payment Method: {formData.paymentDetails?.paymentMethod || 'N/A'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            PayPal Email: {formData.paymentDetails?.paypalEmail || 'N/A'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Bank Account Owner: {formData.paymentDetails?.bankAccountOwnerName || 'N/A'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Bank Name: {formData.paymentDetails?.bankName || 'N/A'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Bank Country: {formData.paymentDetails?.bankCountry?.name || 'N/A'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Account Number: {formData.paymentDetails?.bankAccountNumber || 'N/A'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            IBAN: {formData.paymentDetails?.iban || 'N/A'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            SWIFT Code: {formData.paymentDetails?.swiftCode || 'N/A'}
          </Typography>
        </Card>
      </Stack>
    </Box>
  );
}
