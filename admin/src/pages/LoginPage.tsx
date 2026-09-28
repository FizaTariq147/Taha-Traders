import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
      navigate('/dashboard');
    },
    onError: () => setError('Invalid credentials'),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    login.mutate();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-xl border border-line bg-white p-8 shadow-sm"
      >
        <h1 className="font-display text-3xl font-700 text-brand">Admin login</h1>
        <p className="mt-2 text-sm text-muted">Taha Traders catalogue management</p>
        <label className="mt-6 block text-sm">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-line px-3 py-2"
          />
        </label>
        <label className="mt-4 block text-sm">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-line px-3 py-2"
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          className="mt-6 w-full rounded-md bg-brand py-3 text-sm font-semibold text-white"
          disabled={login.isPending}
        >
          {login.isPending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
