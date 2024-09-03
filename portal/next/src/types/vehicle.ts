import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type IVehicleTableFilters = {
  licensePlate: string;
  status: string;
};

export interface IVehicleItem {
  id: string;
  licensePlate: string;
  model: string;
  colour: string; // Use British English spelling for consistency
  productionYear: string;
  serviceClass: string;
  status: string;
  privateHireLicenseUrls: string[];
  privateHireLicenseExpiryDate: IDateValue;
  privateHireLicenseStatus: 'pending' | 'rejected' | 'approved';
  motTestCertificateUrls: string[];
  motTestCertificateExpiryDate: IDateValue;
  motTestCertificateStatus: 'pending' | 'rejected' | 'approved';
  vehiclePicUrl: string;
  vehiclePicStatus: 'pending' | 'rejected' | 'approved';
  vehicleInsuranceUrls: string[];
  vehicleInsuranceExpiryDate: IDateValue;
  vehicleInsuranceStatus: 'pending' | 'rejected' | 'approved';
  vehicleRegistrationUrls: string[];
  vehicleRegistrationStatus: 'pending' | 'rejected' | 'approved';
  leasingContractUrls?: string[];
  leasingContractStatus?: 'pending' | 'rejected' | 'approved';
}
