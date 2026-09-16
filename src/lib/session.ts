import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'pais_admin';

/** 30 days. Long enough not to be a nuisance, short enough that a stolen cookie expires. */
const SESSION_DAYS = 30;

/**
 * Signs with ADMIN_PASSWORD itself, so there is no second secret to manage and
 * changing the password invalidates every existing session for free.
 */
function sign(expiry: number, secret: string): string {
  return createHmac('sha256', secret).update(String(expiry)).digest('hex');
}

export function createSessionToken(secret: string): { token: string; expires: Date } {
  const expiry = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  return { token: `${expiry}.${sign(expiry, secret)}`, expires: new Date(expiry) };
}

export function tokenIsValid(token: string | undefined, secret: string): boolean {
  if (!token) return false;

  const [expiryPart, signature] = token.split('.');
  const expiry = Number(expiryPart);
  if (!Number.isFinite(expiry) || !signature) return false;
  if (expiry < Date.now()) return false;

  const expected = Buffer.from(sign(expiry, secret), 'hex');
  const supplied = Buffer.from(signature, 'hex');
  if (expected.length !== supplied.length) return false;

  return timingSafeEqual(expected, supplied);
}

/** True when the caller holds a valid session cookie. Every mutating admin route gates on this. */
export async function isSignedIn(): Promise<boolean> {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;

  const store = await cookies();
  return tokenIsValid(store.get(SESSION_COOKIE)?.value, secret);
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};
