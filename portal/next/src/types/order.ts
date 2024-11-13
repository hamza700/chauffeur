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

export interface IAvailableJobsItem {
  id: string;
  orderNumber: string;
  date: string;
  time: string;
  pickupLocation: string;
  dropoffLocation: string;
  serviceClass: string;
  totalAmount: number;
  specialRequests?: string;
  distance: string;
  estimatedDuration: string;
  customerId: string;
  passengers: number;
  luggage: number;
  flightNumber: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhoneNumber: string;
  bookingType: string;
  driverAmount: number;
  hours: string;
}

export interface IBookingItem {
  id: string;
  orderNumber: string;
  date: string;
  time: string;
  pickupLocation: string;
  dropoffLocation: string;
  serviceClass: string;
  totalAmount: number;
  status: string;
  specialRequests?: string;
  distance: string;
  estimatedDuration: string;
  customerId: string;
  chauffeurId: string;
  passengers: number;
  luggage: number;
  flightNumber: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhoneNumber: string;
  bookingType: string;
  driverAmount: number;
  hours: string;
  createdAt: string;
  providerId: string;
  history?: IOrderHistory;
}
