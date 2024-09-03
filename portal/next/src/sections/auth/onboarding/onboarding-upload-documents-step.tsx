import type { IUserItem } from 'src/types/user';
import type { IVehicleItem } from 'src/types/vehicle';
import type { IProviderAccount } from 'src/types/provider';

import { z as zod } from 'zod';
import { useMemo, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { Field, schemaHelper } from 'src/components/hook-form';

export type OnboardingDocumentsSchemaType = zod.infer<typeof OnboardingDocumentsSchema>;

export const OnboardingDocumentsSchema = zod.object({
  companyPrivateHireOperatorLicenseFiles: schemaHelper.files({
    message: {
      required_error: 'Private hire operator license is required!',
      minFiles: 1,
    },
  }),
  personalIDorPassportFiles: schemaHelper.files({
    message: {
      required_error: 'Personal ID or passport is required!',
      minFiles: 1,
    },
  }),
  vatRegistrationCertificateFiles: schemaHelper.files({
    message: {
      required_error: 'VAT registration certificate is required!',
      minFiles: 1,
    },
  }),
  companyPrivateHireOperatorLicenseExpiry: schemaHelper.date({
    message: {
      required_error: 'Private hire operator license expiry date is required!',
    },
  }),
  personalIDorPassportExpiry: schemaHelper.date({
    message: {
      required_error: 'Personal ID or passport expiry date is required!',
    },
  }),
  vatRegistrationCertificateExpiry: schemaHelper.date({
    message: {
      required_error: 'VAT registration certificate expiry date is required!',
    },
  }),
  chauffeurProfilePicFile: schemaHelper.file({
    message: { required_error: 'Profile picture is required!' },
  }),
  chauffeurDriversLicenseFiles: schemaHelper.files({
    message: { required_error: "Driver's license is required!", minFiles: 1 },
  }),
  chauffeurPrivateHireLicenseFiles: schemaHelper.files({
    message: {
      required_error: 'Private hire license is required!',
      minFiles: 1,
    },
  }),
  chauffeurDriversLicenseExpiry: schemaHelper.date({
    message: { required_error: "Driver's license expiry date is required!" },
  }),
  chauffeurPrivateHireLicenseExpiry: schemaHelper.date({
    message: {
      required_error: 'Private hire license expiry date is required!',
    },
  }),
  vehiclePicFile: schemaHelper.file({
    message: { required_error: 'Vehicle picture is required!' },
  }),
  vehiclePrivateHireLicenseFiles: schemaHelper.files({
    message: {
      required_error: 'Private hire license is required!',
      minFiles: 1,
    },
  }),
  vehiclePrivateHireLicenseExpiry: schemaHelper.date({
    message: {
      required_error: 'Private hire license expiry date is required!',
    },
  }),
  vehicleMotTestCertificateFiles: schemaHelper.files({
    message: {
      required_error: 'MOT test certificate is required!',
      minFiles: 1,
    },
  }),
  vehicleMotTestCertificateExpiry: schemaHelper.date({
    message: {
      required_error: 'MOT test certificate expiry date is required!',
    },
  }),
  vehicleInsuranceFiles: schemaHelper.files({
    message: { required_error: 'Vehicle insurance is required!', minFiles: 1 },
  }),
  vehicleInsuranceExpiry: schemaHelper.date({
    message: { required_error: 'Vehicle insurance expiry date is required!' },
  }),
  vehicleRegistrationFiles: schemaHelper.files({
    message: {
      required_error: 'Vehicle registration is required!',
      minFiles: 1,
    },
  }),
  vehicleLeasingContractFiles: schemaHelper.files({
    message: { required_error: 'Leasing contract is required!', minFiles: 1 },
  }),
});

type Props = {
  currentProvider?: IProviderAccount;
  currentChauffeur?: IUserItem;
  currentVehicle?: IVehicleItem;
  onSubmit: (data: OnboardingDocumentsSchemaType) => void;
};

export function UploadDocumentsStep({
  currentProvider,
  currentChauffeur,
  currentVehicle,
  onSubmit,
}: Props) {
  const defaultValues = useMemo(
    () => ({
      companyPrivateHireOperatorLicenseFiles:
        currentProvider?.companyPrivateHireOperatorLicenseUrls || [],
      personalIDorPassportFiles: currentProvider?.personalIDorPassportUrls || [],
      vatRegistrationCertificateFiles: currentProvider?.vatRegistrationCertificateUrls || [],
      companyPrivateHireOperatorLicenseExpiry:
        currentProvider?.companyPrivateHireOperatorLicenseExpiryDate || null,
      personalIDorPassportExpiry: currentProvider?.personalIDorPassportExpiryDate || null,
      vatRegistrationCertificateExpiry:
        currentProvider?.vatRegistrationCertificateExpiryDate || null,
      chauffeurProfilePicFile: null,
      chauffeurDriversLicenseFiles: currentChauffeur?.driversLicenseUrls || [],
      chauffeurPrivateHireLicenseFiles: currentChauffeur?.privateHireLicenseUrls || [],
      chauffeurDriversLicenseExpiry: currentChauffeur?.driversLicenseExpiryDate || null,
      chauffeurPrivateHireLicenseExpiry: currentChauffeur?.privateHireLicenseExpiryDate || null,
      vehiclePicFile: null,
      vehiclePrivateHireLicenseFiles: currentVehicle?.privateHireLicenseUrls || [],
      vehiclePrivateHireLicenseExpiry: currentVehicle?.privateHireLicenseExpiryDate || null,
      vehicleMotTestCertificateFiles: currentVehicle?.motTestCertificateUrls || [],
      vehicleMotTestCertificateExpiry: currentVehicle?.motTestCertificateExpiryDate || null,
      vehicleInsuranceFiles: currentVehicle?.vehicleInsuranceUrls || [],
      vehicleInsuranceExpiry: currentVehicle?.vehicleInsuranceExpiryDate || null,
      vehicleRegistrationFiles: currentVehicle?.vehicleRegistrationUrls || [],
      vehicleLeasingContractFiles: currentVehicle?.leasingContractUrls || [],
    }),
    [currentProvider, currentChauffeur, currentVehicle]
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

  const handleRemoveFile = useCallback(
    (inputFile: File | string, fieldName: keyof OnboardingDocumentsSchemaType) => {
      const fieldValue = values[fieldName];
      if (Array.isArray(fieldValue)) {
        const filtered = fieldValue.filter((file) => file !== inputFile);
        setValue(fieldName, filtered, { shouldValidate: true });
      } else if (typeof fieldValue === 'string' && fieldName.endsWith('File')) {
        setValue(fieldName, null, { shouldValidate: true });
      }
    },
    [setValue, values]
  );

  const handleRemoveAllFiles = useCallback(
    (fieldName: keyof OnboardingDocumentsSchemaType) => {
      setValue(fieldName, [], { shouldValidate: true });
    },
    [setValue]
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Company Documents
            </Typography>
            <DocumentSection
              title="Company Private Hire Operator License"
              fieldName="companyPrivateHireOperatorLicenseFiles"
              expiryField="companyPrivateHireOperatorLicenseExpiry"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
            />
            <Divider sx={{ my: 3 }} />
            <DocumentSection
              title="Personal ID or Passport"
              fieldName="personalIDorPassportFiles"
              expiryField="personalIDorPassportExpiry"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
            />
            <Divider sx={{ my: 3 }} />
            <DocumentSection
              title="VAT Registration Certificate"
              fieldName="vatRegistrationCertificateFiles"
              expiryField="vatRegistrationCertificateExpiry"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
            />
          </Card>

          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Chauffeur Documents
            </Typography>
            <DocumentSection
              title="Profile Picture"
              fieldName="chauffeurProfilePicFile"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
            />
            <Divider sx={{ my: 3 }} />
            <DocumentSection
              title="Driver's License"
              fieldName="chauffeurDriversLicenseFiles"
              expiryField="chauffeurDriversLicenseExpiry"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
            />
            <Divider sx={{ my: 3 }} />
            <DocumentSection
              title="Private Hire License"
              fieldName="chauffeurPrivateHireLicenseFiles"
              expiryField="chauffeurPrivateHireLicenseExpiry"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
            />
          </Card>

          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Vehicle Documents
            </Typography>
            <DocumentSection
              title="Vehicle Picture"
              fieldName="vehiclePicFile"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
            />
            <Divider sx={{ my: 3 }} />
            <DocumentSection
              title="Private Hire License"
              fieldName="vehiclePrivateHireLicenseFiles"
              expiryField="vehiclePrivateHireLicenseExpiry"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
            />
            <Divider sx={{ my: 3 }} />
            <DocumentSection
              title="MOT Test Certificate"
              fieldName="vehicleMotTestCertificateFiles"
              expiryField="vehicleMotTestCertificateExpiry"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
            />
            <Divider sx={{ my: 3 }} />
            <DocumentSection
              title="Vehicle Registration"
              fieldName="vehicleRegistrationFiles"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
            />
            <Divider sx={{ my: 3 }} />
            <DocumentSection
              title="Vehicle Insurance"
              fieldName="vehicleInsuranceFiles"
              expiryField="vehicleInsuranceExpiry"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
            />
            <Divider sx={{ my: 3 }} />
            <DocumentSection
              title="Leasing Contract"
              fieldName="vehicleLeasingContractFiles"
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
            />
          </Card>
        </Stack>
      </form>
    </FormProvider>
  );
}

type DocumentSectionProps = {
  title: string;
  fieldName: keyof OnboardingDocumentsSchemaType;
  expiryField?: keyof OnboardingDocumentsSchemaType;
  onRemove: (file: File | string, fieldName: keyof OnboardingDocumentsSchemaType) => void;
  onRemoveAll: (fieldName: keyof OnboardingDocumentsSchemaType) => void;
};

function DocumentSection({
  title,
  fieldName,
  expiryField,
  onRemove,
  onRemoveAll,
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
      />
    </Stack>
  );
}
