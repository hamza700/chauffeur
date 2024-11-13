import { CONFIG } from 'src/config-global';
import { _orders } from 'src/_mock/_order';

import { OrderDetailsView } from 'src/sections/order/view'; // Ensure this points to the correct mock data

export const metadata = { title: `Order details | Dashboard - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { id } = params;

  return <OrderDetailsView id={id} />;
}

const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';

export { dynamic };

export async function generateStaticParams() {
  if (CONFIG.isStaticExport) {
    return _orders.map((order) => ({ id: order.id }));
  }
  return [];
}
