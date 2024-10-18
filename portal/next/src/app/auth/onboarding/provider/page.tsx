import { CONFIG } from "src/config-global";

import { OnboardingViewProviders } from "src/sections/auth/onboardingProviders/view";

// ----------------------------------------------------------------------

export const metadata = { title: `Provider Onboarding - ${CONFIG.site.name}` };

export default function Page() {
  return <OnboardingViewProviders />;
}
