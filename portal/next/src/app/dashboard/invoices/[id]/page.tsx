import type { IInvoice } from 'src/types/invoice';

import { CONFIG } from 'src/config-global';

import { InvoiceDetailsView } from 'src/sections/invoice/view';

export const _invoices: IInvoice[] = [
  {
    id: '1',
    status: 'paid',
    totalAmount: 500,
    invoiceNumber: 'INV-001',
    items: [
      {
        id: 'item1',
        bookingNumber: 'BN123',
        date: '2023-01-01',
        driver: 'John Doe',
        pickupLocation: 'Location A',
        destination: 'Location B',
        total: 100,
      },
      {
        id: 'item2',
        bookingNumber: 'BN124',
        date: '2023-01-02',
        driver: 'Jane Smith',
        pickupLocation: 'Location C',
        destination: 'Location D',
        total: 200,
      },
      {
        id: 'item3',
        bookingNumber: 'BN125',
        date: '2023-01-03',
        driver: 'Robert Brown',
        pickupLocation: 'Location E',
        destination: 'Location F',
        total: 200,
      },
    ],
    invoiceTo: {
      name: 'Company ABC',
      company: 'Company ABC',
      fullAddress: '123 Street, City, Country',
      phoneNumber: '123456789',
    },
    invoiceFrom: {
      name: 'Company XYZ',
      company: 'Company ABC',
      fullAddress: '456 Avenue, City, Country',
      phoneNumber: '987654321',
    },
    createDate: '2023-01-01',
    dueDate: '2023-02-01',
  },
];

// ----------------------------------------------------------------------

export const metadata = { title: `Invoice details | Dashboard - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { id } = params;

  const currentInvoice = _invoices.find((invoice) => invoice.id === id);

  return <InvoiceDetailsView invoice={currentInvoice} />;
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
    return _invoices.map((invoice) => ({ id: invoice.id }));
  }
  return [];
}
