export interface ParsedAuthToken {
  userId: number;
  role: string;
  expiresAt: number;
  email: string;
}

function normalizeBase64(value: string): string {
  const replaced = value.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (replaced.length % 4)) % 4;
  return replaced + '='.repeat(padLength);
}

function decodeBase64Url(value: string): string {
  const normalized = normalizeBase64(value);
  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    return window.atob(normalized);
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(normalized, 'base64').toString('utf-8');
  }
  throw new Error('No hay decodificador base64 disponible');
}

export function parseAuthToken(token: string | null): ParsedAuthToken | null {
  if (!token) {
    return null;
  }
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }
  try {
    const payload = decodeBase64Url(parts[0]);
    const segments = payload.split(':');
    if (segments.length !== 4 && segments.length !== 5) {
      return null;
    }
    const userId = Number(segments[0]);
    const role = segments[1];
    const expiresAt = Number(segments.length === 5 ? segments[3] : segments[2]);
    const email = decodeBase64Url(segments.length === 5 ? segments[4] : segments[3]);
    if (Number.isNaN(userId) || Number.isNaN(expiresAt)) {
      return null;
    }
    return {
      userId,
      role,
      expiresAt,
      email,
    };
  } catch (_error) {
    return null;
  }
}
