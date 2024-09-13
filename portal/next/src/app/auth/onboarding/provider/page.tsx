import { CONFIG } from "src/config-global";

import { OnboardingView } from "src/sections/auth/onboardingProviders/view";

// ----------------------------------------------------------------------

export const metadata = { title: `Provider Onboarding - ${CONFIG.site.name}` };

export default function Page() {
  return <OnboardingView />;
}
