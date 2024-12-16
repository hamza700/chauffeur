const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  root: ROOTS.DASHBOARD,
  // AUTH
  auth: {
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
    onboarding: {
      provider: `${ROOTS.AUTH}/onboarding/provider`,
      chauffeur: {
        root: `${ROOTS.AUTH}/onboarding/chauffeur`,
        complete: `${ROOTS.AUTH}/onboarding/chauffeur/complete`,
      },
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    settings: `${ROOTS.DASHBOARD}/settings`,
    bookings: {
      root: `${ROOTS.DASHBOARD}/bookings`,
      details: (id: string) => `${ROOTS.DASHBOARD}/bookings/${id}`,
      availableJob: (id: string) => `${ROOTS.DASHBOARD}/bookings/available-job/${id}`,
    },
    chauffeurs: {
      root: `${ROOTS.DASHBOARD}/chauffeurs`,
      new: `${ROOTS.DASHBOARD}/chauffeurs/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/chauffeurs/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/chauffeurs/${id}/edit`,
    },
    vehicles: {
      root: `${ROOTS.DASHBOARD}/vehicles`,
      new: `${ROOTS.DASHBOARD}/vehicles/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/vehicles/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/vehicles/${id}/edit`,
    },
    providers: {
      root: `${ROOTS.DASHBOARD}/providers`,
      details: (id: string) => `${ROOTS.DASHBOARD}/providers/${id}`,
    },
    invoices: {
      root: `${ROOTS.DASHBOARD}/invoices`,
      details: (id: string) => `${ROOTS.DASHBOARD}/invoices/${id}`,
    },
    documents: {
      root: `${ROOTS.DASHBOARD}/documents`,
      chauffeurs: `${ROOTS.DASHBOARD}/documents/chauffeurs`,
      vehicles: `${ROOTS.DASHBOARD}/documents/vehicles`,
      chauffeurDetails: (id: string) => `${ROOTS.DASHBOARD}/documents/chauffeurs/${id}`,
      vehicleDetails: (id: string) => `${ROOTS.DASHBOARD}/documents/vehicles/${id}`,
    },
  },
};
