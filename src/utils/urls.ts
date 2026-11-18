export function normaliseBase(base: string): string {
  if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base)) {
    throw new Error('site.basePath must be / or a path such as /portfolio/');
  }
  return base;
}
export function assetUrl(path: string, base: string): string {
  if (!path || path.startsWith('/') || path.includes('..') || /[:?#\\]/.test(path)) {
    throw new Error(`Unsafe local asset path: ${path}`);
  }
  return `${normaliseBase(base)}${path}`;
}
export function isHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch { return false; }
}
export function canonicalUrl(origin: string | null, base: string): string | null {
  if (!origin) return null;
  if (!isHttpsUrl(origin)) throw new Error('site.canonicalOrigin must use HTTPS');
  const url = new URL(origin);
  if (url.pathname !== '/' || url.search || url.hash) throw new Error('Canonical origin must not include a path, query or hash');
  return new URL(normaliseBase(base), url.origin).href;
}
