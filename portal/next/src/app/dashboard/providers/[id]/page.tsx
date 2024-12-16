import { CONFIG } from 'src/config-global';

import { ProviderDetailsView } from 'src/sections/providers/view/provider-details-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Provider details | Dashboard - ${CONFIG.site.name}` };

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params }: Props) {
  const { id } = params;

  return <ProviderDetailsView providerId={id} />;
}
