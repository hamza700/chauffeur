import type { IVehicleItem } from 'src/types/vehicle';

import { CONFIG } from 'src/config-global';

import { VehicleEditView } from 'src/sections/vehicle/view';

// ----------------------------------------------------------------------

const { assetURL } = CONFIG.site;

export const metadata = { title: `Vehicle edit | Dashboard - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { id } = params;


  return <VehicleEditView vehicleId={id} />;
}

// ----------------------------------------------------------------------

/**
 * [1] Default
 * Remove [1] and [2] if not using [2]
 */
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';

export { dynamic };

/**
 * [2] Static exports
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 */
export async function generateStaticParams() {
  if (CONFIG.isStaticExport) {
    return [{ id: '1' }];
  }
  return [];
}
