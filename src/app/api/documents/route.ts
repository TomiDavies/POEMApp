import { NextRequest, NextResponse } from 'next/server';
import { documentsDb } from '@/lib/db';
import { parseDbDocument } from '@/lib/utils';
import { nanoid } from 'nanoid';
import { requireApiSession } from '@/lib/dal';

export async function GET(request: NextRequest) {
  const unauthorized = await requireApiSession();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');

  try {
    let rows;
    if (category && subcategory) {
      rows = await documentsDb.getBySubcategory(category, subcategory);
    } else if (category) {
      rows = await documentsDb.getByCategory(category);
    } else {
      rows = await documentsDb.getAll();
    }
    return NextResponse.json(rows.map(parseDbDocument));
  } catch {
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireApiSession();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const { title, content, category, subcategory, status = 'draft', tags = [] } = body;

    if (!title || !category || !subcategory) {
      return NextResponse.json({ error: 'title, category and subcategory are required' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const doc = await documentsDb.create({
      id: nanoid(),
      title,
      content: content ?? '',
      category,
      subcategory,
      status,
      tags: JSON.stringify(tags),
      created_at: now,
      updated_at: now,
    });

    return NextResponse.json(parseDbDocument(doc), { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}
