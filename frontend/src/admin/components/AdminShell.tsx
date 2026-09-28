import type { ReactNode } from 'react';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tags,
  MessageSquare,
  Image,
  FileText,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../lib/api';

const nav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { to: '/admin/media', label: 'Media', icon: Image },
  { to: '/admin/content', label: 'Content', icon: FileText },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function RequireAuth({ children }: { children: ReactNode }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['me'],
    queryFn: adminApi.me,
    retry: false,
  });
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070d18] text-white/70">
        Checking session…
      </div>
    );
  }
  if (isError || !data?.user) return <Navigate to="/admin/login" replace />;
  return children;
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const qc = useQueryClient();
  const logout = useMutation({
    mutationFn: adminApi.logout,
    onSuccess: () => {
      qc.clear();
      window.location.href = '/admin/login';
    },
  });

  return (
    <>
      <div className="admin-brand mb-8 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-bright/20 text-brand-bright">
            <Sparkles className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="font-display text-lg font-700 leading-none">Taha Traders</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/45">Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto" aria-label="Admin">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `admin-nav-item group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'active bg-gradient-to-r from-brand to-brand-bright text-white shadow-lg shadow-brand/30'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon className="h-4 w-4 shrink-0 transition group-hover:scale-110" aria-hidden />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => logout.mutate()}
        className="mt-4 inline-flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/55 transition hover:bg-white/5 hover:text-white"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </>
  );
}

export function AdminShell() {
  const location = useLocation();

  return (
    <div className="admin-shell relative min-h-screen bg-[#070d18] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="admin-orb admin-orb-a" />
        <div className="admin-orb admin-orb-b" />
        <div className="admin-grid-fade" />
      </div>

      {/* Fixed sticky sidebar (desktop) */}
      <aside className="admin-sidebar fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-[#0b1424]/95 p-4 backdrop-blur-xl lg:flex">
        <SidebarNav />
      </aside>

      <div className="relative min-h-screen lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070d18]/90 px-4 py-3 backdrop-blur-xl lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">Control center</p>
              <p className="font-display text-lg font-700 capitalize">
                {location.pathname.split('/').filter(Boolean).slice(-1)[0]?.replace(/-/g, ' ') ||
                  'Dashboard'}
              </p>
            </div>
            <a
              href="/"
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:border-brand-bright hover:text-white"
            >
              View storefront
            </a>
          </div>
          <nav
            className="mt-3 flex gap-1 overflow-x-auto pb-1 lg:hidden"
            aria-label="Admin mobile"
          >
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
                    isActive ? 'bg-brand-bright text-white' : 'bg-white/5 text-white/60'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="relative p-4 md:p-8">
          <div className="admin-stage animate-admin-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
