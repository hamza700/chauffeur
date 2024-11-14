import type { IDateValue, IDatePickerControl } from './common';

// ----------------------------------------------------------------------

export type IOrderTableFilters = {
  name: string;
  status: string;
  startDate: IDatePickerControl;
  endDate: IDatePickerControl;
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
  createdAt: IDateValue;
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
  createdAt: IDateValue;
  providerId: string;
  history?: IBookingHistoryItem;
  review?: IBookingReview;
}

export interface IBookingHistoryItem {
  id: string;
  bookingId: string;
  providerId: string;
  chauffeurId: string;
  startTime: IDateValue;
  arrivedPickupTime: IDateValue;
  customerOnboardedTime: IDateValue;
  arrivedDestinationTime: IDateValue;
}

export type IBookingReview = {
  id: string;
  bookingId: string;
  customerId: string;
  rating: number;
  comment: string;
  createdAt: IDateValue;
};
