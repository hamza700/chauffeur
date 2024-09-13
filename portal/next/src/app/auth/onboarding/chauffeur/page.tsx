import { CONFIG } from 'src/config-global';

import { OnboardingView } from 'src/sections/auth/onboardingChauffeurs/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Chauffeur Onboarding - ${CONFIG.site.name}` };

export default function Page() {
  return <OnboardingView />;
}
