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
import { uploadDocument, uploadDocuments } from 'src/actions/documents';

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

  // Add new state for pending uploads
  const [pendingUploads, setPendingUploads] = useState<{
    provider?: any;
    chauffeur?: any;
    vehicle?: any;
  }>({});

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
    if (stepName === 'uploadDocuments') {
      // Store the pending uploads separately
      setPendingUploads({
        provider: data.pendingUploads.provider,
        chauffeur: data.pendingUploads.chauffeur,
        vehicle: data.pendingUploads.vehicle,
      });

      // Store only the document status and expiry dates in formData
      setFormData((prevData) => ({
        ...prevData,
        providerDocuments: data.providerDocuments,
        chauffeurDocuments: data.chauffeurDocuments,
        vehicleDocuments: data.vehicleDocuments,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [stepName]: data,
      }));
    }
    handleNext();
  };

  const handleSubmitOnboarding = async () => {
    try {
      const userId = user?.id;
      if (!userId) {
        toast.error('User not authenticated');
        return;
      }

      // 1. Add provider role and insert provider details (existing code)
      await addUserRole(userId, 'provider');

      const providerData = transformToProviderData({
        ...formData.companyInfo,
        ...formData.providerDocuments,
        ...formData.partnerAgreement,
        ...formData.paymentDetails,
        email: user?.email,
        firstName: user?.user_metadata?.first_name,
        lastName: user?.user_metadata?.last_name,
        id: userId,
        onboarded: false,
        createdAt: new Date().toISOString(),
      });
      await insertProvider(providerData);
      toast.success('Provider details added successfully');

      // Add document uploads after provider creation
      if (pendingUploads.provider) {
        await Promise.all([
          pendingUploads.provider.companyPrivateHireOperatorLicense?.files?.length &&
            uploadDocuments(
              pendingUploads.provider.companyPrivateHireOperatorLicense.files,
              userId,
              'company_private_hire_license',
              user.access_token
            ),
          pendingUploads.provider.personalIDorPassport?.files?.length &&
            uploadDocuments(
              pendingUploads.provider.personalIDorPassport.files,
              userId,
              'proof_of_id',
              user.access_token
            ),
          pendingUploads.provider.vatRegistrationCertificate?.files?.length &&
            uploadDocuments(
              pendingUploads.provider.vatRegistrationCertificate.files,
              userId,
              'vat_registration',
              user.access_token
            ),
        ]);
      }
      toast.success('Provider documents added successfully');
      await updateOnboarding({ role: 'provider', onboarded: true });
      await updateProvider(userId, { onboarded: true });

      let chauffeurId = userId;

      // 2. Handle chauffeur creation (existing code)
      if (formData.firstChauffeur.email !== user?.email) {
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
        chauffeurId = newChauffeur;
        toast.success('New chauffeur signed up successfully');

        const chauffeurDocumentsData = {
          profile_pic_status: 'pending',
          drivers_license_expiry_date: formData.chauffeurDocuments.driversLicenseExpiryDate,
          drivers_license_status: 'pending',
          private_hire_license_expiry_date:
            formData.chauffeurDocuments.privateHireLicenseExpiryDate,
          private_hire_license_status: 'pending',
          created_at: new Date().toISOString(),
        };

        await updateChauffeur(chauffeurId, chauffeurDocumentsData);
        toast.success('Chauffeur details updated successfully');
      } else {
        await addUserRole(userId, 'chauffeur');
        await updateRole();
        toast.success('Chauffeur role added successfully');

        const chauffeurData = transformToChauffeurData({
          ...formData.firstChauffeur,
          ...formData.chauffeurDocuments,
          providerId: userId,
          id: userId,
          onboarded: false,
          createdAt: new Date().toISOString(),
        });
        await insertChauffeur(chauffeurData);
        toast.success('Chauffeur details added successfully');
      }

      // Add chauffeur document uploads after chauffeur creation
      if (pendingUploads.chauffeur && chauffeurId) {
        await Promise.all([
          pendingUploads.chauffeur.profilePic &&
            uploadDocument(
              {
                file: pendingUploads.chauffeur.profilePic,
                providerId: userId,
                documentType: 'profile_pic',
                index: 0,
                entityType: 'chauffeurs',
                entityId: chauffeurId,
              },
              user.access_token
            ),
          pendingUploads.chauffeur.driversLicense?.files?.length &&
            uploadDocuments(
              pendingUploads.chauffeur.driversLicense.files,
              userId,
              'drivers_license',
              user.access_token,
              'chauffeurs',
              chauffeurId
            ),
          pendingUploads.chauffeur.privateHireLicense?.files?.length &&
            uploadDocuments(
              pendingUploads.chauffeur.privateHireLicense.files,
              userId,
              'private_hire_license',
              user.access_token,
              'chauffeurs',
              chauffeurId
            ),
        ]);
      }
      toast.success('Chauffeur documents added successfully');

      // 3. Create vehicle (existing code)
      const vehicleId = uuidv4();
      const vehicleData = transformToVehicleData({
        ...formData.firstVehicle,
        ...formData.vehicleDocuments,
        providerId: userId,
        id: vehicleId,
        createdAt: new Date().toISOString(),
      });
      await insertVehicle(vehicleData);
      toast.success('Vehicle details added successfully');

      // Add vehicle document uploads after vehicle creation
      if (pendingUploads.vehicle && vehicleId) {
        await Promise.all([
          pendingUploads.vehicle.vehiclePic &&
            uploadDocument(
              {
                file: pendingUploads.vehicle.vehiclePic,
                providerId: userId,
                documentType: 'vehicle_pic',
                index: 0,
                entityType: 'vehicles',
                entityId: vehicleId,
              },
              user.access_token
            ),
          pendingUploads.vehicle.privateHireLicense?.files?.length &&
            uploadDocuments(
              pendingUploads.vehicle.privateHireLicense.files,
              userId,
              'private_hire_license',
              user.access_token,
              'vehicles',
              vehicleId
            ),
          // Add other vehicle documents
          pendingUploads.vehicle.motTestCertificate?.files?.length &&
            uploadDocuments(
              pendingUploads.vehicle.motTestCertificate.files,
              userId,
              'mot_certificate',
              user.access_token,
              'vehicles',
              vehicleId
            ),
          pendingUploads.vehicle.vehicleInsurance?.files?.length &&
            uploadDocuments(
              pendingUploads.vehicle.vehicleInsurance.files,
              userId,
              'insurance',
              user.access_token,
              'vehicles',
              vehicleId
            ),
          pendingUploads.vehicle.vehicleRegistration?.files?.length &&
            uploadDocuments(
              pendingUploads.vehicle.vehicleRegistration.files,
              userId,
              'registration',
              user.access_token,
              'vehicles',
              vehicleId
            ),
          pendingUploads.vehicle.leasingContract?.files?.length &&
            uploadDocuments(
              pendingUploads.vehicle.leasingContract.files,
              userId,
              'leasing_contract',
              user.access_token,
              'vehicles',
              vehicleId
            ),
        ]);
      }
      toast.success('Vehicle documents added successfully');
      // 4. Update onboarding status (existing code)

      if (formData.firstChauffeur.email === user?.email) {
        await updateOnboarding({ role: 'chauffeur', onboarded: true });
      }
      await updateChauffeur(chauffeurId, { onboarded: true });

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
