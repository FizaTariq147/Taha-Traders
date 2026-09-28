import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../lib/api';

export function MediaPage() {
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['admin-media'],
    queryFn: adminApi.media,
  });

  async function onUpload(file: File, type: string) {
    await adminApi.upload(file, type);
    refetch();
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-700">Media</h1>
      <p className="mt-2 text-sm text-muted">
        Uploads go to Cloudinary when configured; otherwise a local demo data URL is stored.
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        <label className="rounded-md border border-line bg-white px-4 py-3 text-sm">
          Upload image
          <input type="file" accept="image/*" className="mt-2 block" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0], 'image')} />
        </label>
        <label className="rounded-md border border-line bg-white px-4 py-3 text-sm">
          Upload 3D model
          <input type="file" accept=".glb,.gltf" className="mt-2 block" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0], 'model')} />
        </label>
      </div>
      {isFetching && <p className="mt-4 text-muted">Refreshing…</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(data ?? []).map((item) => (
          <div key={String(item.id)} className="overflow-hidden rounded-xl border border-line bg-white">
            {String(item.type) === 'model' ? (
              <div className="flex h-36 items-center justify-center bg-surface text-sm text-muted">3D model</div>
            ) : (
              <img src={String(item.url)} alt="" className="h-36 w-full object-cover" />
            )}
            <div className="p-3">
              <p className="truncate text-xs text-muted">{String(item.originalName ?? item.url)}</p>
              <p className="mt-1 text-xs uppercase text-brand">{String(item.type)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
