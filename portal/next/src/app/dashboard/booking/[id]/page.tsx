import type { IOrderItem } from 'src/types/order';

import { CONFIG } from 'src/config-global';
import { _orders } from 'src/_mock/_order';

import { OrderDetailsView } from 'src/sections/order/view'; // Ensure this points to the correct mock data

export const mockOrder: IOrderItem = {
  id: '1',
  orderNumber: 'ORD-001',
  date: new Date(),
  pickupLocation: '123 Main St, Cityville',
  dropoffLocation: '456 Elm St, Townsville',
  serviceClass: 'Standard',
  totalAmount: 100.0,
  status: 'offers', // change to 'offers', 'upcoming' or 'completed' to test other scenarios
  customer: {
    id: 'c1',
    name: 'John Doe',
  },
  specialRequests: 'Please handle with care.',
  history: {
    timeline: [
      {
        title: 'En route to the pickup location',
        time: new Date('2023-07-08T07:42:00').toISOString(),
      },
      { title: 'Pickup location reached', time: new Date('2023-07-08T08:29:00').toISOString() },
      { title: 'Ride in progress', time: new Date('2023-07-08T08:35:00').toISOString() },
      { title: 'Ride completed', time: new Date('2023-07-08T10:14:00').toISOString() },
    ],
  },
  distance: 15,
  // only show driver with completed
  // driver: {
  //   name: 'John Smith',
  //   carRegistration: 'XYZ 789'
  // }
};

export const metadata = { title: `Order details | Dashboard - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { id } = params;

  const currentOrder = id === mockOrder.id ? mockOrder : undefined;

  return <OrderDetailsView order={currentOrder} />;
}

const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';

export { dynamic };

export async function generateStaticParams() {
  if (CONFIG.isStaticExport) {
    return _orders.map((order) => ({ id: order.id }));
  }
  return [];
}
