import type { IDateValue } from './common';

export type IProvidersTableFilters = {
  companyName: string;
  status: string;
};

export type IDocumentFields = {
  companyPrivateHireOperatorLicenseExpiryDate: IDateValue;
  companyPrivateHireOperatorLicenseStatus: 'pending' | 'rejected' | 'approved';
  personalIDorPassportExpiryDate: IDateValue;
  personalIDorPassportStatus: 'pending' | 'rejected' | 'approved';
  vatRegistrationCertificateExpiryDate: IDateValue;
  vatRegistrationCertificateStatus: 'pending' | 'rejected' | 'approved';
};

export type IProviderAccount = {
  id: string;
  city: string;
  state: string;
  address: string;
  postCode: string;
  isOnboarded: boolean;
  status: string;
  formCompleted: boolean;
  phoneNumber: string;
  country: string | null;
  companyName: string;
  companyRegistrationNumber: string;
  taxIdentificationNumber: string;
  vatNumber: string;
  documents: IDocumentFields;
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
  sortCode?: string;
};
