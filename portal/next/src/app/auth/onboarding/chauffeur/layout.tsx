import { OnboardingLayout } from 'src/layouts/onboarding';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <OnboardingLayout>{children}</OnboardingLayout>;
}
