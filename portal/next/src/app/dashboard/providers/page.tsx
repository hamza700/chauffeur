import { CONFIG } from 'src/config-global';

import { ProviderListView } from 'src/sections/providers/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Providers list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <ProviderListView />;
}
