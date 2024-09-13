import type { IVehicleItem } from 'src/types/vehicle';

import { CONFIG } from 'src/config-global';

import { VehicleEditView } from 'src/sections/vehicle/view';

// ----------------------------------------------------------------------

const { assetURL } = CONFIG.site;

// Mock vehicle data
const mockVehicle: IVehicleItem = {
  id: '1',
  licensePlate: 'AB123CD',
  model: 'Audi A6',
  colour: 'Black',
  productionYear: '2022',
  serviceClass: 'Business',
  status: 'active',
  privateHireLicenseUrls: [
    'https://example.com/private-hire-license1.jpg',
    'https://example.com/private-hire-license2.jpg',
  ],
  privateHireLicenseExpiryDate: '2024-01-01T00:00:00.000Z',
  privateHireLicenseStatus: 'approved',
  motTestCertificateUrls: [
    'https://example.com/mot-test-certificate1.jpg',
    'https://example.com/mot-test-certificate2.jpg',
  ],
  motTestCertificateExpiryDate: '2024-01-01T00:00:00.000Z',
  motTestCertificateStatus: 'approved',
  vehiclePicUrl: 'https://example.com/vehicle-pic.jpg',
  vehiclePicStatus: 'approved',
  vehicleInsuranceUrls: [
    'https://example.com/vehicle-insurance1.jpg',
    'https://example.com/vehicle-insurance2.jpg',
  ],
  vehicleInsuranceExpiryDate: '2024-01-01T00:00:00.000Z',
  vehicleInsuranceStatus: 'approved',
  vehicleRegistrationUrls: [
    'https://example.com/vehicle-registration1.jpg',
    'https://example.com/vehicle-registration2.jpg',
  ],
  vehicleRegistrationStatus: 'approved',
  leasingContractUrls: [
    'https://example.com/leasing-contract1.jpg',
    'https://example.com/leasing-contract2.jpg',
  ],
  leasingContractStatus: 'approved',
};

export const metadata = { title: `Vehicle edit | Dashboard - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { id } = params;

  const currentVehicle = id === mockVehicle.id ? mockVehicle : undefined;

  return <VehicleEditView vehicle={currentVehicle} />;
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
    return [{ id: mockVehicle.id }];
  }
  return [];
}
