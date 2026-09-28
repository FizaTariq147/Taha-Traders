import { useEffect, useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../lib/api';

export function ContentPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['admin-content'], queryFn: adminApi.content });
  const [form, setForm] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroImageUrl: '',
    heroModelUrl: '',
    heroCtaPrimary: '',
    heroCtaSecondary: '',
    aboutTitle: '',
    aboutBody: '',
    aboutImageUrl: '',
    promoBanner: '',
  });

  useEffect(() => {
    if (!data) return;
    setForm({
      heroTitle: String(data.heroTitle ?? ''),
      heroSubtitle: String(data.heroSubtitle ?? ''),
      heroImageUrl: String(data.heroImageUrl ?? ''),
      heroModelUrl: String(data.heroModelUrl ?? ''),
      heroCtaPrimary: String(data.heroCtaPrimary ?? ''),
      heroCtaSecondary: String(data.heroCtaSecondary ?? ''),
      aboutTitle: String(data.aboutTitle ?? ''),
      aboutBody: String(data.aboutBody ?? ''),
      aboutImageUrl: String(data.aboutImageUrl ?? ''),
      promoBanner: String(data.promoBanner ?? ''),
    });
  }, [data]);

  const save = useMutation({
    mutationFn: () => adminApi.updateContent(form),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-content'] }),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    save.mutate();
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-700">Content</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-xl border border-line bg-white p-6">
        {(
          [
            ['heroTitle', 'Hero title'],
            ['heroSubtitle', 'Hero subtitle'],
            ['heroImageUrl', 'Hero image URL'],
            ['heroModelUrl', 'Hero 3D model URL'],
            ['heroCtaPrimary', 'Primary CTA'],
            ['heroCtaSecondary', 'Secondary CTA'],
            ['aboutTitle', 'About title'],
            ['aboutImageUrl', 'About image URL'],
            ['promoBanner', 'Promo banner'],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block text-sm">
            {label}
            <input
              className="mt-1 w-full rounded-md border border-line px-3 py-2"
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </label>
        ))}
        <label className="block text-sm">
          About body
          <textarea
            rows={5}
            className="mt-1 w-full rounded-md border border-line px-3 py-2"
            value={form.aboutBody}
            onChange={(e) => setForm({ ...form, aboutBody: e.target.value })}
          />
        </label>
        <button type="submit" className="rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white">
          {save.isPending ? 'Saving…' : 'Save content'}
        </button>
        {save.isSuccess && <p className="text-sm text-green-700">Saved.</p>}
      </form>
    </div>
  );
}
