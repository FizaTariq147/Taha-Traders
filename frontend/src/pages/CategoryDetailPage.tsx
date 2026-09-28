import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { ProductCard } from '../components/ProductCard';

export function CategoryDetailPage() {
  const { slug = '' } = useParams();
  const { data: category } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => api.getCategory(slug),
    enabled: Boolean(slug),
  });
  const { data: products } = useQuery({
    queryKey: ['products', 'category', category?.id],
    queryFn: () => api.getProducts({ category: category!.id, limit: 24 }),
    enabled: Boolean(category?.id),
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl font-700">{category?.name ?? 'Category'}</h1>
      <p className="mt-2 text-muted">{category?.description}</p>
      {category?.isDemo && (
        <p className="mt-3 text-sm font-semibold text-demo">Demo category — not confirmed inventory</p>
      )}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(products?.items ?? []).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}
