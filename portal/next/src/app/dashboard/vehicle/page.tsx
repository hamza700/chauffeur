import { CONFIG } from 'src/config-global';

import { VehicleListView } from 'src/sections/vehicle/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Vehicle list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <VehicleListView />;
}
