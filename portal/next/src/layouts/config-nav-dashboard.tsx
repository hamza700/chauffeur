import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  car: icon('ic-car'),
  money: icon('ic-money'),
  settings: icon('ic-settings'),
  providers: icon('ic-providers'),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'Overview',
    items: [
      { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
      {
        title: 'Bookings',
        path: paths.dashboard.bookings.root,
        icon: ICONS.money,
        info: (
          <Label
            color="info"
            variant="inverted"
            startIcon={<Iconify icon="solar:bell-bing-bold-duotone" />}
          >
            NEW
          </Label>
        ),
      },
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'Management',
    items: [
      {
        title: 'Chauffeurs',
        path: paths.dashboard.chauffeurs.root,
        icon: ICONS.user,
        children: [
          { title: 'List', path: paths.dashboard.chauffeurs.root },
          { title: 'Create', path: paths.dashboard.chauffeurs.new },
        ],
      },
      {
        title: 'Vehicles',
        path: paths.dashboard.vehicles.root,
        icon: ICONS.car,
        children: [
          { title: 'List', path: paths.dashboard.vehicles.root },
          { title: 'Create', path: paths.dashboard.vehicles.new },
        ],
      },
      {
        title: 'Providers',
        path: paths.dashboard.providers,
        icon: ICONS.providers,
        roles: ['admin'],
      },
      {
        title: 'Invoice',
        path: paths.dashboard.invoices.root,
        icon: ICONS.invoice,
        roles: ['admin'],
      },
      {
        title: 'Documents',
        path: paths.dashboard.documents.root,
        icon: ICONS.file,
        roles: ['admin'],
      },
      { title: 'Account Settings', path: paths.dashboard.settings, icon: ICONS.settings },
    ],
  },
];
