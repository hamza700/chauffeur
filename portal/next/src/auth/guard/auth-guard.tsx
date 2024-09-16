'use client';

import { useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

type Props = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, authenticated } = useAuthContext();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // If still loading, don't perform any redirects yet
    if (loading) return;

    // If user is authenticated, check their onboarding status
    if (authenticated) {
      const role = user?.user_metadata?.role;
      const isOnboarded = user?.user_metadata?.onboarded;

      // Redirect based on onboarding status
      if (role === 'provider') {
        if (!isOnboarded) {
          router.replace(paths.auth.onboarding.provider); // Redirect to provider onboarding
        } else if (!pathname.startsWith(paths.dashboard.root)) {
          router.replace(paths.dashboard.root); 
        }
      } else if (role === 'chauffeur') {
        if (!isOnboarded) {
          router.replace(paths.auth.onboarding.chauffeur.root); // Redirect to chauffeur onboarding
        } else {
          router.replace(paths.auth.onboarding.chauffeur.complete);
        }
      }
      setIsChecking(false); // User is onboarded, no more checks
    } else {
      // If user is not authenticated, redirect to sign-in
      router.replace(`${paths.auth.supabase.signIn}?returnTo=${pathname}`);
    }
  }, [authenticated, loading, user, router, pathname]);

  if (loading || isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}