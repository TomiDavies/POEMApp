import 'server-only';
import { NextResponse } from 'next/server';
import { hasValidSession } from '@/lib/session';

/**
 * Guard for Route Handlers. Returns a 401 response if there is no valid
 * session, or null if the caller is authenticated and the handler should
 * proceed. Proxy performs the same check optimistically, but route handlers
 * verify it again since Proxy alone is not sufficient protection.
 */
export async function requireApiSession(): Promise<NextResponse | null> {
  if (await hasValidSession()) return null;
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
