import { OnboardingLayout } from 'src/layouts/onboarding';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}
