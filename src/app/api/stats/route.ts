import { NextResponse } from 'next/server';
import { documentsDb } from '@/lib/db';

export async function GET() {
  try {
    const byCat = documentsDb.countByCategory();
    const bySub = documentsDb.countBySubcategory();
    const all = documentsDb.getAll();
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
