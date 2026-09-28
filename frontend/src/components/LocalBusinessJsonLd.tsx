import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function LocalBusinessJsonLd() {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: api.getSettings,
  });

  if (!settings) return null;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.businessNameEn,
    description: settings.tagline,
    telephone: settings.phones,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: 'Faisalabad',
      addressCountry: 'PK',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
