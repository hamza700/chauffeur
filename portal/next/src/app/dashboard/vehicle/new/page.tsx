import { CONFIG } from 'src/config-global';

import { VehicleCreateView } from 'src/sections/vehicle/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new vehicle | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <VehicleCreateView />;
}
