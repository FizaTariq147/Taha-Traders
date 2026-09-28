import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function Footer() {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: api.getSettings,
  });

  return (
    <footer className="border-t border-line bg-surface-dark text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-700">
            {settings?.businessNameEn ?? 'Taha Traders'}
          </p>
          <p className="mt-3 text-sm text-white/70">
            {settings?.tagline ?? 'Wholesale Dealer'}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/shop" className="hover:text-brand-bright">Shop</Link></li>
            <li><Link to="/categories" className="hover:text-brand-bright">Categories</Link></li>
            <li><Link to="/about" className="hover:text-brand-bright">About</Link></li>
            <li><Link to="/contact" className="hover:text-brand-bright">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {(settings?.phones ?? []).map((p) => (
              <li key={p}>
                <a href={`tel:${p.replace(/\D/g, '')}`} className="hover:text-white">{p}</a>
              </li>
            ))}
            {settings?.email ? (
              <li>
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </li>
            ) : (
              <li className="text-white/50">Email: Needs confirmation</li>
            )}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Location</p>
          <p className="mt-3 text-sm text-white/80">
            {settings?.address ?? 'Shop No. 14, Ganesh Mill Road, Faisalabad'}
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {settings?.businessNameEn ?? 'Taha Traders'}. Catalogue may include demo products.
      </div>
    </footer>
  );
}
