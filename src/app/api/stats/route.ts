import { NextResponse } from 'next/server';
import { documentsDb } from '@/lib/db';
import { requireApiSession } from '@/lib/dal';

export async function GET() {
  const unauthorized = await requireApiSession();
  if (unauthorized) return unauthorized;

  try {
    const byCat = await documentsDb.countByCategory();
    const bySub = await documentsDb.countBySubcategory();
    const all = await documentsDb.getAll();
    return NextResponse.json({
      total: all.length,
      byCategory: byCat,
      bySubcategory: bySub,
      recent: all.slice(0, 5),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
