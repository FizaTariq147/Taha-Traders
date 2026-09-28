import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { SmartImage } from '../components/SmartImage';

export function AboutPage() {
  const { data: content } = useQuery({ queryKey: ['content'], queryFn: api.getContent });
  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: api.getSettings });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl font-700">
        {content?.aboutTitle ?? 'About Taha Traders'}
      </h1>
      <p className="mt-2 text-muted">{settings?.tagline ?? 'Wholesale Dealer'}</p>
      <div className="mt-8 overflow-hidden rounded-xl border border-line">
        <SmartImage
          src={content?.aboutImageUrl}
          fallback="https://picsum.photos/seed/taha-about/1200/800"
          alt="Taha Traders"
          className="max-h-96 w-full object-cover"
        />
      </div>
      <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-muted">
        {content?.aboutBody}
      </p>
      <dl className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-line p-4">
          <dt className="text-sm text-muted">Proprietor</dt>
          <dd className="mt-1 font-semibold">{settings?.proprietor}</dd>
        </div>
        <div className="rounded-lg border border-line p-4">
          <dt className="text-sm text-muted">Contact person</dt>
          <dd className="mt-1 font-semibold">{settings?.contactPerson}</dd>
        </div>
        <div className="rounded-lg border border-line p-4 sm:col-span-2">
          <dt className="text-sm text-muted">Address</dt>
          <dd className="mt-1 font-semibold">{settings?.address}</dd>
        </div>
      </dl>
    </main>
  );
}
