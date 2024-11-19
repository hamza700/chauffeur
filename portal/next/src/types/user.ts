import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type IUserTableFilters = {
  name: string;
  status: string;
};

export type IUserDocumentFields = {
  profilePicStatus: 'pending' | 'rejected' | 'approved';
  driversLicenseExpiryDate: IDateValue;
  driversLicenseStatus: 'pending' | 'rejected' | 'approved';
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
  isOnboarded: boolean;
  driversLicense: string;
  privateHireLicense: string;
  licensePlate: string;
  documents: IUserDocumentFields;
};
