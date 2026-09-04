import { describe, expect, it } from 'vitest';
import { parseDbDocument, truncate, stripMarkdown } from './utils';
import type { DbDocument } from './db';

describe('parseDbDocument', () => {
  it('parses the tags JSON column and preserves other fields', () => {
    const dbDoc: DbDocument = {
      id: 'doc-1',
      title: 'Term Sheet',
      content: 'Draft terms.',
      category: 'people',
      subcategory: 'founder',
      status: 'draft',
      version: 1,
      tags: '["legal","priority"]',
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    };

    const doc = parseDbDocument(dbDoc);
    expect(doc.tags).toEqual(['legal', 'priority']);
    expect(doc.status).toBe('draft');
    expect(doc.id).toBe('doc-1');
  });

  it('falls back to an empty array when tags is empty or missing', () => {
    const dbDoc = { tags: '' } as DbDocument;
    expect(parseDbDocument(dbDoc).tags).toEqual([]);
  });
});

describe('truncate', () => {
  it('leaves short text untouched', () => {
    expect(truncate('short', 10)).toBe('short');
  });

  it('truncates long text and appends an ellipsis', () => {
    expect(truncate('this is a long sentence', 10)).toBe('this is a…');
  });
});

describe('stripMarkdown', () => {
  it('removes common markdown syntax', () => {
    expect(stripMarkdown('# Heading\n\n**bold** and *italic* and `code`')).toBe(
      'Heading bold and italic and code'
    );
  });

  it('removes links but keeps the link text', () => {
    expect(stripMarkdown('See [the docs](https://example.com) for details')).toBe(
      'See the docs for details'
    );
  });
});
