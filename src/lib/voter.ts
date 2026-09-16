import { randomBytes } from 'node:crypto';
import type { NextResponse } from 'next/server';

/**
 * An anonymous per-browser token, so one person gets one vote and one rating without
 * an account. It is not identity and is not hard to defeat; it stops casual repeats.
 */
export const VOTER_COOKIE = 'pais_voter';

const ONE_YEAR = 60 * 60 * 24 * 365;

export function readVoter(request: Request): string | null {
  const header = request.headers.get('cookie') ?? '';
  const match = header.match(/(?:^|;\s*)pais_voter=([a-f0-9]{32})/);
  return match ? match[1] : null;
}

export function newVoter(): string {
  return randomBytes(16).toString('hex');
}

export function attachVoter(response: NextResponse, voter: string): void {
  response.cookies.set(VOTER_COOKIE, voter, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ONE_YEAR,
  });
}

/** Best-effort client address, for the per-network rate limit. */
export function clientIp(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim() || null;
  return request.headers.get('x-real-ip');
}
