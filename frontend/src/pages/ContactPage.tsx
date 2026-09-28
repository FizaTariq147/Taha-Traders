import { useState, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle, Phone } from 'lucide-react';
import { api, buildWhatsAppUrl } from '../lib/api';

export function ContactPage() {
  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: api.getSettings });
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const waGeneral = settings
    ? buildWhatsAppUrl(
        settings.whatsappNumber,
        'Hello, I would like to contact Taha Traders regarding wholesale materials.',
      )
    : '#';

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('');
    try {
      await api.createInquiry({
        customerName: name,
        phone,
        quantity: 1,
        message,
      });
      const wa = settings
        ? buildWhatsAppUrl(
            settings.whatsappNumber,
            `Hello, my name is ${name}.\nPhone: ${phone}\n${message}`,
          )
        : '#';
      window.open(wa, '_blank', 'noopener,noreferrer');
      setStatus('Inquiry saved. Opening WhatsApp…');
      setName('');
      setPhone('');
      setMessage('');
    } catch {
      setStatus('Could not save inquiry. You can still use WhatsApp below.');
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl font-700">Contact</h1>
      <p className="mt-2 text-muted">Reach Taha Traders for wholesale inquiries.</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-xl border border-line bg-white p-6">
            <h2 className="font-display text-xl font-700">Phones</h2>
            <ul className="mt-4 space-y-2">
              {(settings?.phones ?? []).map((p) => (
                <li key={p}>
                  <a
                    href={`tel:${p.replace(/\D/g, '')}`}
                    className="inline-flex items-center gap-2 text-brand hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    {p}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={waGeneral}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-2 text-sm font-semibold text-white"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <p className="mt-3 text-xs text-demo">
              WhatsApp number is configurable in Admin Settings and needs business confirmation.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-white p-6">
            <h2 className="font-display text-xl font-700">Address</h2>
            <p className="mt-3 text-muted">{settings?.address}</p>
            <p className="mt-4 text-sm text-muted">
              Email:{' '}
              {settings?.email ? (
                <a href={`mailto:${settings.email}`} className="text-brand">
                  {settings.email}
                </a>
              ) : (
                <span className="text-demo">Needs confirmation</span>
              )}
            </p>
            <p className="mt-2 text-sm text-muted">
              Hours:{' '}
              {settings?.businessHours || (
                <span className="text-demo">Needs confirmation</span>
              )}
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-xl border border-line bg-white p-6">
          <h2 className="font-display text-xl font-700">Send an inquiry</h2>
          <label className="mt-4 block text-sm">
            Name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-line px-3 py-2"
            />
          </label>
          <label className="mt-4 block text-sm">
            Phone
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-md border border-line px-3 py-2"
            />
          </label>
          <label className="mt-4 block text-sm">
            Message
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 w-full rounded-md border border-line px-3 py-2"
            />
          </label>
          <button
            type="submit"
            className="mt-6 rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white"
          >
            Submit and open WhatsApp
          </button>
          {status && <p className="mt-3 text-sm text-muted" role="status">{status}</p>}
        </form>
      </div>

      <div className="mt-10 min-h-72 overflow-hidden rounded-xl border border-line bg-surface">
        {settings?.mapUrl ? (
          <iframe
            title="Map"
            src={settings.mapUrl}
            className="h-72 w-full"
            loading="lazy"
          />
        ) : (
          <div className="flex h-72 items-center justify-center text-sm text-demo">
            Google Maps URL needs confirmation in Admin Settings.
          </div>
        )}
      </div>
    </main>
  );
}
