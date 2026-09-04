import { NextResponse } from 'next/server';
import { getCategoryActivitySummaries, getTodayFocus } from '@/lib/activity';
import { getConnectorMeta } from '@/lib/connectors';

export async function GET() {
  try {
    const [categories, focus] = await Promise.all([
      getCategoryActivitySummaries(),
      getTodayFocus(),
    ]);
    return NextResponse.json({
      sources: getConnectorMeta(),
      categories,
      focus,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}
