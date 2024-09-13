import { OnboardingLayout } from 'src/layouts/onboarding';

import { OnboardGuard } from 'src/auth/guard/onboard-guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <OnboardGuard>
      <OnboardingLayout>{children}</OnboardingLayout>
    </OnboardGuard>
  );
}
