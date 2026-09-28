import { useEffect, useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../lib/api';

export function SettingsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['admin-settings'], queryFn: adminApi.settings });
  const [form, setForm] = useState({
    businessNameEn: '',
    businessNameUr: '',
    tagline: '',
    phones: '',
    whatsappNumber: '',
    email: '',
    address: '',
    addressUr: '',
    mapUrl: '',
    businessHours: '',
    proprietor: '',
    contactPerson: '',
  });

  useEffect(() => {
    if (!data) return;
    setForm({
      businessNameEn: String(data.businessNameEn ?? ''),
      businessNameUr: String(data.businessNameUr ?? ''),
      tagline: String(data.tagline ?? ''),
      phones: Array.isArray(data.phones) ? data.phones.join(', ') : '',
      whatsappNumber: String(data.whatsappNumber ?? ''),
      email: String(data.email ?? ''),
      address: String(data.address ?? ''),
      addressUr: String(data.addressUr ?? ''),
      mapUrl: String(data.mapUrl ?? ''),
      businessHours: String(data.businessHours ?? ''),
      proprietor: String(data.proprietor ?? ''),
      contactPerson: String(data.contactPerson ?? ''),
    });
  }, [data]);

  const save = useMutation({
    mutationFn: () =>
      adminApi.updateSettings({
        ...form,
        phones: form.phones
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-settings'] }),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    save.mutate();
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-700">Settings</h1>
      <p className="mt-2 text-sm text-demo">
        WhatsApp number, email, hours, and map URL need business confirmation before production.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-xl border border-line bg-white p-6">
        {(
          [
            ['businessNameEn', 'English business name'],
            ['businessNameUr', 'Urdu business name'],
            ['tagline', 'Tagline'],
            ['phones', 'Phones (comma separated)'],
            ['whatsappNumber', 'WhatsApp number (digits preferred)'],
            ['email', 'Email'],
            ['address', 'Address'],
            ['addressUr', 'Address (Urdu)'],
            ['mapUrl', 'Google Maps embed URL'],
            ['businessHours', 'Business hours'],
            ['proprietor', 'Proprietor'],
            ['contactPerson', 'Contact person'],
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
        <button type="submit" className="rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white">
          {save.isPending ? 'Saving…' : 'Save settings'}
        </button>
        {save.isSuccess && <p className="text-sm text-green-700">Saved.</p>}
      </form>
    </div>
  );
}
