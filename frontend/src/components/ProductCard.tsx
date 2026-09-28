import { Link } from 'react-router-dom';
import { formatPrice, resolveMediaUrl, type Product } from '../lib/api';
import { SmartImage } from './SmartImage';

export function ProductCard({ product }: { product: Product }) {
  const image = resolveMediaUrl(
    product.images.find((i) => i.isPrimary)?.url ?? product.images[0]?.url,
  );
  const price = product.salePrice ?? product.price;

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-line bg-white transition hover:border-brand/30 hover:shadow-sm">
      <Link to={`/product/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-surface">
        <SmartImage
          src={image}
          alt={product.images[0]?.alt ?? product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        {product.isDemo && (
          <span className="absolute left-2 top-2 rounded bg-demo px-2 py-0.5 text-xs font-semibold text-white">
            Demo product
          </span>
        )}
        {product.newArrival && !product.isDemo && (
          <span className="absolute right-2 top-2 rounded bg-brand px-2 py-0.5 text-xs font-semibold text-white">
            New
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to={`/product/${product.slug}`} className="font-display text-lg font-700 leading-snug text-ink hover:text-brand">
          {product.name}
        </Link>
        <p className="text-sm text-muted line-clamp-2">{product.description}</p>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-base font-semibold text-brand">{formatPrice(price)}</span>
          {product.salePrice != null && (
            <span className="text-sm text-muted line-through">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
