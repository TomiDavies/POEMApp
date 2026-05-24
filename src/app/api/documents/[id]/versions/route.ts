import { NextRequest, NextResponse } from 'next/server';
import { documentsDb } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const versions = documentsDb.getVersions(id);
    return NextResponse.json(versions);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 });
  }
}
