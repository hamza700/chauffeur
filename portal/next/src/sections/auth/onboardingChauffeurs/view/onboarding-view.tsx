'use client';

import { useState } from 'react';

import Divider from '@mui/material/Divider';
import { Box, Step, Stack, Button, Stepper, StepLabel } from '@mui/material';

import { UploadDocumentsStep } from '../onboarding-upload-documents-step';


const steps = [
  'Upload Documents',
];

export function OnboardingView() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    chauffeurDocuments: {
      profilePicUrl: '',
      profilePicStatus: 'pending',
      driversLicenseUrls: [],
      driversLicenseExpiryDate: null,
      driversLicenseStatus: 'pending',
      privateHireLicenseUrls: [],
      privateHireLicenseExpiryDate: null,
      privateHireLicenseStatus: 'pending',
    },
    vehicleDocuments: {
      privateHireLicenseUrls: [],
      privateHireLicenseExpiryDate: null,
      privateHireLicenseStatus: 'pending',
      motTestCertificateUrls: [],
      motTestCertificateExpiryDate: null,
      motTestCertificateStatus: 'pending',
      vehiclePicUrl: '',
      vehiclePicStatus: 'pending',
      vehicleInsuranceUrls: [],
      vehicleInsuranceExpiryDate: null,
      vehicleInsuranceStatus: 'pending',
      vehicleRegistrationUrls: [],
      vehicleRegistrationStatus: 'pending',
      leasingContractUrls: [],
      leasingContractStatus: 'pending',
    },
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      chauffeurDocuments: {
        profilePicUrl: '',
        profilePicStatus: 'pending',
        driversLicenseUrls: [],
        driversLicenseExpiryDate: null,
        driversLicenseStatus: 'pending',
        privateHireLicenseUrls: [],
        privateHireLicenseExpiryDate: null,
        privateHireLicenseStatus: 'pending',
      },
      vehicleDocuments: {
        privateHireLicenseUrls: [],
        privateHireLicenseExpiryDate: null,
        privateHireLicenseStatus: 'pending',
        motTestCertificateUrls: [],
        motTestCertificateExpiryDate: null,
        motTestCertificateStatus: 'pending',
        vehiclePicUrl: '',
        vehiclePicStatus: 'pending',
        vehicleInsuranceUrls: [],
        vehicleInsuranceExpiryDate: null,
        vehicleInsuranceStatus: 'pending',
        vehicleRegistrationUrls: [],
        vehicleRegistrationStatus: 'pending',
        leasingContractUrls: [],
        leasingContractStatus: 'pending',
      },
    });
  };

  const handleStepSubmit = (stepName: string, data: any) => {
    setFormData((prevData) => {
      if (stepName === 'uploadDocuments') {
        return {
          ...prevData,
          ...data, // This is for merging the document-related sections
        };
      }
      return {
        ...prevData,
        [stepName]: data,
      };
    });
    handleNext();
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <UploadDocumentsStep
            currentChauffeur={formData.chauffeurDocuments}
            currentVehicle={formData.vehicleDocuments}
            onSubmit={(data) => handleStepSubmit('uploadDocuments', data)} // Handle documents differently
            // onSubmit={(data) => handleStepSubmit(data)}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Divider
        sx={{
          my: 3,
          typography: 'overline',
          color: 'text.disabled',
          '&::before, :after': { borderTopStyle: 'dashed' },
        }}
      />
      <Box>
        {activeStep === steps.length ? (
          <Box>
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        ) : (
          <Box>
            {renderStepContent(activeStep)}
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  document
                    .querySelector('form')
                    ?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                }}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
}
