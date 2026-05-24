import { NextRequest, NextResponse } from 'next/server';
import { documentsDb } from '@/lib/db';
import { parseDbDocument } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? '';

  if (!query.trim()) {
    return NextResponse.json([]);
  }

  try {
    const docs = documentsDb.search(query);
    return NextResponse.json(docs.map(parseDbDocument));
  } catch {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
