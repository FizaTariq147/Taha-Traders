import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Package, MessageCircle, Store } from 'lucide-react';
import {
  api,
  buildWhatsAppUrl,
} from '../lib/api';
import { ProductCard } from '../components/ProductCard';
import { HeroVisual } from '../components/HeroVisual';
import { SmartImage } from '../components/SmartImage';

export function HomePage() {
  const { data: content } = useQuery({ queryKey: ['content'], queryFn: api.getContent });
  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: api.getSettings });
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: api.getCategories });
  const { data: featured } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => api.getProducts({ featured: 'true', limit: 8 }),
  });
  const { data: arrivals } = useQuery({
    queryKey: ['products', 'new'],
    queryFn: () => api.getProducts({ newArrival: 'true', limit: 8 }),
  });

  const wa = settings
    ? buildWhatsAppUrl(
        settings.whatsappNumber,
        'Hello, I would like to place a wholesale inquiry with Taha Traders.',
      )
    : '#';

  return (
    <main>
      {content?.promoBanner && (
        <div className="bg-demo px-4 py-2 text-center text-sm font-medium text-white">
          {content.promoBanner}
        </div>
      )}

      <section className="relative overflow-hidden bg-surface-dark text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(30,107,255,0.35),_transparent_55%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 md:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-bright">
              Wholesale Dealer
            </p>
            <h1 className="mt-3 font-display text-4xl font-800 tracking-tight md:text-6xl">
              {content?.heroTitle ?? 'Taha Traders'}
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/75 md:text-lg">
              {content?.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-md bg-brand-bright px-5 py-3 text-sm font-semibold text-white"
              >
                {content?.heroCtaPrimary ?? 'Shop catalogue'}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                {content?.heroCtaSecondary ?? 'WhatsApp inquiry'}
              </a>
            </div>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-black/30 shadow-2xl lg:aspect-square">
            <HeroVisual
              imageUrl={
                content?.heroImageUrl ?? 'https://picsum.photos/seed/taha-hero/1400/900'
              }
              modelUrl={content?.heroModelUrl || undefined}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-700">Shop by category</h2>
            <p className="mt-2 text-muted">Browse wholesale material groups.</p>
          </div>
          <Link to="/categories" className="text-sm font-semibold text-brand hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {(categories ?? []).map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className="group overflow-hidden rounded-lg border border-line bg-white transition hover:border-brand/40"
            >
              <div className="aspect-[5/4] bg-surface">
                <SmartImage
                  src={cat.imageUrl}
                  fallback="https://picsum.photos/seed/taha-threads/800/640"
                  alt={cat.name}
                  className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-3">
                <p className="font-semibold text-ink">{cat.name}</p>
                {cat.isDemo && <p className="text-xs text-demo">Demo category</p>}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="font-display text-3xl font-700">Featured products</h2>
          <p className="mt-2 text-muted">Highlighted items from the catalogue.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(featured?.items ?? []).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 md:px-6 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-xl border border-line bg-surface-dark">
          <HeroVisual
            imageUrl="https://picsum.photos/seed/taha-showcase/900/900"
            modelUrl={content?.heroModelUrl || undefined}
          />
        </div>
        <div>
          <h2 className="font-display text-3xl font-700">Material showcase</h2>
          <p className="mt-3 text-muted">
            Explore product details, colours, and sizes — then inquire on WhatsApp with your selection.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white"
          >
            Browse products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="font-display text-3xl font-700">New arrivals</h2>
          <p className="mt-2 text-muted">Recently added catalogue items.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(arrivals?.items ?? []).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-2 md:px-6">
        <div>
          <h2 className="font-display text-3xl font-700">
            {content?.aboutTitle ?? 'About Taha Traders'}
          </h2>
          <p className="mt-4 whitespace-pre-line text-muted">{content?.aboutBody}</p>
          <Link to="/about" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
            Read more <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-line">
          <SmartImage
            src={content?.aboutImageUrl}
            fallback="https://picsum.photos/seed/taha-about/1200/800"
            alt="About Taha Traders"
            className="h-full min-h-64 w-full object-cover"
          />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="font-display text-3xl font-700">Why choose us</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {(content?.whyChooseUs ?? []).map((item, i) => {
              const Icon = [Store, Package, MessageCircle][i % 3];
              return (
                <div key={item.title} className="rounded-lg border border-line p-6">
                  <Icon className="h-6 w-6 text-brand" aria-hidden />
                  <h3 className="mt-4 font-display text-xl font-700">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-brand px-4 py-14 text-center text-white md:px-6">
        <h2 className="font-display text-3xl font-700">Order on WhatsApp</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/80">
          Share the product, size, and colour you need. We will confirm availability and pricing.
        </p>
        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-brand"
        >
          <MessageCircle className="h-4 w-4" />
          Start WhatsApp chat
        </a>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h2 className="font-display text-3xl font-700">Visit us</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-3 text-muted">
            <p>{settings?.address}</p>
            <ul className="space-y-1">
              {(settings?.phones ?? []).map((p) => (
                <li key={p}>
                  <a className="text-brand hover:underline" href={`tel:${p.replace(/\D/g, '')}`}>
                    {p}
                  </a>
                </li>
              ))}
            </ul>
            {!settings?.businessHours && (
              <p className="text-sm text-demo">Business hours: Needs confirmation</p>
            )}
            <Link to="/contact" className="inline-block text-sm font-semibold text-brand">
              Contact page
            </Link>
          </div>
          <div className="min-h-64 overflow-hidden rounded-xl border border-line bg-surface">
            {settings?.mapUrl ? (
              <iframe
                title="Taha Traders location"
                src={settings.mapUrl}
                className="h-full min-h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex h-full min-h-64 items-center justify-center p-6 text-center text-sm text-muted">
                Google Maps embed URL needs confirmation in Admin Settings.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
