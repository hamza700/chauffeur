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
  companyPrivateHireOperatorLicenseUrls: schemaHelper.files({
    message: {
      required_error: 'Private hire operator license is required!',
      minFiles: 1,
    },
  }),
  personalIDorPassportUrls: schemaHelper.files({
    message: {
      required_error: 'Personal ID or passport is required!',
      minFiles: 1,
    },
  }),
  vatRegistrationCertificateUrls: schemaHelper.files({
    message: {
      required_error: 'VAT registration certificate is required!',
      minFiles: 1,
    },
  }),
  companyPrivateHireOperatorLicenseExpiryDate: schemaHelper.date({
    message: {
      required_error: 'Private hire operator license expiry date is required!',
    },
  }),
  personalIDorPassportExpiryDate: schemaHelper.date({
    message: {
      required_error: 'Personal ID or passport expiry date is required!',
    },
  }),
  vatRegistrationCertificateExpiryDate: schemaHelper.date({
    message: {
      required_error: 'VAT registration certificate expiry date is required!',
    },
  }),
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
  onSubmit: (data: {
    providerDocuments: {
      companyPrivateHireOperatorLicenseExpiryDate: Date | null;
      companyPrivateHireOperatorLicenseStatus: string;
      personalIDorPassportExpiryDate: Date | null;
      personalIDorPassportStatus: string;
      vatRegistrationCertificateExpiryDate: Date | null;
      vatRegistrationCertificateStatus: string;
    };
    chauffeurDocuments: {
      profilePicStatus: string;
      driversLicenseExpiryDate: Date | null;
      driversLicenseStatus: string;
      privateHireLicenseExpiryDate: Date | null;
      privateHireLicenseStatus: string;
    };
    vehicleDocuments: {
      vehiclePicStatus: string;
      privateHireLicenseExpiryDate: Date | null;
      privateHireLicenseStatus: string;
      motTestCertificateExpiryDate: Date | null;
      motTestCertificateStatus: string;
      vehicleInsuranceExpiryDate: Date | null;
      vehicleInsuranceStatus: string;
      vehicleRegistrationStatus: string;
      leasingContractStatus: string | undefined;
    };
    pendingUploads: {
      provider: {
        companyPrivateHireOperatorLicense?: { files: File[]; expiryDate: Date | null };
        personalIDorPassport?: { files: File[]; expiryDate: Date | null };
        vatRegistrationCertificate?: { files: File[]; expiryDate: Date | null };
      };
      chauffeur: {
        profilePic?: File;
        driversLicense?: { files: File[]; expiryDate: Date | null };
        privateHireLicense?: { files: File[]; expiryDate: Date | null };
      };
      vehicle: {
        vehiclePic?: File;
        privateHireLicense?: { files: File[]; expiryDate: Date | null };
        motTestCertificate?: { files: File[]; expiryDate: Date | null };
        vehicleInsurance?: { files: File[]; expiryDate: Date | null };
        vehicleRegistration?: { files: File[] };
        leasingContract?: { files: File[] };
      };
    };
  }) => void;
  currentProvider?: any;
  currentChauffeur?: any;
  currentVehicle?: any;
};

export function UploadDocumentsStep({
  onSubmit,
  currentProvider,
  currentChauffeur,
  currentVehicle,
}: Props) {
  const defaultValues = useMemo(
    () => ({
      companyPrivateHireOperatorLicenseUrls: [],
      companyPrivateHireOperatorLicenseStatus: 'pending',
      personalIDorPassportUrls: [],
      personalIDorPassportStatus: 'pending',
      vatRegistrationCertificateUrls: [],
      vatRegistrationCertificateStatus: 'pending',
      companyPrivateHireOperatorLicenseExpiryDate: null,
      personalIDorPassportExpiryDate: null,
      vatRegistrationCertificateExpiryDate: null,

      // Chauffeur documents
      profilePicUrl: null,
      profilePicStatus: 'pending',
      chauffeurDriversLicenseUrls: [],
      chauffeurDriversLicenseStatus: 'pending',
      chauffeurPrivateHireLicenseUrls: [],
      chauffeurPrivateHireLicenseStatus: 'pending',
      chauffeurDriversLicenseExpiryDate: null,
      chauffeurPrivateHireLicenseExpiryDate: null,

      // Vehicle documents
      vehiclePicUrl: null,
      vehiclePicStatus: 'pending',
      vehiclePrivateHireLicenseUrls: [],
      vehiclePrivateHireLicenseStatus: 'pending',
      vehiclePrivateHireLicenseExpiryDate: null,
      vehicleMotTestCertificateUrls: [],
      vehicleMotTestCertificateStatus: 'pending',
      vehicleMotTestCertificateExpiryDate: null,
      vehicleInsuranceUrls: [],
      vehicleInsuranceStatus: 'pending',
      vehicleInsuranceExpiryDate: null,
      vehicleRegistrationUrls: [],
      vehicleRegistrationStatus: 'pending',
      vehicleLeasingContractUrls: [],
      leasingContractStatus: 'pending',
    }),
    []
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
      providerDocuments: {
        companyPrivateHireOperatorLicenseExpiryDate:
          data.companyPrivateHireOperatorLicenseExpiryDate,
        companyPrivateHireOperatorLicenseStatus: 'pending',
        personalIDorPassportExpiryDate: data.personalIDorPassportExpiryDate,
        personalIDorPassportStatus: 'pending',
        vatRegistrationCertificateExpiryDate: data.vatRegistrationCertificateExpiryDate,
        vatRegistrationCertificateStatus: 'pending',
      },
      chauffeurDocuments: {
        profilePicStatus: 'pending',
        driversLicenseExpiryDate: data.chauffeurDriversLicenseExpiryDate,
        driversLicenseStatus: 'pending',
        privateHireLicenseExpiryDate: data.chauffeurPrivateHireLicenseExpiryDate,
        privateHireLicenseStatus: 'pending',
      },
      vehicleDocuments: {
        vehiclePicStatus: 'pending',
        privateHireLicenseExpiryDate: data.vehiclePrivateHireLicenseExpiryDate,
        privateHireLicenseStatus: 'pending',
        motTestCertificateExpiryDate: data.vehicleMotTestCertificateExpiryDate,
        motTestCertificateStatus: 'pending',
        vehicleInsuranceExpiryDate: data.vehicleInsuranceExpiryDate,
        vehicleInsuranceStatus: 'pending',
        vehicleRegistrationStatus: 'pending',
        leasingContractStatus: data.vehicleLeasingContractUrls?.length ? 'pending' : undefined,
      },
      pendingUploads: {
        provider: {
          companyPrivateHireOperatorLicense: {
            files: data.companyPrivateHireOperatorLicenseUrls,
            expiryDate: data.companyPrivateHireOperatorLicenseExpiryDate,
          },
          personalIDorPassport: {
            files: data.personalIDorPassportUrls,
            expiryDate: data.personalIDorPassportExpiryDate,
          },
          vatRegistrationCertificate: {
            files: data.vatRegistrationCertificateUrls,
            expiryDate: data.vatRegistrationCertificateExpiryDate,
          },
        },
        chauffeur: {
          profilePic: data.profilePicUrl,
          driversLicense: {
            files: data.chauffeurDriversLicenseUrls,
            expiryDate: data.chauffeurDriversLicenseExpiryDate,
          },
          privateHireLicense: {
            files: data.chauffeurPrivateHireLicenseUrls,
            expiryDate: data.chauffeurPrivateHireLicenseExpiryDate,
          },
        },
        vehicle: {
          vehiclePic: data.vehiclePicUrl,
          privateHireLicense: {
            files: data.vehiclePrivateHireLicenseUrls,
            expiryDate: data.vehiclePrivateHireLicenseExpiryDate,
          },
          motTestCertificate: {
            files: data.vehicleMotTestCertificateUrls,
            expiryDate: data.vehicleMotTestCertificateExpiryDate,
          },
          vehicleInsurance: {
            files: data.vehicleInsuranceUrls,
            expiryDate: data.vehicleInsuranceExpiryDate,
          },
          vehicleRegistration: {
            files: data.vehicleRegistrationUrls,
          },
          leasingContract: {
            files: data.vehicleLeasingContractUrls,
          },
        },
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
            {/* Provider Documents */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Company Documents
              </Typography>
              <DocumentSection
                title="Company Private Hire Operator License"
                fieldName="companyPrivateHireOperatorLicenseUrls"
                expiryField="companyPrivateHireOperatorLicenseExpiryDate"
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onDrop={handleDrop} // Handle file drop for correct handling
              />
              <Divider sx={{ my: 3 }} />
              <DocumentSection
                title="Personal ID or Passport"
                fieldName="personalIDorPassportUrls"
                expiryField="personalIDorPassportExpiryDate"
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onDrop={handleDrop} // Handle file drop for correct handling
              />
              <Divider sx={{ my: 3 }} />
              <DocumentSection
                title="VAT Registration Certificate"
                fieldName="vatRegistrationCertificateUrls"
                expiryField="vatRegistrationCertificateExpiryDate"
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onDrop={handleDrop} // Handle file drop for correct handling
              />
            </Card>

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
