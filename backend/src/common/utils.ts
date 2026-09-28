export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function serializeDoc<T extends { _id?: unknown; toObject?: () => object }>(
  doc: T | null,
): (Record<string, unknown> & { id: string }) | null {
  if (!doc) return null;
  const obj = (typeof doc.toObject === 'function' ? doc.toObject() : doc) as Record<
    string,
    unknown
  > & { _id?: { toString(): string }; id?: string };
  const id = obj.id ?? (obj._id ? String(obj._id) : '');
  const { _id, __v, ...rest } = obj as Record<string, unknown>;
  return { ...rest, id: String(id) };
}

export function serializeMany<T extends { _id?: unknown; toObject?: () => object }>(
  docs: T[],
) {
  return docs.map((d) => serializeDoc(d)!);
}
