import type { IDateValue, IDatePickerControl } from './common';

// ----------------------------------------------------------------------

export type IFileFilters = {
  name: string;
  status: 'pending' | 'rejected' | 'approved';
  startDate: IDatePickerControl;
  endDate: IDatePickerControl;
};

export type IFolderManager = {
  id: string;
  name: string;
  totalFiles?: number;
};

export type IFileManager = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  status: 'pending' | 'rejected' | 'approved';
  createdAt: IDateValue;
  modifiedAt: IDateValue;
};

export type IFile = IFileManager | IFolderManager;
