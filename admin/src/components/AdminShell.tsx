import type { ReactNode } from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tags,
  MessageSquare,
  Image,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../lib/api';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/categories', label: 'Categories', icon: Tags },
  { to: '/inquiries', label: 'Inquiries', icon: MessageSquare },
  { to: '/media', label: 'Media', icon: Image },
  { to: '/content', label: 'Content', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function RequireAuth({ children }: { children: ReactNode }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['me'],
    queryFn: adminApi.me,
    retry: false,
  });
  if (isLoading) return <div className="p-8 text-muted">Checking session…</div>;
  if (isError || !data?.user) return <Navigate to="/login" replace />;
  return children;
}

export function AdminShell() {
  const qc = useQueryClient();
  const logout = useMutation({
    mutationFn: adminApi.logout,
    onSuccess: () => {
      qc.clear();
      window.location.href = '/login';
    },
  });

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-line bg-white lg:border-b-0 lg:border-r">
        <div className="px-5 py-5">
          <p className="font-display text-xl font-700 text-brand">Taha Traders</p>
          <p className="text-xs text-muted">Admin panel</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col" aria-label="Admin">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap ${
                  isActive ? 'bg-brand text-white' : 'text-muted hover:bg-surface'
                }`
              }
            >
              <item.icon className="h-4 w-4" aria-hidden />
              {item.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={() => logout.mutate()}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-surface"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </nav>
      </aside>
      <main className="p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
