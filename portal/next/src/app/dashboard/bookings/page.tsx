import { CONFIG } from 'src/config-global';

import { OrderListView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Booking | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <OrderListView />;
}
