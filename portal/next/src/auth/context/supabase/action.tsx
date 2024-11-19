'use client';

import type {
  AuthError,
  AuthResponse,
  UserResponse,
  PostgrestError,
  AuthTokenResponsePassword,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from '@supabase/supabase-js';

import { paths } from 'src/routes/paths';

import { supabase } from 'src/lib/supabase';

// ----------------------------------------------------------------------

export type SignInParams = {
  email: string;
  password: string;
  options?: SignInWithPasswordCredentials['options'];
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  options?: SignUpWithPasswordCredentials['options'];
};

export type ChauffeurSignUpParams = {
  email: string;
  firstName: string;
  lastName: string;
  chauffeurData: Partial<ChauffeurData>;
  options?: SignUpWithPasswordCredentials['options'];
};

export type ResetPasswordParams = {
  email: string;
  options?: {
    redirectTo?: string;
    captchaToken?: string;
  };
};

export type UpdatePasswordParams = {
  password: string;
  options?: {
    emailRedirectTo?: string | undefined;
  };
};

export type UpdateOnboardingParams = {
  role: 'provider' | 'chauffeur';
  onboarded: boolean;
};

export type AvailableJobsData = {
  id: string;
  order_number: string;
  date: string;
  time: string;
  pickup_location: string;
  dropoff_location: string;
  service_class: string;
  total_amount: number;
  special_requests?: string;
  distance: string;
  estimated_duration: string;
  customer_id: string;
  passengers: number;
  luggage: number;
  flight_number: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone_number: string;
  booking_type: string;
  driver_amount: number;
  hours: string;
  created_at: string;
};

export type BookingData = {
  id: string;
  order_number: string;
  date: string;
  time: string;
  pickup_location: string;
  dropoff_location: string;
  service_class: string;
  total_amount: number;
  status: string;
  special_requests?: string;
  distance: string;
  estimated_duration: string;
  customer_id: string;
  chauffeur_id: string;
  passengers: number;
  luggage: number;
  flight_number: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone_number: string;
  booking_type: string;
  driver_amount: number;
  hours: string;
  created_at: string;
  provider_id: string;
};

export type BookingHistoryData = {
  id: string;
  booking_id: string;
  provider_id: string;
  chauffeur_id: string;
  start_time: string;
  arrived_pickup_time: string;
  customer_onboard_time: string;
  arrived_destination_time: string;
};

export type BookingReviewData = {
  id: string;
  booking_id: string;
  customer_id: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type ChauffeurData = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  status: string | null;
  country: string;
  drivers_license: string;
  private_hire_license: string;
  license_plate: string;
  profile_pic_status: string | null;
  drivers_license_status: string | null;
  private_hire_license_status: string | null;
  drivers_license_expiry_date: string | null;
  private_hire_license_expiry_date: string | null;
  provider_id: string;
  onboarded?: boolean;
  created_at: string;
};

export type ProviderData = {
  id: string;
  city: string;
  email: string;
  state: string;
  address: string;
  post_code: string;
  status: string | null;
  phone_number: string;
  country: string;
  company_name: string;
  company_registration_number: string;
  tax_identification_number: string;
  vat_number: string;
  company_private_hire_operator_license_expiry_date: string;
  company_private_hire_operator_license_status: string | null;
  personal_id_or_passport_expiry_date: string;
  personal_id_or_passport_status: string | null;
  vat_registration_certificate_expiry_date: string;
  vat_registration_certificate_status: string | null;
  first_name: string;
  last_name: string;
  agree_to_terms: boolean;
  signature: string;
  payment_method: string;
  paypal_email: string | null;
  bank_account_owner_name: string | null;
  bank_name: string | null;
  bank_country: string | null;
  bank_account_number: string | null;
  iban: string | null;
  swift_code: string | null;
  onboarded?: boolean;
  created_at: string;
};

export type VehicleData = {
  id: string;
  license_plate: string;
  model: string;
  colour: string;
  production_year: string;
  service_class: string;
  status: string | null;
  private_hire_license_expiry_date: string | null;
  private_hire_license_status: string | null;
  mot_test_certificate_expiry_date: string | null;
  mot_test_certificate_status: string | null;
  vehicle_pic_status: string | null;
  vehicle_insurance_expiry_date: string | null;
  vehicle_insurance_status: string | null;
  vehicle_registration_status: string | null;
  leasing_contract_status: string | null;
  provider_id: string;
  created_at: string;
};

export type VerifyOtpParams = {
  email: string;
  token: string;
};

export type ResendOtpParams = {
  email: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({
  email,
  password,
}: SignInParams): Promise<AuthTokenResponsePassword> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
}: SignUpParams): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: undefined,
      data: {
        first_name: firstName,
        last_name: lastName,
        display_name: `${firstName} ${lastName}`,
        roles: 'provider',
        chauffeur_onboarded: false,
        provider_onboarded: false,
      },
    },
  });

  if (error) {
    console.error(error);
    throw error;
  }

  if (!data?.user?.identities?.length) {
    throw new Error('This user already exists');
  }

  return { data, error };
};

/** **************************************
 * Verify OTP
 *************************************** */
export const verifyOtp = async ({ email, token }: VerifyOtpParams): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup',
  });

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};

/** **************************************
 * Resend OTP
 *************************************** */
export const resendOtp = async ({ email }: ResendOtpParams): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: undefined,
    },
  });

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<{
  error: AuthError | null;
}> => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    throw error;
  }

  return { error };
};

/** **************************************
 * Reset password
 *************************************** */
export const resetPassword = async ({
  email,
}: ResetPasswordParams): Promise<{ data: {}; error: null } | { data: null; error: AuthError }> => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}${paths.auth.supabase.updatePassword}`,
  });

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};

/** **************************************
 * Update password
 *************************************** */
export const updatePassword = async ({ password }: UpdatePasswordParams): Promise<UserResponse> => {
  const { data, error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};

/** **************************************
 * Update user onboarding status
 *************************************** */
export const updateOnboarding = async ({
  role,
  onboarded,
}: UpdateOnboardingParams): Promise<UserResponse> => {
  const { data, error } = await supabase.auth.updateUser({
    data: {
      [`${role}_onboarded`]: onboarded,
    },
  });

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};

/** **************************************
 * Update user role
 *************************************** */
export const updateRole = async (): Promise<UserResponse> => {
  const updatedRoles = ['provider', 'chauffeur'];

  // Update the user with the new roles
  const { data, error } = await supabase.auth.updateUser({
    data: { roles: updatedRoles },
  });

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};

/** **************************************
 * Add a role
 *************************************** */
export const addUserRole = async (
  userId: string,
  role: string
): Promise<{ data: any[] | null; error: PostgrestError | null }> => {
  const { data, error } = await supabase
    .from('user_roles')
    .insert([{ user_id: userId, role }])
    .select();

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};

/** **************************************
 * Get roles by user ID
 *************************************** */
export const getRolesByUserId = async (
  userId: string
): Promise<{ data: any[] | null; error: PostgrestError | null }> => {
  const { data, error } = await supabase.from('user_roles').select('*').eq('user_id', userId);

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};

/** **************************************
 * Get all available jobs
 *************************************** */
export const getAvailableJobs = async (): Promise<{
  data: AvailableJobsData[] | null;
  error: PostgrestError | null;
}> => {
  const { data, error } = await supabase.from('available_jobs').select('*');

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};

/** **************************************
 * Get a single available job by ID
 *************************************** */
export const getAvailableJobById = async (
  userId: string
): Promise<{
  data: AvailableJobsData | null;
  error: PostgrestError | null;
}> => {
  const { data, error } = await supabase
    .from('available_jobs')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};

/** **************************************
 * Insert a new available job
 *************************************** */
export const insertAvailableJob = async (
  newAvailableJob: Partial<AvailableJobsData>
): Promise<{ data: AvailableJobsData[] | null; error: PostgrestError | null }> => {
  const { data, error } = await supabase.from('available_jobs').insert([newAvailableJob]).select();
  if (error) {
    console.error(error);
    throw error;
  }
  return { data, error };
};

/** **************************************
 * Delete a available job
 *************************************** */
export const deleteAvailableJob = async (
  jobId: string
): Promise<{ error: PostgrestError | null }> => {
  const { error } = await supabase.from('available_jobs').delete().eq('id', jobId);
  if (error) {
    console.error(error);
    throw error;
  }
  return { error };
};

/** **************************************
 * Get all bookings
 *************************************** */
export const getBookings = async (): Promise<{
  data: BookingData[] | null;
  error: PostgrestError | null;
}> => {
  const { data, error } = await supabase.from('bookings').select('*');

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};

/** **************************************
 * Get a single booking by ID
 *************************************** */
export const getBookingById = async (
  userId: string
): Promise<{
  data: BookingData | null;
  error: PostgrestError | null;
}> => {
  const { data, error } = await supabase.from('bookings').select('*').eq('id', userId).single();

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};

/** **************************************
 * Insert a new booking
 *************************************** */
export const insertBooking = async (
  newBooking: Partial<BookingData>
): Promise<{ data: BookingData[] | null; error: PostgrestError | null }> => {
  const { data, error } = await supabase.from('bookings').insert([newBooking]).select();
  if (error) {
    console.error(error);
    throw error;
  }
  return { data, error };
};

/** **************************************
 * Update an existing booking
 *************************************** */
export const updateBooking = async (
  bookingId: string,
  updatedFields: Partial<BookingData>
): Promise<{ data: BookingData[] | null; error: PostgrestError | null }> => {
  const { data, error } = await supabase
    .from('bookings')
    .update(updatedFields)
    .eq('id', bookingId)
    .select();
  if (error) {
    console.error(error);
    throw error;
  }
  return { data, error };
};

/** **************************************
 * Delete a booking
 *************************************** */
export const deleteBooking = async (
  bookingId: string
): Promise<{ error: PostgrestError | null }> => {
  const { error } = await supabase.from('bookings').delete().eq('id', bookingId);
  if (error) {
    console.error(error);
    throw error;
  }
  return { error };
};

/** **************************************
 * Get a single booking history by ID
 *************************************** */
export const getBookingHistoryById = async (
  bookingId: string
): Promise<{
  data: BookingHistoryData | null;
  error: PostgrestError | null;
}> => {
  const { data, error } = await supabase
    .from('bookings_history')
    .select('*')
    .eq('booking_id', bookingId)
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};

/** **************************************
 * Get a single booking review by ID
 *************************************** */
export const getBookingReviewById = async (
  bookingId: string
): Promise<{
  data: BookingReviewData | null;
  error: PostgrestError | null;
}> => {
  const { data, error } = await supabase
    .from('bookings_review')
    .select('*')
    .eq('booking_id', bookingId)
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};

/** **************************************
 * Get all providers
 *************************************** */
export const getProviders = async (): Promise<{
  data: ProviderData[] | null;
  error: PostgrestError | null;
}> => {
  const { data, error } = await supabase.from('providers').select('*');

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};

/** **************************************
 * Get a single provider by ID
 *************************************** */
export const getProviderById = async (
  userId: string
): Promise<{
  data: ProviderData | null;
  error: PostgrestError | null;
}> => {
  const { data, error } = await supabase.from('providers').select('*').eq('id', userId).single();

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};

/** **************************************
 * Insert a new provider
 *************************************** */
export const insertProvider = async (
  newUser: Partial<ProviderData>
): Promise<{ data: ProviderData[] | null; error: PostgrestError | null }> => {
  const { data, error } = await supabase.from('providers').insert([newUser]).select();
  if (error) {
    console.error(error);
    throw error;
  }
  return { data, error };
};

/** **************************************
 * Update an existing provider
 *************************************** */
export const updateProvider = async (
  userId: string,
  updatedFields: Partial<ProviderData>
): Promise<{ data: ProviderData[] | null; error: PostgrestError | null }> => {
  const { data, error } = await supabase
    .from('providers')
    .update(updatedFields)
    .eq('id', userId)
    .select();
  if (error) {
    console.error(error);
    throw error;
  }
  return { data, error };
};

/** **************************************
 * Delete a provider
 *************************************** */
export const deleteProvider = async (userId: string): Promise<{ error: PostgrestError | null }> => {
  const { error } = await supabase.from('providers').delete().eq('id', userId);
  if (error) {
    console.error(error);
    throw error;
  }
  return { error };
};

/** **************************************
 * Get all chauffeurs
 *************************************** */
export const getChauffeurs = async (
  providerId: string
): Promise<{
  data: ChauffeurData[] | null;
  error: PostgrestError | null;
}> => {
  const { data, error } = await supabase
    .from('chauffeurs')
    .select('*')
    .eq('provider_id', providerId);

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};

/** **************************************
 * Get a single chauffeur by ID
 *************************************** */
export const getChauffeurById = async (
  userId: string
): Promise<{
  data: ChauffeurData | null;
  error: PostgrestError | null;
}> => {
  const { data, error } = await supabase.from('chauffeurs').select('*').eq('id', userId).single();

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};

/** **************************************
 * Insert a new chauffeur
 *************************************** */
export const insertChauffeur = async (
  newUser: Partial<ChauffeurData>
): Promise<{ data: ChauffeurData[] | null; error: PostgrestError | null }> => {
  const { data, error } = await supabase.from('chauffeurs').insert([newUser]).select();
  if (error) {
    console.error(error);
    throw error;
  }
  return { data, error };
};

/** **************************************
 * Update an existing chauffeur
 *************************************** */
export const updateChauffeur = async (
  userId: string,
  updatedFields: Partial<ChauffeurData>
): Promise<{ data: ChauffeurData[] | null; error: PostgrestError | null }> => {
  const { data, error } = await supabase
    .from('chauffeurs')
    .update(updatedFields)
    .eq('id', userId)
    .select();
  if (error) {
    console.error(error);
    throw error;
  }
  return { data, error };
};

/** **************************************
 * Delete a chauffeur
 *************************************** */
export const deleteChauffeur = async (
  userId: string
): Promise<{ error: PostgrestError | null }> => {
  const { error } = await supabase.from('chauffeurs').delete().eq('id', userId);
  if (error) {
    console.error(error);
    throw error;
  }
  return { error };
};

/** **************************************
 * Get all vehicles
 *************************************** */
export const getVehicles = async (
  providerId: string
): Promise<{
  data: VehicleData[] | null;
  error: PostgrestError | null;
}> => {
  const { data, error } = await supabase.from('vehicles').select('*').eq('provider_id', providerId);

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};

/** **************************************
 * Get a single vehicle by ID
 *************************************** */
export const getVehicleById = async (
  vehicleId: string
): Promise<{
  data: VehicleData | null;
  error: PostgrestError | null;
}> => {
  const { data, error } = await supabase.from('vehicles').select('*').eq('id', vehicleId).single();

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};

/** **************************************
 * Insert a new vehicle
 *************************************** */
export const insertVehicle = async (
  newVehicle: Partial<VehicleData>
): Promise<{ data: VehicleData[] | null; error: PostgrestError | null }> => {
  const { data, error } = await supabase.from('vehicles').insert([newVehicle]).select();
  if (error) {
    console.error(error);
    throw error;
  }
  return { data, error };
};

/** **************************************
 * Update an existing vehicle
 *************************************** */
export const updateVehicle = async (
  vehicleId: string,
  updatedFields: Partial<VehicleData>
): Promise<{ data: VehicleData[] | null; error: PostgrestError | null }> => {
  const { data, error } = await supabase
    .from('vehicles')
    .update(updatedFields)
    .eq('id', vehicleId)
    .select();
  if (error) {
    console.error(error);
    throw error;
  }
  return { data, error };
};

/** **************************************
 * Delete a vehicle
 *************************************** */
export const deleteVehicle = async (
  vehicleId: string
): Promise<{ error: PostgrestError | null }> => {
  const { error } = await supabase.from('vehicles').delete().eq('id', vehicleId);
  if (error) {
    console.error(error);
    throw error;
  }
  return { error };
};

/** **************************************
 * Filter vehicles by license plate
 *************************************** */
export const filterVehiclesByLicensePlate = async (
  licensePlate: string
): Promise<{
  data: VehicleData | null;
  error: PostgrestError | null;
}> => {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('license_plate', licensePlate)
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};
