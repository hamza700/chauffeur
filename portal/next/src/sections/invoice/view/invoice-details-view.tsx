'use client';

import type { IInvoice } from 'src/types/invoice';

import { useState } from 'react';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useMockedUser } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard';

import { InvoiceDetails } from '../invoice-details';

// ----------------------------------------------------------------------

type Props = {
  invoice?: IInvoice;
};

export function InvoiceDetailsView({ invoice }: Props) {
  const [role, setRole] = useState('admin');

  const { user } = useMockedUser();

  return (
    <DashboardContent>
      <RoleBasedGuard hasContent currentRole={user?.role} acceptRoles={[role]} sx={{ py: 10 }}>
        <CustomBreadcrumbs
          heading={invoice?.invoiceNumber}
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Invoice', href: paths.dashboard.invoices.root },
            { name: invoice?.invoiceNumber },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <InvoiceDetails invoice={invoice} />
      </RoleBasedGuard>
    </DashboardContent>
  );
}
