import type { IUserDocumentFields } from 'src/types/user';
import type { IVehicleDocumentFields } from 'src/types/vehicle';

import { z as zod } from 'zod';
import { useMemo, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { Field, schemaHelper } from 'src/components/hook-form';

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

type Props = {
  currentChauffeur?: IUserDocumentFields;
  currentVehicle?: IVehicleDocumentFields;
  onSubmit: (data: OnboardingDocumentsSchemaType) => void;
};

export function UploadDocumentsStep({ currentChauffeur, currentVehicle, onSubmit }: Props) {
  const defaultValues = useMemo(
    () => ({
      // Chauffeur documents
      profilePicUrl: currentChauffeur?.profilePicUrl || null,
      chauffeurDriversLicenseUrls: currentChauffeur?.driversLicenseUrls || [],
      chauffeurPrivateHireLicenseUrls: currentChauffeur?.privateHireLicenseUrls || [],
      chauffeurDriversLicenseExpiryDate: currentChauffeur?.driversLicenseExpiryDate || null,
      chauffeurPrivateHireLicenseExpiryDate: currentChauffeur?.privateHireLicenseExpiryDate || null,

      // Vehicle documents
      vehiclePicUrl: currentVehicle?.vehiclePicUrl || null,
      vehiclePrivateHireLicenseUrls: currentVehicle?.privateHireLicenseUrls || [],
      vehiclePrivateHireLicenseExpiryDate: currentVehicle?.privateHireLicenseExpiryDate || null,
      vehicleMotTestCertificateUrls: currentVehicle?.motTestCertificateUrls || [],
      vehicleMotTestCertificateExpiryDate: currentVehicle?.motTestCertificateExpiryDate || null,
      vehicleInsuranceUrls: currentVehicle?.vehicleInsuranceUrls || [],
      vehicleInsuranceExpiryDate: currentVehicle?.vehicleInsuranceExpiryDate || null,
      vehicleRegistrationUrls: currentVehicle?.vehicleRegistrationUrls || [],
      vehicleLeasingContractUrls: currentVehicle?.leasingContractUrls || [],
    }),
    [currentChauffeur, currentVehicle]
  );

  const methods = useForm<OnboardingDocumentsSchemaType>({
    mode: 'all',
    resolver: zodResolver(OnboardingDocumentsSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
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

  const onSubmitHandler = (data: OnboardingDocumentsSchemaType) => {
    const updatedData = {
      chauffeurDocuments: {
        profilePicUrl: data.profilePicUrl,
        driversLicenseUrls: data.chauffeurDriversLicenseUrls,
        driversLicenseExpiryDate: data.chauffeurDriversLicenseExpiryDate,
        privateHireLicenseUrls: data.chauffeurPrivateHireLicenseUrls,
        privateHireLicenseExpiryDate: data.chauffeurPrivateHireLicenseExpiryDate,
      },
      vehicleDocuments: {
        vehiclePicUrl: data.vehiclePicUrl,
        privateHireLicenseUrls: data.vehiclePrivateHireLicenseUrls,
        privateHireLicenseExpiryDate: data.vehiclePrivateHireLicenseExpiryDate,
        motTestCertificateUrls: data.vehicleMotTestCertificateUrls,
        motTestCertificateExpiryDate: data.vehicleMotTestCertificateExpiryDate,
        vehicleInsuranceUrls: data.vehicleInsuranceUrls,
        vehicleInsuranceExpiryDate: data.vehicleInsuranceExpiryDate,
        vehicleRegistrationUrls: data.vehicleRegistrationUrls,
        leasingContractUrls: data.vehicleLeasingContractUrls,
      },
    };
    onSubmit(updatedData);
  };

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
          </Stack>
          <input type="submit" style={{ display: 'none' }} />
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
