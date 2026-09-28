import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../lib/api';

const statuses = ['new', 'contacted', 'confirmed', 'processing', 'completed', 'cancelled'];

export function InquiriesPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-inquiries'],
    queryFn: adminApi.inquiries,
  });
  const update = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminApi.updateInquiryStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-inquiries'] }),
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-700">Inquiries</h1>
      <p className="mt-2 text-sm text-muted">WhatsApp and form product inquiries.</p>
      {isLoading && <p className="mt-6 text-muted">Loading…</p>}
      <div className="mt-6 space-y-4">
        {(data ?? []).map((item) => (
          <article key={String(item.id)} className="rounded-xl border border-line bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{String(item.customerName)}</h2>
                <p className="text-sm text-muted">{String(item.phone)}</p>
                <p className="mt-2 text-sm">{String(item.productName ?? 'General inquiry')}</p>
                <p className="mt-1 text-sm text-muted">
                  {[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`, `Qty: ${item.quantity}`]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
                <p className="mt-3 whitespace-pre-line text-sm">{String(item.message)}</p>
              </div>
              <label className="text-sm">
                Status
                <select
                  className="ml-2 rounded-md border border-line px-2 py-1"
                  value={String(item.status)}
                  onChange={(e) => update.mutate({ id: String(item.id), status: e.target.value })}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>
          </article>
        ))}
        {!isLoading && (data?.length ?? 0) === 0 && (
          <p className="text-muted">No inquiries yet.</p>
        )}
      </div>
    </div>
  );
}
