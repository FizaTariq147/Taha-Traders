import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../lib/api';

export function CategoriesPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['admin-categories'], queryFn: adminApi.categories });
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const create = useMutation({
    mutationFn: () =>
      adminApi.createCategory({
        name,
        description,
        isDemo: true,
        active: true,
        sortOrder: (data?.length ?? 0) + 1,
      }),
    onSuccess: () => {
      setName('');
      setDescription('');
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });

  const toggle = useMutation({
    mutationFn: (cat: Record<string, unknown>) =>
      adminApi.updateCategory(String(cat.id), { active: !cat.active, name: cat.name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-categories'] }),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    create.mutate();
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-700">Categories</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-3 rounded-xl border border-line bg-white p-5 md:grid-cols-[1fr_1fr_auto]">
        <input required placeholder="Name" className="rounded-md border border-line px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Description" className="rounded-md border border-line px-3 py-2" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button type="submit" className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white">Add</button>
      </form>
      <ul className="mt-6 space-y-3">
        {(data ?? []).map((cat) => (
          <li key={String(cat.id)} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-3">
            <div>
              <p className="font-medium">{String(cat.name)}</p>
              <p className="text-sm text-muted">{String(cat.description ?? '')}</p>
              {cat.isDemo ? <p className="text-xs text-demo">Demo category</p> : null}
            </div>
            <button type="button" className="text-sm text-brand" onClick={() => toggle.mutate(cat)}>
              {cat.active ? 'Disable' : 'Enable'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
