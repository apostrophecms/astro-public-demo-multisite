const BACKEND_PORT = process.env.APOS_BACKEND_PORT || '3000';
const FALLBACK = process.env.APOS_HOST || 'http://localhost:3000';

export function aposHostFromRequest(request) {
  const host = request?.headers?.get?.('host');
  if (!host) return FALLBACK;
  const hostname = host.split(':')[0];
  return `http://${hostname}:${BACKEND_PORT}`;
}
