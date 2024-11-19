import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type IVehicleTableFilters = {
  licensePlate: string;
  status: string;
};

export type IVehicleDocumentFields = {
  privateHireLicenseExpiryDate: IDateValue;
  privateHireLicenseStatus: 'pending' | 'rejected' | 'approved';
  motTestCertificateExpiryDate: IDateValue;
  motTestCertificateStatus: 'pending' | 'rejected' | 'approved';
  vehiclePicStatus: 'pending' | 'rejected' | 'approved';
  vehicleInsuranceExpiryDate: IDateValue;
  vehicleInsuranceStatus: 'pending' | 'rejected' | 'approved';
  vehicleRegistrationStatus: 'pending' | 'rejected' | 'approved';
  leasingContractStatus?: 'pending' | 'rejected' | 'approved';
};

export type IVehicleItem = {
  id: string;
  providerId: string;
  licensePlate: string;
  model: string;
  colour: string; 
  productionYear: string;
  serviceClass: string;
  status: string;
  documents: IVehicleDocumentFields;
};
