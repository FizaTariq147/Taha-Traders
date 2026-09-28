import { useEffect, useState } from 'react';
import { resolveMediaUrl } from '../lib/api';

type Props = {
  src?: string;
  alt?: string;
  className?: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
};

const DEFAULT_FALLBACK = 'https://picsum.photos/seed/taha-fallback/800/800';

export function SmartImage({
  src,
  alt = '',
  className,
  fallback = DEFAULT_FALLBACK,
  loading = 'lazy',
}: Props) {
  const resolved = resolveMediaUrl(src, fallback);
  const [current, setCurrent] = useState(resolved);
  const [failedOnce, setFailedOnce] = useState(false);

  useEffect(() => {
    setCurrent(resolveMediaUrl(src, fallback));
    setFailedOnce(false);
  }, [src, fallback]);

  return (
    <img
      src={current}
      alt={alt}
      loading={loading}
      decoding="async"
      referrerPolicy="no-referrer"
      className={className}
      onError={() => {
        if (!failedOnce && current !== fallback) {
          setFailedOnce(true);
          setCurrent(fallback);
        }
      }}
    />
  );
}
