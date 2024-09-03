import type { IDateValue, IDatePickerControl } from './common';

// ----------------------------------------------------------------------

export type IOrderHistory = {
  timeline: { title: string; time: IDateValue }[];
};

export type IOrderTableFilters = {
  name: string;
  status: string;
  startDate: IDatePickerControl;
  endDate: IDatePickerControl;
};

export type IOrderCustomer = {
  id: string;
  name: string;
};

export type IOrderDriver = {
  name: string;
  carRegistration: string;
};

export type IOrderReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  helpful: number;
  avatarUrl: string;
  postedAt: IDateValue;
  isPurchased: boolean;
  attachments?: string[];
};

export interface IOrderItem {
  id: string;
  orderNumber: string;
  date: Date;
  pickupLocation: string;
  dropoffLocation: string;
  serviceClass: string;
  totalAmount: number;
  status: string;
  customer: IOrderCustomer;
  specialRequests?: string;
  history: IOrderHistory;
  driver?: IOrderDriver;
  distance: number;
  reviews?: IOrderReview[];
}
