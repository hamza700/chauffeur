'use client';

import { useState } from 'react';

import Divider from '@mui/material/Divider';
import { Box, Step, Stack, Button, Stepper, StepLabel } from '@mui/material';

import { CompanyInfoStep } from '../onboarding-company-info-step';
import { FirstVehicleStep } from '../onboarding-first-vehicle-step';
import { FirstChauffeurStep } from '../onboarding-first-chauffeur-step';
import { PaymentDetailsStep } from '../onboarding-payment-details-step';
import { UploadDocumentsStep } from '../onboarding-upload-documents-step';
import { PartnerAgreementStep } from '../onboarding-partner-agreement-step';
import { ApplicationSummaryStep } from '../onboarding-application-summary-step';

const steps = [
  'Company Info',
  'First Chauffeur',
  'First Vehicle',
  'Upload Documents',
  'Partner Agreement',
  'Payment Details',
  'Application Summary',
];

export function OnboardingView() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    companyInfo: {
      companyName: '',
      phoneNumber: '',
      country: null,
      address: '',
      state: '',
      city: '',
      postCode: '',
      taxIdentificationNumber: '',
      companyRegistrationNumber: '',
      vatNumber: '',
    },
    firstChauffeur: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      driversLicense: '',
      privateHireLicense: '',
      licensePlate: '',
      country: null,
    },
    firstVehicle: {
      model: '',
      productionYear: '',
      color: '',
      licensePlate: '',
      serviceClass: '',
    },
    providerDocuments: {
      companyPrivateHireOperatorLicenseUrls: [],
      companyPrivateHireOperatorLicenseExpiryDate: null,
      companyPrivateHireOperatorLicenseStatus: 'pending',
      personalIDorPassportUrls: [],
      personalIDorPassportExpiryDate: null,
      personalIDorPassportStatus: 'pending',
      vatRegistrationCertificateUrls: [],
      vatRegistrationCertificateExpiryDate: null,
      vatRegistrationCertificateStatus: 'pending',
    },
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
    partnerAgreement: {
      agreeToTerms: false,
      signature: '',
    },
    paymentDetails: {
      paymentMethod: 'paypal',
      paypalEmail: '',
      bankAccountOwnerName: '',
      bankName: '',
      bankCountry: null,
      bankAccountNumber: '',
      iban: '',
      swiftCode: '',
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
      companyInfo: {
        companyName: '',
        phoneNumber: '',
        country: null,
        address: '',
        state: '',
        city: '',
        postCode: '',
        taxIdentificationNumber: '',
        companyRegistrationNumber: '',
        vatNumber: '',
      },
      firstChauffeur: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        driversLicense: '',
        privateHireLicense: '',
        licensePlate: '',
        country: null,
      },
      firstVehicle: {
        model: '',
        productionYear: '',
        color: '',
        licensePlate: '',
        serviceClass: '',
      },
      providerDocuments: {
        companyPrivateHireOperatorLicenseUrls: [],
        companyPrivateHireOperatorLicenseExpiryDate: null,
        companyPrivateHireOperatorLicenseStatus: 'pending',
        personalIDorPassportUrls: [],
        personalIDorPassportExpiryDate: null,
        personalIDorPassportStatus: 'pending',
        vatRegistrationCertificateUrls: [],
        vatRegistrationCertificateExpiryDate: null,
        vatRegistrationCertificateStatus: 'pending',
      },
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
      partnerAgreement: {
        agreeToTerms: false,
        signature: '',
      },
      paymentDetails: {
        paymentMethod: 'paypal',
        paypalEmail: '',
        bankAccountOwnerName: '',
        bankName: '',
        bankCountry: null,
        bankAccountNumber: '',
        iban: '',
        swiftCode: '',
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
          <CompanyInfoStep
            currentProvider={formData.companyInfo}
            onSubmit={(data) => handleStepSubmit('companyInfo', data)}
          />
        );
      case 1:
        return (
          <FirstChauffeurStep
            currentChauffeur={formData.firstChauffeur}
            onSubmit={(data) => handleStepSubmit('firstChauffeur', data)}
          />
        );
      case 2:
        return (
          <FirstVehicleStep
            currentVehicle={formData.firstVehicle}
            onSubmit={(data) => handleStepSubmit('firstVehicle', data)}
          />
        );
      case 3:
        return (
          <UploadDocumentsStep
            currentProvider={formData.providerDocuments}
            currentChauffeur={formData.chauffeurDocuments}
            currentVehicle={formData.vehicleDocuments}
            onSubmit={(data) => handleStepSubmit('uploadDocuments', data)} // Handle documents differently
            // onSubmit={(data) => handleStepSubmit(data)}
          />
        );
      case 4:
        return (
          <PartnerAgreementStep
            currentAgreement={formData.partnerAgreement}
            onSubmit={(data) => handleStepSubmit('partnerAgreement', data)}
          />
        );
      case 5:
        return (
          <PaymentDetailsStep
            currentPaymentDetails={formData.paymentDetails}
            onSubmit={(data) => handleStepSubmit('paymentDetails', data)}
          />
        );
      case 6:
        return <ApplicationSummaryStep formData={formData} />;
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
