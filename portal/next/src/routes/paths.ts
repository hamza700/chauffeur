import { paramCase } from 'src/utils/change-case';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneStore: 'https://mui.com/store/items/zone-landing-page/',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figma: 'https://www.figma.com/design/cAPz4pYPtQEXivqe11EcDE/%5BPreview%5D-Minimal-Web.v6.0.0',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id: string) => `/product/${id}`,
    demo: { details: `/product/${MOCK_ID}` },
  },
  post: {
    root: `/post`,
    details: (title: string) => `/post/${paramCase(title)}`,
    demo: { details: `/post/${paramCase(MOCK_TITLE)}` },
  },
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
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
        root:  `${ROOTS.AUTH}/onboarding/chauffeur`,
        complete: `${ROOTS.AUTH}/onboarding/chauffeur/complete`,
      },
    },
  },
  authDemo: {
    split: {
      signIn: `${ROOTS.AUTH_DEMO}/split/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/split/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/split/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/split/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/split/verify`,
    },
    centered: {
      signIn: `${ROOTS.AUTH_DEMO}/centered/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/centered/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/centered/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/centered/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/centered/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    settings: `${ROOTS.DASHBOARD}/settings`,
    providers: `${ROOTS.DASHBOARD}/providers`,
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
