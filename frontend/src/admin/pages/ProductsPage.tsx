import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { adminApi } from '../lib/api';

export function ProductsPage() {
  const qc = useQueryClient();
  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: adminApi.products,
  });
  const remove = useMutation({
    mutationFn: (id: string) => adminApi.deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-700">Products</h1>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> New product
        </Link>
      </div>
      {isLoading && <p className="mt-6 text-muted">Loading…</p>}
      <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-surface text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((p) => (
              <tr key={String(p.id)} className="border-b border-line/70">
                <td className="px-4 py-3">
                  <div className="font-medium">{String(p.name)}</div>
                  {p.isDemo ? <span className="text-xs text-demo">Demo</span> : null}
                </td>
                <td className="px-4 py-3">{String(p.sku)}</td>
                <td className="px-4 py-3">Rs {Number(p.price).toLocaleString()}</td>
                <td className="px-4 py-3">{p.active ? 'Active' : 'Inactive'}</td>
                <td className="px-4 py-3 space-x-3">
                  <Link to={`/admin/products/${p.id}`} className="text-brand hover:underline">
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="text-red-700 hover:underline"
                    onClick={() => {
                      if (confirm('Deactivate this product?')) remove.mutate(String(p.id));
                    }}
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
