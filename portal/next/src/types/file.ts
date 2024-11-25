import type { IDateValue, IDatePickerControl } from './common';

// ----------------------------------------------------------------------

export type IFileFilters = {
  name: string;
  status: 'pending' | 'rejected' | 'approved';
  startDate: IDatePickerControl;
  endDate: IDatePickerControl;
};

export interface IStorageFile {
  id: string;
  name: string;
  size: number;
  type: string;
  path: string;
  status: 'pending' | 'approved' | 'rejected';
  modifiedAt: Date;
  documentType: string;
  documentCategory: 'chauffeur' | 'vehicle' | 'provider';
  providerId: string;
  chauffeurId?: string;
  vehicleId?: string;
}

export interface IStorageFolder {
  id: string;
  name: string;
  type: 'folder';
  path: string;
}

