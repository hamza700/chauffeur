'use client';

import type { PaymentDetails } from 'src/types/provider';

import { useState } from 'react';

import Divider from '@mui/material/Divider';
import { Box, Step, Stack, Button, Stepper, StepLabel } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { uuidv4 } from 'src/utils/uuidv4';
import {
  transformToVehicleData,
  transformToProviderData,
  transformToChauffeurData,
} from 'src/utils/data-transformers';

import { signUpChauffeur } from 'src/actions/chauffeur';

import { toast } from 'src/components/snackbar';

import { useAuthContext } from 'src/auth/hooks';
import {
  updateRole,
  addUserRole,
  insertVehicle,
  insertProvider,
  updateProvider,
  insertChauffeur,
  updateChauffeur,
  updateOnboarding,
} from 'src/auth/context/supabase';

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

export function OnboardingViewProviders() {
  const router = useRouter();

  const { checkUserSession, user } = useAuthContext();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    companyInfo: {
      companyName: '',
      phoneNumber: '',
      country: '',
      address: '',
      state: '',
      city: '',
      postCode: '',
      taxIdentificationNumber: '',
      companyRegistrationNumber: '',
      vatNumber: '',
      status: 'pending',
    },
    firstChauffeur: {
      firstName: user?.user_metadata?.first_name,
      lastName: user?.user_metadata?.last_name,
      email: user?.email,
      phoneNumber: '',
      driversLicense: '',
      privateHireLicense: '',
      licensePlate: '',
      country: '',
      status: 'pending',
    },
    firstVehicle: {
      model: '',
      productionYear: '',
      colour: '',
      licensePlate: '',
      serviceClass: '',
      status: 'pending',
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
      paymentMethod: '' as PaymentDetails['paymentMethod'],
      paypalEmail: null,
      bankAccountOwnerName: null,
      bankName: null,
      bankCountry: null,
      bankAccountNumber: null,
      iban: null,
      swiftCode: null,
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
        country: '',
        address: '',
        state: '',
        city: '',
        postCode: '',
        taxIdentificationNumber: '',
        companyRegistrationNumber: '',
        vatNumber: '',
        status: 'pending',
      },
      firstChauffeur: {
        firstName: user?.user_metadata?.first_name,
        lastName: user?.user_metadata?.last_name,
        email: user?.email,
        phoneNumber: '',
        driversLicense: '',
        privateHireLicense: '',
        licensePlate: '',
        country: '',
        status: 'pending',
      },
      firstVehicle: {
        model: '',
        productionYear: '',
        colour: '',
        licensePlate: '',
        serviceClass: '',
        status: 'pending',
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
        paymentMethod: '' as PaymentDetails['paymentMethod'],
        paypalEmail: null,
        bankAccountOwnerName: null,
        bankName: null,
        bankCountry: null,
        bankAccountNumber: null,
        iban: null,
        swiftCode: null,
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

  const handleSubmitOnboarding = async () => {
    try {
      const userId = user?.id;

      if (!userId) {
        toast.error('User not authenticated');
        return;
      }

      await addUserRole(userId, 'provider');
      toast.success('Provider role added successfully');

      // Insert provider details
      const providerData = transformToProviderData({
        ...formData.companyInfo,
        ...formData.providerDocuments,
        ...formData.partnerAgreement,
        ...formData.paymentDetails,
        email: user?.email,
        firstName: user?.user_metadata?.first_name,
        lastName: user?.user_metadata?.last_name,
        id: userId,
        onboarded: false, // Initially set to false
      });
      await insertProvider(providerData);
      toast.success('Provider details added successfully');

      // Update provider onboarding status
      await updateOnboarding({ role: 'provider', onboarded: true });
      await updateProvider(userId, { onboarded: true });
      toast.success('Provider onboarding status updated successfully');

      let chauffeurId = userId; // Default to the same user ID

      // Check if chauffeur email is different from provider email
      if (formData.firstChauffeur.email !== user?.email) {
        // Sign up new chauffeur
        const chauffeurData = {
          email: formData.firstChauffeur.email,
          first_name: formData.firstChauffeur.firstName,
          last_name: formData.firstChauffeur.lastName,
          phone_number: formData.firstChauffeur.phoneNumber,
          country: formData.firstChauffeur.country,
          drivers_license: formData.firstChauffeur.driversLicense,
          private_hire_license: formData.firstChauffeur.privateHireLicense,
          license_plate: formData.firstChauffeur.licensePlate,
          provider_id: userId,
          status: 'pending',
        };

        const newChauffeur = await signUpChauffeur(chauffeurData, user?.access_token);
        chauffeurId = newChauffeur; // Assuming signUpChauffeur returns the new chauffeur's ID
        toast.success('New chauffeur signed up successfully');

        const chauffeurDocumentsData = {
          profile_pic_status: 'pending',
          drivers_license_expiry_date: formData.chauffeurDocuments.driversLicenseExpiryDate,
          drivers_license_status: 'pending',
          private_hire_license_expiry_date:
            formData.chauffeurDocuments.privateHireLicenseExpiryDate,
          private_hire_license_status: 'pending',
        };

        await updateChauffeur(chauffeurId, chauffeurDocumentsData);
        toast.success('Chauffeur details updated successfully');
      } else {
        // Add chauffeur role to the same user
        await addUserRole(userId, 'chauffeur');
        await updateRole();
        toast.success('Chauffeur role added successfully');

        // Insert chauffeur details
        const chauffeurData = transformToChauffeurData({
          ...formData.firstChauffeur,
          ...formData.chauffeurDocuments,
          providerId: userId,
          id: userId,
          onboarded: false,
        });
        await insertChauffeur(chauffeurData);
        toast.success('Chauffeur details added successfully');
      }

      // Insert vehicle details
      const vehicleData = transformToVehicleData({
        ...formData.firstVehicle,
        ...formData.vehicleDocuments,
        providerId: userId,
        id: uuidv4(),
      });
      await insertVehicle(vehicleData);
      toast.success('Vehicle details inserted successfully');

      if (formData.firstChauffeur.email === user?.email) {
        await updateOnboarding({ role: 'chauffeur', onboarded: true });
      }
      await updateChauffeur(chauffeurId, { onboarded: true });
      toast.success('Chauffeur onboarding status updated successfully');

      await checkUserSession?.();
      router.refresh();
    } catch (error) {
      toast.error(error.message || 'An error occurred');
      console.error(error);
    }
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
        {activeStep === steps.length - 1 ? (
          <Box>
            {/* Render Application Summary on the last step */}
            {renderStepContent(activeStep)}

            {/* Add Reset and Finish buttons */}
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
              <Button onClick={handleReset}>Reset</Button>
              <Button variant="contained" onClick={handleSubmitOnboarding}>
                Finish Onboarding
              </Button>
            </Stack>
          </Box>
        ) : (
          <Box>
            {/* Render content for other steps */}
            {renderStepContent(activeStep)}

            {/* Add Back and Next buttons */}
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
                {activeStep === steps.length - 2 ? 'Finish' : 'Next'}
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
}
