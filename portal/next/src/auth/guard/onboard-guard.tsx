'use client';

import { useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

type Props = {
  children: React.ReactNode;
};

export function OnboardGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, authenticated } = useAuthContext();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = () => {
      if (loading) return;

      if (authenticated) {
        const role = user?.user_metadata?.role;
        const isOnboarded = user?.user_metadata?.onboarded;

        // Redirect based on onboarding status
        if (role === 'provider' && isOnboarded) {
          router.replace(paths.dashboard.root);
        } else if (role === 'chauffeur' && isOnboarded) {
          router.replace(paths.dashboard.root);
        } else {
          // User is authenticated but not onboarded, allow onboarding page to render
          setIsChecking(false);
        }
      } else {
        // If not authenticated, redirect to sign-in
        router.replace(`${paths.auth.supabase.signIn}?returnTo=${pathname}`);
      }
    };

    checkOnboardingStatus();
  }, [authenticated, loading, user, router, pathname]);

  if (loading || isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
