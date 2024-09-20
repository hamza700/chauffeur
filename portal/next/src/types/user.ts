import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type IUserTableFilters = {
  name: string;
  status: string;
};

export type IUserDocumentFields = {
  profilePicUrl: string;
  profilePicStatus: 'pending' | 'rejected' | 'approved';
  driversLicenseUrls: string[];
  driversLicenseExpiryDate: IDateValue;
  driversLicenseStatus: 'pending' | 'rejected' | 'approved';
  privateHireLicenseUrls: string[];
  privateHireLicenseExpiryDate: IDateValue;
  privateHireLicenseStatus: 'pending' | 'rejected' | 'approved';
};

export type IUserItem = {
  id: string;
  providerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  status: string;
  country: string;
  isVerified: boolean;
  driversLicense: string;
  privateHireLicense: string;
  licensePlate: string;
  documents: IUserDocumentFields;
};
