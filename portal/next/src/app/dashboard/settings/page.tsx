import type { IProviderAccount } from 'src/types/provider';

import { CONFIG } from 'src/config-global';

import { AccountView } from 'src/sections/account/view';

const mockProvider: IProviderAccount = {
  id: '1',
  city: 'New York',
  state: 'NY',
  address: '123 Main St',
  postCode: '10001',
  isVerified: true,
  formCompleted: true,
  phoneNumber: '+123456789',
  country: 'USA',
  companyName: 'Doe Inc.',
  companyRegistrationNumber: '123456',
  taxIdentificationNumber: '654321',
  vatNumber: 'GB123456',
  status: 'active',
  companyPrivateHireOperatorLicenseUrls: ['https://example.com/license1.jpg'],
  companyPrivateHireOperatorLicenseExpiryDate: '2024-01-01T00:00:00.000Z',
  companyPrivateHireOperatorLicenseStatus: 'approved',
  personalIDorPassportUrls: ['https://example.com/id1.jpg'],
  personalIDorPassportExpiryDate: '2024-01-01T00:00:00.000Z',
  personalIDorPassportStatus: 'approved',
  vatRegistrationCertificateUrls: ['https://example.com/vat1.jpg'],
  vatRegistrationCertificateExpiryDate: '2024-01-01T00:00:00.000Z',
  vatRegistrationCertificateStatus: 'approved',
};

// ----------------------------------------------------------------------

export const metadata = { title: `Account settings | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const currentProvider = mockProvider;

  return <AccountView provider={currentProvider} />;
}
