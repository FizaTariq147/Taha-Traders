const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      ...(init?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(init?.headers ?? {}),
    },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export const adminApi = {
  login: (email: string, password: string) =>
    request<{ user: { id: string; email: string; role: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request<{ user: { userId: string; email: string; role: string } }>('/auth/me'),
  dashboard: () => request<Record<string, unknown>>('/dashboard'),
  products: () => request<Record<string, unknown>[]>('/products/admin/all'),
  product: (id: string) => request<Record<string, unknown>>(`/products/admin/${id}`),
  createProduct: (body: unknown) =>
    request('/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id: string, body: unknown) =>
    request(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteProduct: (id: string) => request(`/products/${id}`, { method: 'DELETE' }),
  categories: () => request<Record<string, unknown>[]>('/categories/admin/all'),
  createCategory: (body: unknown) =>
    request('/categories', { method: 'POST', body: JSON.stringify(body) }),
  updateCategory: (id: string, body: unknown) =>
    request(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteCategory: (id: string) => request(`/categories/${id}`, { method: 'DELETE' }),
  inquiries: () => request<Record<string, unknown>[]>('/inquiries'),
  updateInquiryStatus: (id: string, status: string) =>
    request(`/inquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  media: () => request<Record<string, unknown>[]>('/media'),
  upload: async (file: File, type: string = 'image') => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${API_BASE}/media/upload?type=${type}`, {
      method: 'POST',
      credentials: 'include',
      body: form,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  settings: () => request<Record<string, unknown>>('/settings'),
  updateSettings: (body: unknown) =>
    request('/settings', { method: 'PATCH', body: JSON.stringify(body) }),
  content: () => request<Record<string, unknown>>('/content'),
  updateContent: (body: unknown) =>
    request('/content', { method: 'PATCH', body: JSON.stringify(body) }),
};
