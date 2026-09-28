import { useQuery } from '@tanstack/react-query';
import {
  Package,
  CheckCircle2,
  Tags,
  MessageSquare,
  Clock3,
  ShoppingBag,
  AlertTriangle,
} from 'lucide-react';
import { adminApi } from '../lib/api';

const cards = [
  { label: 'Total products', key: 'totalProducts', icon: Package },
  { label: 'Active products', key: 'activeProducts', icon: CheckCircle2 },
  { label: 'Categories', key: 'categories', icon: Tags },
  { label: 'New inquiries', key: 'newInquiries', icon: MessageSquare },
  { label: 'Pending inquiries', key: 'pendingInquiries', icon: Clock3 },
  { label: 'Orders (future)', key: 'orders', icon: ShoppingBag },
  { label: 'Low stock', key: 'lowStockProducts', icon: AlertTriangle },
];

export function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: adminApi.dashboard,
  });

  return (
    <div>
      <div className="admin-card mb-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <h1 className="font-display text-3xl font-700">Dashboard</h1>
        <p className="mt-2 text-sm text-white/55">
          Overview of catalogue health and inquiry activity.
        </p>
        {data?.isDemoStats ? (
          <p className="mt-3 inline-flex rounded-lg bg-amber-500/15 px-3 py-1.5 text-sm text-amber-200">
            Demo statistics from current database — not production KPIs.
          </p>
        ) : null}
      </div>

      {isLoading && <p className="text-white/50">Loading…</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c, index) => {
          const Icon = c.icon;
          return (
            <div
              key={c.key}
              className="admin-stat-card group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-white/55">{c.label}</p>
                <span className="rounded-lg bg-brand-bright/15 p-2 text-brand-bright transition group-hover:scale-110">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
              </div>
              <p className="mt-4 font-display text-3xl font-700 tracking-tight text-white">
                {String(data?.[c.key] ?? '—')}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
