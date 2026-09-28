import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield } from 'lucide-react';
import { adminApi } from '../lib/api';

export function LoginPage() {
  const [email, setEmail] = useState('admin@tahatraders.local');
  const [password, setPassword] = useState('ChangeMeAdmin123!');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const qc = useQueryClient();

  const login = useMutation({
    mutationFn: () => adminApi.login(email, password),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['me'] });
      navigate('/admin/dashboard');
    },
    onError: () => setError('Invalid credentials'),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    login.mutate();
  }

  return (
    <div className="admin-shell relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070d18] px-4 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="admin-orb admin-orb-a" />
        <div className="admin-orb admin-orb-b" />
        <div className="admin-grid-fade" />
      </div>

      <form
        onSubmit={onSubmit}
        className="admin-card relative w-full max-w-md animate-admin-in rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-bright/20 text-brand-bright">
            <Shield className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h1 className="font-display text-3xl font-700">Admin login</h1>
            <p className="text-sm text-white/55">Taha Traders catalogue management</p>
          </div>
        </div>

        <label className="mt-2 block text-sm text-white/70">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2.5 text-white outline-none transition focus:border-brand-bright"
          />
        </label>
        <label className="mt-4 block text-sm text-white/70">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2.5 text-white outline-none transition focus:border-brand-bright"
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-brand to-brand-bright py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition hover:brightness-110 disabled:opacity-60"
          disabled={login.isPending}
        >
          {login.isPending ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="mt-4 text-center text-xs text-white/40">
          <Link to="/" className="hover:text-white">
            Back to storefront
          </Link>
        </p>
      </form>
    </div>
  );
}
