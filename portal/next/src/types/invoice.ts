import type { IDateValue, IAddressItem, IDatePickerControl } from './common';

// ----------------------------------------------------------------------

export type IInvoiceTableFilters = {
  name: string;
  status: string;
  endDate: IDatePickerControl;
  startDate: IDatePickerControl;
};

export type IInvoiceItem = {
  id: string;
  bookingNumber: string;
  date: IDateValue;
  driver: string;
  pickupLocation: string;
  destination: string;
  total: number;
};

export type IInvoice = {
  id: string;
  status: string;
  totalAmount: number;
  invoiceNumber: string;
  items: IInvoiceItem[];
  invoiceTo: IAddressItem;
  invoiceFrom: IAddressItem;
  createDate: IDateValue;
  dueDate: IDateValue;
};
