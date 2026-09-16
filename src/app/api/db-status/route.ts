import { NextResponse } from 'next/server';
import { dbConfigured, describeDbError, pingDb, postgresEnvNames } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Open this in a browser to see why comments and ratings are, or are not, showing.
 * Says only what kind of thing is wrong — never the connection details.
 */
export async function GET() {
  // Names only, never values: which variables in this deployment hold a Postgres URL.
  const env = { postgresUrls: postgresEnvNames() };
  if (!dbConfigured()) {
    return NextResponse.json({
      configured: false,
      ok: false,
      env,
      hint: 'No environment variable in this deployment holds a Postgres URL. If you connected the database after the last deploy, redeploy: environment variables only apply to new builds. Also check the variable is enabled for Production.',
    });
  }
  try {
    await pingDb();
    return NextResponse.json({ configured: true, ok: true, env, hint: 'Comments and ratings should be showing.' });
  } catch (error) {
    return NextResponse.json({ configured: true, ok: false, env, error: describeDbError(error) }, { status: 503 });
  }
}
