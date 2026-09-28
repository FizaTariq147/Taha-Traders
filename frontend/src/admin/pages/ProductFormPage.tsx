import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../lib/api';

const empty = {
  name: '',
  description: '',
  sku: '',
  brand: '',
  categoryId: '',
  price: 0,
  salePrice: undefined as number | undefined,
  sizes: '' as string,
  colors: '' as string,
  availability: 'inquiry_only',
  featured: false,
  newArrival: false,
  active: true,
  isDemo: true,
  images: [] as { url: string; alt?: string; isPrimary?: boolean }[],
  modelUrl: '',
  variants: [] as { size?: string; color?: string; stock: number; active: boolean; sku?: string }[],
};

export function ProductFormPage() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);
  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: adminApi.categories,
  });
  const { data: existing } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: () => adminApi.product(id!),
    enabled: !isNew,
  });

  useEffect(() => {
    if (!existing) return;
    setForm({
      name: String(existing.name ?? ''),
      description: String(existing.description ?? ''),
      sku: String(existing.sku ?? ''),
      brand: String(existing.brand ?? ''),
      categoryId: String(existing.categoryId ?? ''),
      price: Number(existing.price ?? 0),
      salePrice: existing.salePrice != null ? Number(existing.salePrice) : undefined,
      sizes: Array.isArray(existing.sizes) ? existing.sizes.join(', ') : '',
      colors: Array.isArray(existing.colors) ? existing.colors.join(', ') : '',
      availability: String(existing.availability ?? 'inquiry_only'),
      featured: Boolean(existing.featured),
      newArrival: Boolean(existing.newArrival),
      active: Boolean(existing.active),
      isDemo: Boolean(existing.isDemo),
      images: (existing.images as typeof empty.images) ?? [],
      modelUrl: String(existing.modelUrl ?? ''),
      variants: (existing.variants as typeof empty.variants) ?? [],
    });
  }, [existing]);

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        description: form.description,
        sku: form.sku,
        brand: form.brand || undefined,
        categoryId: form.categoryId,
        price: Number(form.price),
        salePrice: form.salePrice != null && form.salePrice !== undefined ? Number(form.salePrice) : undefined,
        sizes: form.sizes
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        colors: form.colors
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        availability: form.availability,
        featured: form.featured,
        newArrival: form.newArrival,
        active: form.active,
        isDemo: form.isDemo,
        images: form.images,
        modelUrl: form.modelUrl || undefined,
        variants: form.variants,
      };
      if (isNew) return adminApi.createProduct(payload);
      return adminApi.updateProduct(id!, payload);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin-products'] });
      navigate('/admin/products');
    },
  });

  async function onUploadImage(file: File) {
    const uploaded = await adminApi.upload(file, 'image');
    setForm((f) => ({
      ...f,
      images: [
        ...f.images,
        { url: String(uploaded.url), alt: file.name, isPrimary: f.images.length === 0 },
      ],
    }));
  }

  async function onUploadModel(file: File) {
    const uploaded = await adminApi.upload(file, 'model');
    setForm((f) => ({ ...f, modelUrl: String(uploaded.url) }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    save.mutate();
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-700">
        {isNew ? 'New product' : 'Edit product'}
      </h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-6 rounded-xl border border-line bg-white p-6">
        <section className="space-y-3">
          <h2 className="font-semibold">Basic information</h2>
          <input required placeholder="Name" className="w-full rounded-md border border-line px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <textarea required placeholder="Description" rows={4} className="w-full rounded-md border border-line px-3 py-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid gap-3 sm:grid-cols-2">
            <input required placeholder="SKU" className="rounded-md border border-line px-3 py-2" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            <input placeholder="Brand" className="rounded-md border border-line px-3 py-2" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
          </div>
          <select required className="w-full rounded-md border border-line px-3 py-2" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
            <option value="">Select category</option>
            {(categories ?? []).map((c) => (
              <option key={String(c.id)} value={String(c.id)}>{String(c.name)}</option>
            ))}
          </select>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Pricing</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input type="number" min={0} required className="rounded-md border border-line px-3 py-2" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            <input type="number" min={0} placeholder="Sale price" className="rounded-md border border-line px-3 py-2" value={form.salePrice ?? ''} onChange={(e) => setForm({ ...form, salePrice: e.target.value === '' ? undefined : Number(e.target.value) })} />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Inventory & variants</h2>
          <select className="w-full rounded-md border border-line px-3 py-2" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })}>
            <option value="in_stock">In stock</option>
            <option value="out_of_stock">Out of stock</option>
            <option value="made_to_order">Made to order</option>
            <option value="inquiry_only">Inquiry only</option>
          </select>
          <input placeholder="Sizes (comma separated)" className="w-full rounded-md border border-line px-3 py-2" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
          <input placeholder="Colors (comma separated)" className="w-full rounded-md border border-line px-3 py-2" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} />
          <button
            type="button"
            className="rounded-md border border-line px-3 py-2 text-sm"
            onClick={() =>
              setForm({
                ...form,
                variants: [...form.variants, { size: '', color: '', stock: 0, active: true }],
              })
            }
          >
            Add variant
          </button>
          {form.variants.map((v, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-4">
              <input placeholder="Size" className="rounded-md border border-line px-2 py-1" value={v.size ?? ''} onChange={(e) => {
                const variants = [...form.variants];
                variants[i] = { ...v, size: e.target.value };
                setForm({ ...form, variants });
              }} />
              <input placeholder="Color" className="rounded-md border border-line px-2 py-1" value={v.color ?? ''} onChange={(e) => {
                const variants = [...form.variants];
                variants[i] = { ...v, color: e.target.value };
                setForm({ ...form, variants });
              }} />
              <input type="number" placeholder="Stock" className="rounded-md border border-line px-2 py-1" value={v.stock} onChange={(e) => {
                const variants = [...form.variants];
                variants[i] = { ...v, stock: Number(e.target.value) };
                setForm({ ...form, variants });
              }} />
              <button type="button" className="text-sm text-red-700" onClick={() => setForm({ ...form, variants: form.variants.filter((_, idx) => idx !== i) })}>
                Remove
              </button>
            </div>
          ))}
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Media</h2>
          <label className="block text-sm">
            Upload image
            <input type="file" accept="image/*" className="mt-1 block w-full text-sm" onChange={(e) => e.target.files?.[0] && onUploadImage(e.target.files[0])} />
          </label>
          <div className="flex flex-wrap gap-2">
            {form.images.map((img) => (
              <img key={img.url} src={img.url} alt="" className="h-16 w-16 rounded object-cover border border-line" />
            ))}
          </div>
          <label className="block text-sm">
            Optional 3D model (.glb / .gltf)
            <input type="file" accept=".glb,.gltf" className="mt-1 block w-full text-sm" onChange={(e) => e.target.files?.[0] && onUploadModel(e.target.files[0])} />
          </label>
          {form.modelUrl && <p className="truncate text-xs text-muted">{form.modelUrl}</p>}
        </section>

        <section className="flex flex-wrap gap-4 text-sm">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.newArrival} onChange={(e) => setForm({ ...form, newArrival: e.target.checked })} /> New arrival</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.isDemo} onChange={(e) => setForm({ ...form, isDemo: e.target.checked })} /> Demo product</label>
        </section>

        {save.isError && <p className="text-sm text-red-700">{(save.error as Error).message}</p>}
        <button type="submit" className="rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white" disabled={save.isPending}>
          {save.isPending ? 'Saving…' : 'Save product'}
        </button>
      </form>
    </div>
  );
}
