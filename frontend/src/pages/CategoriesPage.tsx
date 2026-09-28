import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { SmartImage } from '../components/SmartImage';

export function CategoriesPage() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl font-700">Categories</h1>
      <p className="mt-2 text-muted">Dynamic wholesale material categories.</p>
      {isLoading && <p className="mt-8 text-muted">Loading…</p>}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(categories ?? []).map((cat) => (
          <Link
            key={cat.id}
            to={`/categories/${cat.slug}`}
            className="overflow-hidden rounded-xl border border-line bg-white transition hover:border-brand/40"
          >
            <div className="aspect-[16/10] bg-surface">
              <SmartImage
                src={cat.imageUrl}
                alt={cat.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-5">
              <h2 className="font-display text-xl font-700">{cat.name}</h2>
              <p className="mt-2 text-sm text-muted">{cat.description}</p>
              {cat.isDemo && (
                <p className="mt-2 text-xs font-semibold text-demo">Demo category</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
