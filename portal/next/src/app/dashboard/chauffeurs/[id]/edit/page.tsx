import type { IUserItem } from 'src/types/user';

import { CONFIG } from 'src/config-global';

import { UserEditView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

const { assetURL } = CONFIG.site;

// Mock user data
const mockUser: IUserItem = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phoneNumber: '+447410450616',
  status: 'active',
  country: 'USA',
  isVerified: true,
  driversLicense: '123456',
  privateHireLicense: '654321',
  licensePlate: '12345',
  profilePicUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
  profilePicStatus: 'approved',
  driversLicenseUrls: [
    'https://randomuser.me/api/portraits/men/1.jpg',
    'https://randomuser.me/api/portraits/men/2.jpg',
  ],
  driversLicenseExpiryDate: '2024-01-01T00:00:00.000Z',
  driversLicenseStatus: 'approved',
  privateHireLicenseUrls: [
    'https://randomuser.me/api/portraits/men/1.jpg',
    'https://randomuser.me/api/portraits/men/2.jpg',
  ],
  privateHireLicenseExpiryDate: '2024-01-01T00:00:00.000Z',
  privateHireLicenseStatus: 'approved',
};

export const metadata = { title: `User edit | Dashboard - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { id } = params;

  const currentUser = id === mockUser.id ? mockUser : undefined;

  return <UserEditView user={currentUser} />;
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
    return [{ id: mockUser.id }];
  }
  return [];
}
