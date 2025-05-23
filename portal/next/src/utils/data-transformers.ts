import type { IUserItem, IUserDocumentFields } from 'src/types/user';
import type { IVehicleItem, IVehicleDocumentFields } from 'src/types/vehicle';
import type {
  PaymentDetails,
  IDocumentFields,
  IProviderAccount,
  PartnerAgreement,
} from 'src/types/provider';
import type {
  IBookingItem,
  IBookingReview,
  IAvailableJobsItem,
  IBookingHistoryItem,
} from 'src/types/booking';
import type {
  VehicleData,
  BookingData,
  ProviderData,
  ChauffeurData,
  AvailableJobsData,
} from 'src/auth/context/supabase';

export const transformChauffeurData = (user: any): IUserItem => ({
  id: user.id,
  providerId: user.provider_id,
  firstName: user.first_name,
  lastName: user.last_name,
  email: user.email,
  phoneNumber: user.phone_number,
  status: user.status,
  country: user.country,
  isOnboarded: user.onboarded,
  driversLicense: user.drivers_license,
  privateHireLicense: user.private_hire_license,
  licensePlate: user.license_plate,
  documents: {
    profilePicStatus: user.profile_pic_status,
    driversLicenseExpiryDate: user.drivers_license_expiry_date,
    driversLicenseStatus: user.drivers_license_status,
    privateHireLicenseExpiryDate: user.private_hire_license_expiry_date,
    privateHireLicenseStatus: user.private_hire_license_status,
  } as IUserDocumentFields,
});

export const transformToChauffeurData = (user: any): ChauffeurData => ({
  id: user.id,
  first_name: user.firstName,
  last_name: user.lastName,
  email: user.email,
  phone_number: user.phoneNumber,
  status: user.status,
  country: user.country,
  drivers_license: user.driversLicense,
  private_hire_license: user.privateHireLicense,
  license_plate: user.licensePlate,
  profile_pic_status: user.profilePicStatus,
  drivers_license_status: user.driversLicenseStatus,
  private_hire_license_status: user.privateHireLicenseStatus,
  drivers_license_expiry_date: user.driversLicenseExpiryDate,
  private_hire_license_expiry_date: user.privateHireLicenseExpiryDate,
  provider_id: user.providerId,
  onboarded: user.onboarded,
  created_at: user.createdAt,
});

export const transformVehicleData = (vehicle: any): IVehicleItem => ({
  id: vehicle.id,
  providerId: vehicle.provider_id,
  licensePlate: vehicle.license_plate,
  model: vehicle.model,
  colour: vehicle.colour,
  productionYear: vehicle.production_year,
  serviceClass: vehicle.service_class,
  status: vehicle.status,
  documents: {
    privateHireLicenseExpiryDate: vehicle.private_hire_license_expiry_date,
    privateHireLicenseStatus: vehicle.private_hire_license_status,
    motTestCertificateExpiryDate: vehicle.mot_test_certificate_expiry_date,
    motTestCertificateStatus: vehicle.mot_test_certificate_status,
    vehiclePicStatus: vehicle.vehicle_pic_status,
    vehicleInsuranceExpiryDate: vehicle.vehicle_insurance_expiry_date,
    vehicleInsuranceStatus: vehicle.vehicle_insurance_status,
    vehicleRegistrationStatus: vehicle.vehicle_registration_status,
    leasingContractStatus: vehicle.leasing_contract_status,
  } as IVehicleDocumentFields,
});

export const transformToVehicleData = (vehicle: any): VehicleData => ({
  id: vehicle.id,
  provider_id: vehicle.providerId,
  license_plate: vehicle.licensePlate,
  model: vehicle.model,
  colour: vehicle.colour,
  production_year: vehicle.productionYear,
  service_class: vehicle.serviceClass,
  status: vehicle.status,
  private_hire_license_expiry_date: vehicle.privateHireLicenseExpiryDate,
  private_hire_license_status: vehicle.privateHireLicenseStatus,
  mot_test_certificate_expiry_date: vehicle.motTestCertificateExpiryDate,
  mot_test_certificate_status: vehicle.motTestCertificateStatus,
  vehicle_pic_status: vehicle.vehiclePicStatus,
  vehicle_insurance_expiry_date: vehicle.vehicleInsuranceExpiryDate,
  vehicle_insurance_status: vehicle.vehicleInsuranceStatus,
  vehicle_registration_status: vehicle.vehicleRegistrationStatus,
  leasing_contract_status: vehicle.leasingContractStatus,
  created_at: vehicle.createdAt,
});

export const transformProviderData = (provider: any): IProviderAccount => ({
  id: provider.id,
  city: provider.city,
  email: provider.email,
  state: provider.state,
  address: provider.address,
  postCode: provider.post_code,
  isOnboarded: provider.onboarded,
  status: provider.status,
  formCompleted: provider.form_completed,
  phoneNumber: provider.phone_number,
  country: provider.country,
  companyName: provider.company_name,
  companyRegistrationNumber: provider.company_registration_number,
  taxIdentificationNumber: provider.tax_identification_number,
  vatNumber: provider.vat_number,
  documents: {
    companyPrivateHireOperatorLicenseExpiryDate:
      provider.company_private_hire_operator_license_expiry_date,
    companyPrivateHireOperatorLicenseStatus: provider.company_private_hire_operator_license_status,
    personalIDorPassportExpiryDate: provider.personal_id_or_passport_expiry_date,
    personalIDorPassportStatus: provider.personal_id_or_passport_status,
    vatRegistrationCertificateExpiryDate: provider.vat_registration_certificate_expiry_date,
    vatRegistrationCertificateStatus: provider.vat_registration_certificate_status,
  } as IDocumentFields,
  partnerAgreement: {
    agreeToTerms: provider.agree_to_terms,
    signature: provider.signature,
  } as PartnerAgreement,
  paymentDetails: {
    paymentMethod: provider.payment_method,
    paypalEmail: provider.paypal_email,
    bankAccountOwnerName: provider.bank_account_owner_name,
    bankName: provider.bank_name,
    bankCountry: provider.bank_country,
    bankAccountNumber: provider.bank_account_number,
    sortCode: provider.sort_code,
  } as PaymentDetails,
});

export const transformToProviderData = (provider: any): ProviderData => ({
  id: provider.id,
  city: provider.city,
  email: provider.email,
  state: provider.state,
  address: provider.address,
  post_code: provider.postCode,
  status: provider.status,
  phone_number: provider.phoneNumber,
  country: provider.country,
  company_name: provider.companyName,
  company_registration_number: provider.companyRegistrationNumber,
  tax_identification_number: provider.taxIdentificationNumber,
  vat_number: provider.vatNumber,
  company_private_hire_operator_license_expiry_date:
    provider.companyPrivateHireOperatorLicenseExpiryDate,
  company_private_hire_operator_license_status: provider.companyPrivateHireOperatorLicenseStatus,
  personal_id_or_passport_expiry_date: provider.personalIDorPassportExpiryDate,
  personal_id_or_passport_status: provider.personalIDorPassportStatus,
  vat_registration_certificate_expiry_date: provider.vatRegistrationCertificateExpiryDate,
  vat_registration_certificate_status: provider.vatRegistrationCertificateStatus,
  first_name: provider.firstName,
  last_name: provider.lastName,
  agree_to_terms: provider.agreeToTerms,
  signature: provider.signature,
  payment_method: provider.paymentMethod,
  paypal_email: provider.paypalEmail || null,
  bank_account_owner_name: provider.bankAccountOwnerName || null,
  bank_name: provider.bankName || null,
  bank_country: provider.bankCountry || null,
  bank_account_number: provider.bankAccountNumber || null,
  sort_code: provider.sortCode || null,
  onboarded: provider.onboarded,
  created_at: provider.createdAt,
});

export const transformBookingData = (booking: any): IBookingItem => ({
  id: booking.id,
  orderNumber: booking.order_number,
  date: booking.date,
  time: booking.time,
  pickupLocation: booking.pickup_location,
  dropoffLocation: booking.dropoff_location,
  serviceClass: booking.service_class,
  totalAmount: booking.total_amount,
  status: booking.status,
  specialRequests: booking.special_requests,
  distance: booking.distance,
  estimatedDuration: booking.estimated_duration,
  customerId: booking.customer_id,
  chauffeurId: booking.chauffeur_id,
  passengers: booking.passengers,
  luggage: booking.luggage,
  flightNumber: booking.flight_number,
  customerFirstName: booking.customer_first_name,
  customerLastName: booking.customer_last_name,
  customerEmail: booking.customer_email,
  customerPhoneNumber: booking.customer_phone_number,
  bookingType: booking.booking_type,
  driverAmount: booking.driver_amount,
  hours: booking.hours,
  createdAt: booking.created_at,
  providerId: booking.provider_id,
});

export const transformToBookingData = (booking: any): BookingData => ({
  id: booking.id,
  order_number: booking.orderNumber,
  date: booking.date,
  time: booking.time,
  pickup_location: booking.pickupLocation,
  dropoff_location: booking.dropoffLocation,
  service_class: booking.serviceClass,
  total_amount: booking.totalAmount,
  status: booking.status,
  special_requests: booking.specialRequests,
  distance: booking.distance,
  estimated_duration: booking.estimatedDuration,
  customer_id: booking.customerId,
  chauffeur_id: booking.chauffeurId,
  passengers: booking.passengers,
  luggage: booking.luggage,
  flight_number: booking.flightNumber,
  customer_first_name: booking.customerFirstName,
  customer_last_name: booking.customerLastName,
  customer_email: booking.customerEmail,
  customer_phone_number: booking.customerPhoneNumber,
  booking_type: booking.bookingType,
  driver_amount: booking.driverAmount,
  hours: booking.hours,
  created_at: booking.createdAt,
  provider_id: booking.providerId,
});

export const transformAvailableJobsData = (availableJobs: any): IAvailableJobsItem => ({
  id: availableJobs.id,
  orderNumber: availableJobs.order_number,
  date: availableJobs.date,
  time: availableJobs.time,
  pickupLocation: availableJobs.pickup_location,
  dropoffLocation: availableJobs.dropoff_location,
  serviceClass: availableJobs.service_class,
  totalAmount: availableJobs.total_amount,
  specialRequests: availableJobs.special_requests,
  distance: availableJobs.distance,
  estimatedDuration: availableJobs.estimated_duration,
  customerId: availableJobs.customer_id,
  passengers: availableJobs.passengers,
  luggage: availableJobs.luggage,
  flightNumber: availableJobs.flight_number,
  customerFirstName: availableJobs.customer_first_name,
  customerLastName: availableJobs.customer_last_name,
  customerEmail: availableJobs.customer_email,
  customerPhoneNumber: availableJobs.customer_phone_number,
  bookingType: availableJobs.booking_type,
  driverAmount: availableJobs.driver_amount,
  hours: availableJobs.hours,
  createdAt: availableJobs.created_at,
});

export const transformToAvailableJobsData = (availableJobs: any): AvailableJobsData => ({
  id: availableJobs.id,
  order_number: availableJobs.orderNumber,
  date: availableJobs.date,
  time: availableJobs.time,
  pickup_location: availableJobs.pickupLocation,
  dropoff_location: availableJobs.dropoffLocation,
  service_class: availableJobs.serviceClass,
  total_amount: availableJobs.totalAmount,
  special_requests: availableJobs.specialRequests,
  distance: availableJobs.distance,
  estimated_duration: availableJobs.estimatedDuration,
  customer_id: availableJobs.customerId,
  passengers: availableJobs.passengers,
  luggage: availableJobs.luggage,
  flight_number: availableJobs.flightNumber,
  customer_first_name: availableJobs.customerFirstName,
  customer_last_name: availableJobs.customerLastName,
  customer_email: availableJobs.customerEmail,
  customer_phone_number: availableJobs.customerPhoneNumber,
  booking_type: availableJobs.bookingType,
  driver_amount: availableJobs.driverAmount,
  hours: availableJobs.hours,
  created_at: availableJobs.createdAt,
});

export const transformBookingHistoryData = (bookingHistory: any): IBookingHistoryItem => ({
  id: bookingHistory.id,
  bookingId: bookingHistory.booking_id,
  providerId: bookingHistory.provider_id,
  chauffeurId: bookingHistory.chauffeur_id,
  startTime: bookingHistory.start_time,
  arrivedPickupTime: bookingHistory.arrived_pickup_time,
  customerOnboardedTime: bookingHistory.customer_onboard_time,
  arrivedDestinationTime: bookingHistory.arrived_destination_time,
});

export const transformBookingReviewData = (bookingReview: any): IBookingReview => ({
  id: bookingReview.id,
  bookingId: bookingReview.booking_id,
  customerId: bookingReview.customer_id,
  rating: bookingReview.rating,
  comment: bookingReview.comment,
  createdAt: bookingReview.created_at,
});
