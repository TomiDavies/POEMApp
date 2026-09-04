import { NextRequest, NextResponse } from 'next/server';
import { documentsDb } from '@/lib/db';
import { requireApiSession } from '@/lib/dal';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireApiSession();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  try {
    const versions = await documentsDb.getVersions(id);
    return NextResponse.json(versions);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 });
  }
}
