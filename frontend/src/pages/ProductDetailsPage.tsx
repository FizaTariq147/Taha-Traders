import { useMemo, useState, Suspense, lazy } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle } from 'lucide-react';
import {
  api,
  buildWhatsAppUrl,
  formatPrice,
  productInquiryMessage,
} from '../lib/api';
import { ProductCard } from '../components/ProductCard';
import { SmartImage } from '../components/SmartImage';

const ProductViewer3D = lazy(() => import('../components/ProductViewer3D'));

export function ProductDetailsPage() {
  const { slug = '' } = useParams();
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.getProduct(slug),
    enabled: Boolean(slug),
  });
  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: api.getSettings });
  const { data: related } = useQuery({
    queryKey: ['related', product?.id],
    queryFn: () => api.getRelated(product!.id, String(product!.categoryId)),
    enabled: Boolean(product?.id && product?.categoryId),
  });

  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [show3d, setShow3d] = useState(false);
  const [qty, setQty] = useState(1);

  const images = product?.images?.length
    ? product.images
    : [{ url: 'https://picsum.photos/seed/taha-placeholder/800/800', alt: product?.name }];

  const variantStock = useMemo(() => {
    if (!product?.variants?.length) return null;
    const match = product.variants.find(
      (v) =>
        (!size || v.size === size) &&
        (!color || v.color === color) &&
        v.active,
    );
    return match?.stock ?? 0;
  }, [product, size, color]);

  if (isLoading) {
    return <main className="mx-auto max-w-7xl px-4 py-16 text-muted">Loading product…</main>;
  }
  if (error || !product) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16">
        <p>Product not found.</p>
        <Link to="/shop" className="text-brand">Back to shop</Link>
      </main>
    );
  }

  const price = product.salePrice ?? product.price;
  const message = productInquiryMessage(product, size || undefined, color || undefined);
  const wa = settings ? buildWhatsAppUrl(settings.whatsappNumber, message) : '#';

  async function onInquire() {
    try {
      await api.createInquiry({
        customerName: 'WhatsApp visitor',
        phone: settings?.whatsappNumber ?? '',
        productId: product!.id,
        productName: product!.name,
        size: size || undefined,
        color: color || undefined,
        quantity: qty,
        message,
      });
    } catch {
      // Still open WhatsApp even if API fails
    }
    window.open(wa, '_blank', 'noopener,noreferrer');
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-xl border border-line bg-white">
            {show3d && product.modelUrl ? (
              <Suspense
                fallback={
                  <SmartImage
                    src={images[0]?.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                }
              >
                <ProductViewer3D modelUrl={product.modelUrl} />
              </Suspense>
            ) : (
              <SmartImage
                src={images[activeImage]?.url}
                alt={images[activeImage]?.alt ?? product.name}
                loading="eager"
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {images.map((img, i) => (
              <button
                key={img.url + i}
                type="button"
                onClick={() => {
                  setShow3d(false);
                  setActiveImage(i);
                }}
                className={`h-16 w-16 overflow-hidden rounded-md border ${i === activeImage && !show3d ? 'border-brand' : 'border-line'}`}
              >
                <SmartImage
                  src={img.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
            {product.modelUrl && (
              <button
                type="button"
                onClick={() => setShow3d(true)}
                className={`rounded-md border px-3 text-sm font-medium ${show3d ? 'border-brand text-brand' : 'border-line'}`}
              >
                3D view
              </button>
            )}
          </div>
        </div>

        <div>
          {product.isDemo && (
            <p className="mb-3 inline-block rounded bg-demo px-2 py-1 text-xs font-semibold text-white">
              Demo product — not real inventory
            </p>
          )}
          <h1 className="font-display text-4xl font-700">{product.name}</h1>
          <p className="mt-2 text-sm text-muted">SKU: {product.sku}</p>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-semibold text-brand">{formatPrice(price)}</span>
            {product.salePrice != null && (
              <span className="text-muted line-through">{formatPrice(product.price)}</span>
            )}
          </div>
          <p className="mt-2 text-sm capitalize text-muted">
            Availability: {product.availability.replace(/_/g, ' ')}
            {variantStock != null && ` · Variant stock: ${variantStock}`}
          </p>
          <p className="mt-6 whitespace-pre-line text-muted">{product.description}</p>

          {product.sizes?.length > 0 && (
            <fieldset className="mt-6">
              <legend className="text-sm font-semibold">Size</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`rounded-md border px-3 py-2 text-sm ${size === s ? 'border-brand bg-brand text-white' : 'border-line'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {product.colors?.length > 0 && (
            <fieldset className="mt-6">
              <legend className="text-sm font-semibold">Color</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`rounded-md border px-3 py-2 text-sm ${color === c ? 'border-brand bg-brand text-white' : 'border-line'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <label className="mt-6 block text-sm font-semibold">
            Quantity
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              className="mt-2 w-28 rounded-md border border-line px-3 py-2"
            />
          </label>

          <button
            type="button"
            onClick={onInquire}
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#25D366] px-5 py-3 text-sm font-semibold text-white"
          >
            <MessageCircle className="h-4 w-4" />
            Inquire on WhatsApp
          </button>
        </div>
      </div>

      {(related?.length ?? 0) > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-700">Related products</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related!.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
