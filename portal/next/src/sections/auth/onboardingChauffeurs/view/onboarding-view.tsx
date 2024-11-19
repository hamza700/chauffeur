'use client';

import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

import { uploadDocument, uploadDocuments } from 'src/actions/documents';

import { toast } from 'src/components/snackbar';
import { Field, schemaHelper } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import {
  updateVehicle,
  updateChauffeur,
  updateOnboarding,
  getChauffeurById,
  filterVehiclesByLicensePlate,
} from 'src/auth/context/supabase';

export type OnboardingDocumentsSchemaType = zod.infer<typeof OnboardingDocumentsSchema>;

export const OnboardingDocumentsSchema = zod.object({
  profilePicUrl: schemaHelper.file({
    message: { required_error: 'Profile picture is required!' },
  }),
  chauffeurDriversLicenseUrls: schemaHelper.files({
    message: { required_error: "Driver's license is required!", minFiles: 1 },
  }),
  chauffeurPrivateHireLicenseUrls: schemaHelper.files({
    message: {
      required_error: 'Private hire license is required!',
      minFiles: 1,
    },
  }),
  chauffeurDriversLicenseExpiryDate: schemaHelper.date({
    message: { required_error: "Driver's license expiry date is required!" },
  }),
  chauffeurPrivateHireLicenseExpiryDate: schemaHelper.date({
    message: {
      required_error: 'Private hire license expiry date is required!',
    },
  }),
  vehiclePicUrl: schemaHelper.file({
    message: { required_error: 'Vehicle picture is required!' },
  }),
  vehiclePrivateHireLicenseUrls: schemaHelper.files({
    message: {
      required_error: 'Private hire license is required!',
      minFiles: 1,
    },
  }),
  vehiclePrivateHireLicenseExpiryDate: schemaHelper.date({
    message: {
      required_error: 'Private hire license expiry date is required!',
    },
  }),
  vehicleMotTestCertificateUrls: schemaHelper.files({
    message: {
      required_error: 'MOT test certificate is required!',
      minFiles: 1,
    },
  }),
  vehicleMotTestCertificateExpiryDate: schemaHelper.date({
    message: {
      required_error: 'MOT test certificate expiry date is required!',
    },
  }),
  vehicleInsuranceUrls: schemaHelper.files({
    message: { required_error: 'Vehicle insurance is required!', minFiles: 1 },
  }),
  vehicleInsuranceExpiryDate: schemaHelper.date({
    message: { required_error: 'Vehicle insurance expiry date is required!' },
  }),
  vehicleRegistrationUrls: schemaHelper.files({
    message: {
      required_error: 'Vehicle registration is required!',
      minFiles: 1,
    },
  }),
  vehicleLeasingContractUrls: schemaHelper.files({
    message: { required_error: 'Leasing contract is required!', minFiles: 1 },
  }),
});

// Helper function to filter out strings and keep only Files
const filterFiles = (files: (string | File)[]): File[] =>
  files.filter((file): file is File => file instanceof File);

export function OnboardingViewChauffeurs() {
  const router = useRouter();

  const { user, checkUserSession } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');

  const methods = useForm<OnboardingDocumentsSchemaType>({
    mode: 'all',
    resolver: zodResolver(OnboardingDocumentsSchema),
    defaultValues: {
      profilePicUrl: '',
      chauffeurDriversLicenseUrls: [],
      chauffeurPrivateHireLicenseUrls: [],
      chauffeurDriversLicenseExpiryDate: null,
      chauffeurPrivateHireLicenseExpiryDate: null,
      vehiclePicUrl: '',
      vehiclePrivateHireLicenseUrls: [],
      vehiclePrivateHireLicenseExpiryDate: null,
      vehicleMotTestCertificateUrls: [],
      vehicleMotTestCertificateExpiryDate: null,
      vehicleInsuranceUrls: [],
      vehicleInsuranceExpiryDate: null,
      vehicleRegistrationUrls: [],
      vehicleLeasingContractUrls: [],
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
    watch,
  } = methods;

  const values = watch();

  const handleRemoveFile = (
    inputFile: File | string,
    fieldName: keyof OnboardingDocumentsSchemaType
  ) => {
    const fieldValue = values[fieldName];
    if (Array.isArray(fieldValue)) {
      const filtered = fieldValue.filter((file) => file !== inputFile);
      setValue(fieldName, filtered, { shouldValidate: true });
    } else if (typeof fieldValue === 'string') {
      setValue(fieldName, null, { shouldValidate: true });
    }
  };

  const handleRemoveAllFiles = (fieldName: keyof OnboardingDocumentsSchemaType) => {
    setValue(fieldName, [], { shouldValidate: true });
  };

  const handleDrop = useCallback(
    (files: File[], fieldName: keyof OnboardingDocumentsSchemaType) => {
      const currentFiles = values[fieldName];
      const updatedFiles = Array.isArray(currentFiles) ? [...currentFiles, ...files] : files[0];
      setValue(fieldName, updatedFiles, { shouldValidate: true });
    },
    [setValue, values]
  );

  const onSubmitHandler = async (data: OnboardingDocumentsSchemaType) => {
    const userId = user?.id;

    if (!userId) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const { data: chauffeur } = await getChauffeurById(userId);
      if (!chauffeur?.license_plate) {
        toast.error('License plate not found in chauffeur details');
        return;
      }

      const chauffeurData = {
        profile_pic_status: 'pending',
        drivers_license_expiry_date: data.chauffeurDriversLicenseExpiryDate?.toString() ?? null,
        drivers_license_status: 'pending',
        private_hire_license_expiry_date:
          data.chauffeurPrivateHireLicenseExpiryDate?.toString() ?? null,
        private_hire_license_status: 'pending',
      };

      await updateChauffeur(userId, chauffeurData);
      toast.success('Chauffeur details updated successfully');

      // Upload chauffeur documents with filtered files
      await Promise.all([
        data.profilePicUrl instanceof File &&
          uploadDocument(
            {
              file: data.profilePicUrl,
              providerId: chauffeur.provider_id,
              documentType: 'profile_pic',
              index: 0,
              entityType: 'chauffeurs',
              entityId: userId,
            },
            user.access_token
          ),
        data.chauffeurDriversLicenseUrls?.length &&
          uploadDocuments(
            filterFiles(data.chauffeurDriversLicenseUrls),
            chauffeur.provider_id,
            'drivers_license',
            user.access_token,
            'chauffeurs',
            userId
          ),
        data.chauffeurPrivateHireLicenseUrls?.length &&
          uploadDocuments(
            filterFiles(data.chauffeurPrivateHireLicenseUrls),
            chauffeur.provider_id,
            'private_hire_license',
            user.access_token,
            'chauffeurs',
            userId
          ),
      ]);
      toast.success('Chauffeur documents uploaded successfully');

      const { data: vehicle } = await filterVehiclesByLicensePlate(chauffeur.license_plate);
      if (!vehicle) {
        toast.error(
          "Your provider still hasn't added your vehicle. Tell them to add it and then come back to complete your onboarding."
        );
        return;
      }

      const vehicleData = {
        private_hire_license_expiry_date:
          data.vehiclePrivateHireLicenseExpiryDate?.toString() ?? null,
        private_hire_license_status: 'pending',
        mot_test_certificate_expiry_date:
          data.vehicleMotTestCertificateExpiryDate?.toString() ?? null,
        mot_test_certificate_status: 'pending',
        vehicle_insurance_expiry_date: data.vehicleInsuranceExpiryDate?.toString() ?? null,
        vehicle_insurance_status: 'pending',
        leasing_contract_status: 'pending',
        vehicle_registration_status: 'pending',
        vehicle_pic_status: 'pending',
      };

      await updateVehicle(vehicle.id, vehicleData);
      toast.success('Vehicle details updated successfully');

      // Upload vehicle documents with filtered files
      await Promise.all([
        data.vehiclePicUrl instanceof File &&
          uploadDocument(
            {
              file: data.vehiclePicUrl,
              providerId: chauffeur.provider_id,
              documentType: 'vehicle_pic',
              index: 0,
              entityType: 'vehicles',
              entityId: vehicle.id,
            },
            user.access_token
          ),
        data.vehiclePrivateHireLicenseUrls?.length &&
          uploadDocuments(
            filterFiles(data.vehiclePrivateHireLicenseUrls),
            chauffeur.provider_id,
            'private_hire_license',
            user.access_token,
            'vehicles',
            vehicle.id
          ),
        data.vehicleMotTestCertificateUrls?.length &&
          uploadDocuments(
            filterFiles(data.vehicleMotTestCertificateUrls),
            chauffeur.provider_id,
            'mot_certificate',
            user.access_token,
            'vehicles',
            vehicle.id
          ),
        data.vehicleInsuranceUrls?.length &&
          uploadDocuments(
            filterFiles(data.vehicleInsuranceUrls),
            chauffeur.provider_id,
            'insurance',
            user.access_token,
            'vehicles',
            vehicle.id
          ),
        data.vehicleRegistrationUrls?.length &&
          uploadDocuments(
            filterFiles(data.vehicleRegistrationUrls),
            chauffeur.provider_id,
            'registration',
            user.access_token,
            'vehicles',
            vehicle.id
          ),
        data.vehicleLeasingContractUrls?.length &&
          uploadDocuments(
            filterFiles(data.vehicleLeasingContractUrls),
            chauffeur.provider_id,
            'leasing_contract',
            user.access_token,
            'vehicles',
            vehicle.id
          ),
      ]);
      toast.success('Vehicle documents uploaded successfully');

      await updateChauffeur(userId, { onboarded: true });
      await updateOnboarding({ role: 'chauffeur', onboarded: true });
      toast.success('Onboarding status updated successfully');

      await checkUserSession?.();
      router.refresh();
    } catch (error) {
      toast.error(error.message || 'An error occurred during onboarding');
      console.error(error);
    }
  };

  const handleReset = () => reset();

  useEffect(() => {
    const checkChauffeurOnboarding = async () => {
      if (user?.id) {
        try {
          const { data: chauffeur } = await getChauffeurById(user.id);
          if (chauffeur && chauffeur.onboarded) {
            await updateOnboarding({ role: 'chauffeur', onboarded: true });
            toast.success('Chauffeur onboarding status updated');
            router.push('/dashboard'); // Redirect to dashboard if already onboarded
          }
        } catch (error) {
          console.error('Error checking chauffeur onboarding status:', error);
          toast.error('Failed to check onboarding status');
        }
      }
    };

    checkChauffeurOnboarding();
  }, [user, router]);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Upload Documents
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Please upload the following documents. Make sure all the information is accurate before
        proceeding.
      </Typography>

      <Divider sx={{ my: 3 }} />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <Stack spacing={3}>
            {/* Chauffeur Documents */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Chauffeur Documents
              </Typography>
              <DocumentSection
                title="Profile Picture"
                fieldName="profilePicUrl"
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onDrop={handleDrop} // Handle file drop for correct handling
              />
              <Divider sx={{ my: 3 }} />
              <DocumentSection
                title="Driver's License"
                fieldName="chauffeurDriversLicenseUrls"
                expiryField="chauffeurDriversLicenseExpiryDate"
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onDrop={handleDrop} // Handle file drop for correct handling
              />
              <Divider sx={{ my: 3 }} />
              <DocumentSection
                title="Private Hire License"
                fieldName="chauffeurPrivateHireLicenseUrls"
                expiryField="chauffeurPrivateHireLicenseExpiryDate"
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onDrop={handleDrop} // Handle file drop for correct handling
              />
            </Card>

            {/* Vehicle Documents */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Vehicle Documents
              </Typography>
              <DocumentSection
                title="Vehicle Picture"
                fieldName="vehiclePicUrl"
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onDrop={handleDrop} // Handle file drop for correct handling
              />
              <Divider sx={{ my: 3 }} />
              <DocumentSection
                title="Private Hire License"
                fieldName="vehiclePrivateHireLicenseUrls"
                expiryField="vehiclePrivateHireLicenseExpiryDate"
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onDrop={handleDrop} // Handle file drop for correct handling
              />
              <Divider sx={{ my: 3 }} />
              <DocumentSection
                title="MOT Test Certificate"
                fieldName="vehicleMotTestCertificateUrls"
                expiryField="vehicleMotTestCertificateExpiryDate"
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onDrop={handleDrop} // Handle file drop for correct handling
              />
              <Divider sx={{ my: 3 }} />
              <DocumentSection
                title="Vehicle Registration"
                fieldName="vehicleRegistrationUrls"
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onDrop={handleDrop} // Handle file drop for correct handling
              />
              <Divider sx={{ my: 3 }} />
              <DocumentSection
                title="Vehicle Insurance"
                fieldName="vehicleInsuranceUrls"
                expiryField="vehicleInsuranceExpiryDate"
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onDrop={handleDrop} // Handle file drop for correct handling
              />
              <Divider sx={{ my: 3 }} />
              <DocumentSection
                title="Leasing Contract"
                fieldName="vehicleLeasingContractUrls"
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onDrop={handleDrop} // Handle file drop for correct handling
              />
            </Card>

            <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
              <Button onClick={handleReset}>Reset</Button>
              <LoadingButton
                variant="contained"
                type="submit"
                loading={isSubmitting}
                loadingIndicator="Finishing Onboarding..."
              >
                Finish Onboarding
              </LoadingButton>
            </Stack>

            {/* Error Message */}
            {errorMsg && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {errorMsg}
              </Alert>
            )}
          </Stack>
        </form>
      </FormProvider>
    </Box>
  );
}

type DocumentSectionProps = {
  title: string;
  fieldName: keyof OnboardingDocumentsSchemaType;
  expiryField?: keyof OnboardingDocumentsSchemaType;
  onRemove: (file: File | string, fieldName: keyof OnboardingDocumentsSchemaType) => void;
  onRemoveAll: (fieldName: keyof OnboardingDocumentsSchemaType) => void;
  onDrop: (files: File[], fieldName: keyof OnboardingDocumentsSchemaType) => void; // Add onDrop prop
};

function DocumentSection({
  title,
  fieldName,
  expiryField,
  onRemove,
  onRemoveAll,
  onDrop, // Destructure onDrop prop
}: DocumentSectionProps) {
  const { watch } = useFormContext<OnboardingDocumentsSchemaType>();
  const fieldValue = watch(fieldName);

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2">{title}</Typography>
      {expiryField && (
        <Field.DatePicker name={expiryField} label="Expiry Date" sx={{ width: '50%' }} />
      )}
      <Field.Upload
        name={fieldName}
        multiple={Array.isArray(fieldValue)}
        thumbnail
        onRemove={(file) => onRemove(file, fieldName)}
        onRemoveAll={() => onRemoveAll(fieldName)}
        onDrop={(files) => onDrop(files, fieldName)} // Add onDrop handler
      />
    </Stack>
  );
}
