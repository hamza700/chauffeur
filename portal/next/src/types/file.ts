import type { IDatePickerControl } from './common';

// ----------------------------------------------------------------------

export type IFileFilters = {
  name: string;
  status: string;
  startDate: IDatePickerControl;
  endDate: IDatePickerControl;
};

export interface IStorageFile {
  id: string;
  name: string;
  size: number;
  type: string;
  path: string;
  entityId: string; // Add this field
  status: string;
  createdAt: string;
  modifiedAt: string;
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
