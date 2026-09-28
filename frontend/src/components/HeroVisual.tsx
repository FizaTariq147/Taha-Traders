import { Suspense, lazy, useEffect, useState } from 'react';
import { resolveMediaUrl } from '../lib/api';
import { SmartImage } from './SmartImage';

const Scene = lazy(() => import('./HeroScene'));
const HERO_FALLBACK = 'https://picsum.photos/seed/taha-hero/1400/900';

function canUse3D() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  const canvas = document.createElement('canvas');
  const gl =
    canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  return Boolean(gl);
}

export function HeroVisual({
  imageUrl,
  modelUrl,
}: {
  imageUrl: string;
  modelUrl?: string;
}) {
  const [enable3d, setEnable3d] = useState(false);

  useEffect(() => {
    const idle = window.setTimeout(() => {
      // Only use real GLB models for 3D — always show photo otherwise
      setEnable3d(canUse3D() && Boolean(modelUrl));
    }, 400);
    return () => window.clearTimeout(idle);
  }, [modelUrl]);

  if (!enable3d) {
    return (
      <SmartImage
        src={imageUrl}
        fallback={HERO_FALLBACK}
        alt="Wholesale tailoring materials"
        loading="eager"
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <Suspense
      fallback={
        <SmartImage
          src={imageUrl}
          fallback={HERO_FALLBACK}
          alt=""
          className="h-full w-full object-cover"
        />
      }
    >
      <Scene fallbackImage={resolveMediaUrl(imageUrl, HERO_FALLBACK)} modelUrl={modelUrl} />
    </Suspense>
  );
}
