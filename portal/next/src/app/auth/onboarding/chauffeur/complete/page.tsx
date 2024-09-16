import { CONFIG } from 'src/config-global';

import { OnboardingComplete } from 'src/sections/auth/onboardingChauffeurs/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Chauffeur Onboarding - ${CONFIG.site.name}` };

export default function Page() {
  return <OnboardingComplete />;
}
