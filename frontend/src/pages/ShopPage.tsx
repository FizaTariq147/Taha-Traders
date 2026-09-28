import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Filter, X } from 'lucide-react';
import { api } from '../lib/api';
import { ProductCard } from '../components/ProductCard';

export function ShopPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [availability, setAvailability] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  });

  const params = useMemo(
    () => ({
      search: search || undefined,
      category: category || undefined,
      availability: availability || undefined,
      color: color || undefined,
      size: size || undefined,
      sort,
      page,
      limit: 12,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    }),
    [search, category, availability, color, size, sort, page, minPrice, maxPrice],
  );

  const { data, isLoading } = useQuery({
    queryKey: ['products', 'shop', params],
    queryFn: () => api.getProducts(params),
  });

  const allColors = useMemo(() => {
    const set = new Set<string>();
    (data?.items ?? []).forEach((p) => p.colors?.forEach((c) => set.add(c)));
    return [...set];
  }, [data]);

  const allSizes = useMemo(() => {
    const set = new Set<string>();
    (data?.items ?? []).forEach((p) => p.sizes?.forEach((s) => set.add(s)));
    return [...set];
  }, [data]);

  const Filters = (
    <div className="space-y-4">
      <label className="block text-sm">
        <span className="font-medium">Search</span>
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="mt-1 w-full rounded-md border border-line px-3 py-2"
          placeholder="Name or SKU"
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium">Category</span>
        <select
          value={category}
          onChange={(e) => {
            setPage(1);
            setCategory(e.target.value);
          }}
          className="mt-1 w-full rounded-md border border-line px-3 py-2"
        >
          <option value="">All</option>
          {(categories ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="font-medium">Availability</span>
        <select
          value={availability}
          onChange={(e) => {
            setPage(1);
            setAvailability(e.target.value);
          }}
          className="mt-1 w-full rounded-md border border-line px-3 py-2"
        >
          <option value="">All</option>
          <option value="in_stock">In stock</option>
          <option value="inquiry_only">Inquiry only</option>
          <option value="made_to_order">Made to order</option>
          <option value="out_of_stock">Out of stock</option>
        </select>
      </label>
      {allColors.length > 0 && (
        <label className="block text-sm">
          <span className="font-medium">Color</span>
          <select
            value={color}
            onChange={(e) => {
              setPage(1);
              setColor(e.target.value);
            }}
            className="mt-1 w-full rounded-md border border-line px-3 py-2"
          >
            <option value="">All</option>
            {allColors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      )}
      {allSizes.length > 0 && (
        <label className="block text-sm">
          <span className="font-medium">Size</span>
          <select
            value={size}
            onChange={(e) => {
              setPage(1);
              setSize(e.target.value);
            }}
            className="mt-1 w-full rounded-md border border-line px-3 py-2"
          >
            <option value="">All</option>
            {allSizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      )}
      <div className="grid grid-cols-2 gap-2">
        <label className="block text-sm">
          <span className="font-medium">Min price</span>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => {
              setPage(1);
              setMinPrice(e.target.value);
            }}
            className="mt-1 w-full rounded-md border border-line px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Max price</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => {
              setPage(1);
              setMaxPrice(e.target.value);
            }}
            className="mt-1 w-full rounded-md border border-line px-3 py-2"
          />
        </label>
      </div>
    </div>
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-700">Shop</h1>
          <p className="mt-2 text-muted">Wholesale tailoring materials catalogue.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="ml-2 rounded-md border border-line px-3 py-2"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
              <option value="name">Name</option>
            </select>
          </label>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 lg:hidden"
            onClick={() => setFiltersOpen(true)}
          >
            <Filter className="h-4 w-4" /> Filters
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden rounded-lg border border-line bg-white p-4 lg:block">
          {Filters}
        </aside>

        <div>
          {isLoading && <p className="text-muted">Loading products…</p>}
          {!isLoading && (data?.items.length ?? 0) === 0 && (
            <p className="rounded-lg border border-dashed border-line p-8 text-center text-muted">
              No products match these filters.
            </p>
          )}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {(data?.items ?? []).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {(data?.pages ?? 1) > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-md border border-line px-4 py-2 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-muted">
                Page {data?.page} of {data?.pages}
              </span>
              <button
                type="button"
                disabled={page >= (data?.pages ?? 1)}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-md border border-line px-4 py-2 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-700">Filters</h2>
              <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            {Filters}
            <button
              type="button"
              className="mt-6 w-full rounded-md bg-brand py-3 text-sm font-semibold text-white"
              onClick={() => setFiltersOpen(false)}
            >
              Apply filters
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
