import { NextResponse } from 'next/server';
import { passwordMatches } from '@/lib/publish';
import { SESSION_COOKIE, createSessionToken, isSignedIn, sessionCookieOptions } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Whether this browser already holds a valid session. */
export async function GET() {
  return NextResponse.json({
    signedIn: await isSignedIn(),
    configured: Boolean(process.env.ADMIN_PASSWORD),
  });
}

/** Sign in: exchange the password for a 30-day cookie. */
export async function POST(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD is not set.' }, { status: 503 });
  }

  let input: { password?: string };
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: 'Could not read the request.' }, { status: 400 });
  }

  if (typeof input.password !== 'string' || !passwordMatches(input.password, adminPassword)) {
    return NextResponse.json({ error: 'Wrong password.' }, { status: 401 });
  }

  const { token, expires } = createSessionToken(adminPassword);
  const response = NextResponse.json({ ok: true, expires: expires.toISOString() });
  response.cookies.set(SESSION_COOKIE, token, { ...sessionCookieOptions, expires });
  return response;
}

/** Sign out. */
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, '', { ...sessionCookieOptions, maxAge: 0 });
  return response;
}
