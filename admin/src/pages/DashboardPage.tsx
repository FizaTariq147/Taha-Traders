import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../lib/api';

export function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: adminApi.dashboard,
  });

  const cards = [
    { label: 'Total products', key: 'totalProducts' },
    { label: 'Active products', key: 'activeProducts' },
    { label: 'Categories', key: 'categories' },
    { label: 'New inquiries', key: 'newInquiries' },
    { label: 'Pending inquiries', key: 'pendingInquiries' },
    { label: 'Orders (future)', key: 'orders' },
    { label: 'Low stock', key: 'lowStockProducts' },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-700">Dashboard</h1>
      {data?.isDemoStats ? (
        <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-sm text-demo">
          Demo statistics from current database — not production KPIs.
        </p>
      ) : null}
      {isLoading && <p className="mt-6 text-muted">Loading…</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.key} className="rounded-xl border border-line bg-white p-5">
            <p className="text-sm text-muted">{c.label}</p>
            <p className="mt-2 font-display text-3xl font-700 text-brand">
              {String(data?.[c.key] ?? '—')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
