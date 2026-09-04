import { Pool, type QueryResult, type QueryResultRow } from 'pg';

function getConnectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }
  return url;
}

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({ connectionString: getConnectionString() });
  }
  return pool;
}

function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = getPool()
      .query(
        `
        CREATE TABLE IF NOT EXISTS documents (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL DEFAULT '',
          category TEXT NOT NULL,
          subcategory TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'draft',
          version INTEGER NOT NULL DEFAULT 1,
          tags TEXT NOT NULL DEFAULT '[]',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS document_versions (
          id TEXT PRIMARY KEY,
          document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          version INTEGER NOT NULL,
          created_at TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
        CREATE INDEX IF NOT EXISTS idx_documents_subcategory ON documents(subcategory);
        CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
        CREATE INDEX IF NOT EXISTS idx_versions_document_id ON document_versions(document_id);
        `
      )
      .then(() => undefined);
  }
  return schemaReady;
}

async function runQuery<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  await ensureSchema();
  return getPool().query<T>(text, params);
}

async function query<T extends QueryResultRow>(text: string, params?: unknown[]): Promise<T[]> {
  const result = await runQuery<T>(text, params);
  return result.rows;
}

export interface DbDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  subcategory: string;
  status: string;
  version: number;
  tags: string;
  created_at: string;
  updated_at: string;
}

export interface DbDocumentVersion {
  id: string;
  document_id: string;
  title: string;
  content: string;
  version: number;
  created_at: string;
}

export const documentsDb = {
  async getAll(): Promise<DbDocument[]> {
    return query<DbDocument>('SELECT * FROM documents ORDER BY updated_at DESC');
  },

  async getByCategory(category: string): Promise<DbDocument[]> {
    return query<DbDocument>(
      'SELECT * FROM documents WHERE category = $1 ORDER BY updated_at DESC',
      [category]
    );
  },

  async getBySubcategory(category: string, subcategory: string): Promise<DbDocument[]> {
    return query<DbDocument>(
      'SELECT * FROM documents WHERE category = $1 AND subcategory = $2 ORDER BY updated_at DESC',
      [category, subcategory]
    );
  },

  async getById(id: string): Promise<DbDocument | undefined> {
    const rows = await query<DbDocument>('SELECT * FROM documents WHERE id = $1', [id]);
    return rows[0];
  },

  async search(searchQuery: string): Promise<DbDocument[]> {
    const like = `%${searchQuery}%`;
    return query<DbDocument>(
      'SELECT * FROM documents WHERE title ILIKE $1 OR content ILIKE $1 ORDER BY updated_at DESC',
      [like]
    );
  },

  async create(doc: Omit<DbDocument, 'version'> & { version?: number }): Promise<DbDocument> {
    const now = new Date().toISOString();
    await runQuery(
      `INSERT INTO documents (id, title, content, category, subcategory, status, version, tags, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        doc.id,
        doc.title,
        doc.content,
        doc.category,
        doc.subcategory,
        doc.status,
        doc.version ?? 1,
        doc.tags,
        doc.created_at,
        now,
      ]
    );
    return (await this.getById(doc.id))!;
  },

  async update(
    id: string,
    updates: Partial<Pick<DbDocument, 'title' | 'content' | 'status' | 'tags'>>
  ): Promise<DbDocument | undefined> {
    const existing = await this.getById(id);
    if (!existing) return undefined;

    const now = new Date().toISOString();
    const newVersion = existing.version + 1;

    // Save a version snapshot before updating
    const versionId = `${id}-v${existing.version}`;
    await runQuery(
      `INSERT INTO document_versions (id, document_id, title, content, version, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO NOTHING`,
      [versionId, id, existing.title, existing.content, existing.version, now]
    );

    const entries = Object.entries(updates).filter(([, v]) => v !== undefined) as [
      string,
      string,
    ][];
    const setClauses = entries.map(([key], i) => `${key} = $${i + 1}`);
    const versionParam = entries.length + 1;
    const updatedAtParam = entries.length + 2;
    const idParam = entries.length + 3;

    await runQuery(
      `UPDATE documents SET ${setClauses.join(', ')}, version = $${versionParam}, updated_at = $${updatedAtParam} WHERE id = $${idParam}`,
      [...entries.map(([, v]) => v), newVersion, now, id]
    );

    return this.getById(id);
  },

  async delete(id: string): Promise<boolean> {
    const result = await runQuery('DELETE FROM documents WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },

  async getVersions(documentId: string): Promise<DbDocumentVersion[]> {
    return query<DbDocumentVersion>(
      'SELECT * FROM document_versions WHERE document_id = $1 ORDER BY version DESC',
      [documentId]
    );
  },

  async countByCategory(): Promise<Record<string, number>> {
    const rows = await query<{ category: string; count: string }>(
      'SELECT category, COUNT(*) as count FROM documents GROUP BY category'
    );
    return Object.fromEntries(rows.map((r) => [r.category, Number(r.count)]));
  },

  async countBySubcategory(): Promise<Record<string, number>> {
    const rows = await query<{ key: string; count: string }>(
      "SELECT category || '/' || subcategory as key, COUNT(*) as count FROM documents GROUP BY key"
    );
    return Object.fromEntries(rows.map((r) => [r.key, Number(r.count)]));
  },
};
