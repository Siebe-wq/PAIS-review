import { NextResponse } from 'next/server';
import { dbConfigured, describeDbError, pingDb } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Open this in a browser to see why comments and ratings are, or are not, showing.
 * Says only what kind of thing is wrong — never the connection details.
 */
export async function GET() {
  const env = {
    DATABASE_URL: Boolean(process.env.DATABASE_URL),
    POSTGRES_URL: Boolean(process.env.POSTGRES_URL),
  };
  if (!dbConfigured()) {
    return NextResponse.json({
      configured: false,
      ok: false,
      env,
      hint: 'No DATABASE_URL in this deployment. If you added the database after the last deploy, redeploy: environment variables only apply to new builds.',
    });
  }
  try {
    await pingDb();
    return NextResponse.json({ configured: true, ok: true, env, hint: 'Comments and ratings should be showing.' });
  } catch (error) {
    return NextResponse.json({ configured: true, ok: false, env, error: describeDbError(error) }, { status: 503 });
  }
}
