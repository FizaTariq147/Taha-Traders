import { Link, NavLink } from 'react-router-dom';
import { Menu, MessageCircle, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api, buildWhatsAppUrl } from '../lib/api';
import { useUiStore } from '../store/ui';

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/categories', label: 'Categories' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Header() {
  const { mobileNavOpen, setMobileNavOpen } = useUiStore();
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: api.getSettings,
  });

  const wa = settings
    ? buildWhatsAppUrl(
        settings.whatsappNumber,
        'Hello, I would like to inquire about your wholesale catalogue.',
      )
    : '#';

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link to="/" className="min-w-0" onClick={() => setMobileNavOpen(false)}>
          <span className="font-display text-xl font-800 tracking-tight text-brand md:text-2xl">
            {settings?.businessNameEn ?? 'Taha Traders'}
          </span>
          <span className="mt-0.5 block text-xs font-medium text-muted">
            {settings?.tagline ?? 'Wholesale Dealer'}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-brand' : 'text-muted hover:text-ink'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-md bg-[#25D366] px-3 py-2 text-sm font-semibold text-white sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp
          </a>
          <Link
            to="/shop"
            className="rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-bright"
          >
            Shop
          </Link>
          <button
            type="button"
            className="inline-flex rounded-md border border-line p-2 lg:hidden"
            aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileNavOpen && (
        <nav
          className="border-t border-line bg-white px-4 py-4 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-3">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  onClick={() => setMobileNavOpen(false)}
                  className={({ isActive }) =>
                    `block py-1 text-base font-medium ${isActive ? 'text-brand' : 'text-ink'}`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li>
              <a href={wa} target="_blank" rel="noreferrer" className="text-base font-medium text-[#128C7E]">
                WhatsApp inquiry
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
