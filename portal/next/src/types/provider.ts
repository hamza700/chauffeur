import type { IDateValue } from './common';

export type IProvidersTableFilters = {
  companyName: string;
  status: string;
};

export type IProviderAccount = {
  id: string;
  city: string;
  state: string;
  address: string;
  postCode: string;
  isVerified: boolean;
  status: string;
  formCompleted: boolean;
  phoneNumber: string;
  country: string | null;
  companyName: string;
  companyRegistrationNumber: string;
  taxIdentificationNumber: string;
  vatNumber: string;
  companyPrivateHireOperatorLicenseUrls: string[];
  companyPrivateHireOperatorLicenseExpiryDate: IDateValue;
  companyPrivateHireOperatorLicenseStatus: 'pending' | 'rejected' | 'approved';
  personalIDorPassportUrls: string[];
  personalIDorPassportExpiryDate: IDateValue;
  personalIDorPassportStatus: 'pending' | 'rejected' | 'approved';
  vatRegistrationCertificateUrls: string[];
  vatRegistrationCertificateExpiryDate: IDateValue;
  vatRegistrationCertificateStatus: 'pending' | 'rejected' | 'approved';
  partnerAgreement: PartnerAgreement;
  paymentDetails: PaymentDetails;
};

export type PartnerAgreement = {
  agreeToTerms: boolean;
  signature: string;
};

export type PaymentDetails = {
  paymentMethod:
    | 'paypal'
    | 'bankTransferDTAZV'
    | 'bankTransferDomestic'
    | 'bankTransferInternational';
  paypalEmail?: string;
  bankAccountOwnerName?: string;
  bankName?: string;
  bankCountry?: string | null;
  bankAccountNumber?: string;
  iban?: string;
  swiftCode?: string;
};
