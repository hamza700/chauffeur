"use client";

import type { Theme, SxProps, Breakpoint } from "@mui/material/styles";

import Alert from "@mui/material/Alert";

import { useBoolean } from "src/hooks/use-boolean";

import { CONFIG } from "src/config-global";
import { stylesMode } from "src/theme/styles";

import { Main } from "./main";
import { HeaderBase } from "../core/header-base";
import { LayoutSection } from "../core/layout-section";

// ----------------------------------------------------------------------

export type OnboardingLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
};

export function OnboardingLayout({ sx, children }: OnboardingLayoutProps) {
  const mobileNavOpen = useBoolean();

  const layoutQuery: Breakpoint = "md";

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderBase
          disableElevation
          layoutQuery={layoutQuery}
          onOpenNav={mobileNavOpen.onTrue}
          slotsDisplay={{
            signIn: false,
            purchase: false,
            contacts: false,
            searchbar: false,
            workspaces: false,
            menuButton: false,
            localization: false,
            notifications: false,
            helpLink: false,
            settings: false,
          }}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: "none", borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
          }}
          slotProps={{ container: { maxWidth: false } }}
          sx={{ position: { [layoutQuery]: "fixed" } }}
        />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{
        "--layout-onboarding-content-width": "900px", // Adjust width as needed
        "--layout-onboarding-content-height": "100vh", // Adjust height as needed,
      }}
      sx={{
        "&::before": {
          width: 1,
          height: 1,
          zIndex: 1,
          content: "''",
          opacity: 0.24,
          position: "fixed",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundImage: `url(${CONFIG.site.basePath}/assets/background/background-3-blur.webp)`,
          [stylesMode.dark]: { opacity: 0.08 },
        },
        ...sx,
      }}
    >
      <Main layoutQuery={layoutQuery}>{children}</Main>
    </LayoutSection>
  );
}
