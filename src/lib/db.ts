import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'dataroom.db');

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (db) return db;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
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
      document_id TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      version INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
    CREATE INDEX IF NOT EXISTS idx_documents_subcategory ON documents(subcategory);
    CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
    CREATE INDEX IF NOT EXISTS idx_versions_document_id ON document_versions(document_id);
  `);

  return db;
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
  getAll(): DbDocument[] {
    return getDb()
      .prepare('SELECT * FROM documents ORDER BY updated_at DESC')
      .all() as DbDocument[];
  },

  getByCategory(category: string): DbDocument[] {
    return getDb()
      .prepare('SELECT * FROM documents WHERE category = ? ORDER BY updated_at DESC')
      .all(category) as DbDocument[];
  },

  getBySubcategory(category: string, subcategory: string): DbDocument[] {
    return getDb()
      .prepare(
        'SELECT * FROM documents WHERE category = ? AND subcategory = ? ORDER BY updated_at DESC'
      )
      .all(category, subcategory) as DbDocument[];
  },

  getById(id: string): DbDocument | undefined {
    return getDb()
      .prepare('SELECT * FROM documents WHERE id = ?')
      .get(id) as DbDocument | undefined;
  },

  search(query: string): DbDocument[] {
    const like = `%${query}%`;
    return getDb()
      .prepare(
        'SELECT * FROM documents WHERE title LIKE ? OR content LIKE ? ORDER BY updated_at DESC'
      )
      .all(like, like) as DbDocument[];
  },

  create(doc: Omit<DbDocument, 'version'> & { version?: number }): DbDocument {
    const now = new Date().toISOString();
    const stmt = getDb().prepare(`
      INSERT INTO documents (id, title, content, category, subcategory, status, version, tags, created_at, updated_at)
      VALUES (@id, @title, @content, @category, @subcategory, @status, @version, @tags, @created_at, @updated_at)
    `);
    stmt.run({
      ...doc,
      version: doc.version ?? 1,
      updated_at: now,
    });
    return this.getById(doc.id)!;
  },

  update(
    id: string,
    updates: Partial<Pick<DbDocument, 'title' | 'content' | 'status' | 'tags'>>
  ): DbDocument | undefined {
    const existing = this.getById(id);
    if (!existing) return undefined;

    const now = new Date().toISOString();
    const newVersion = existing.version + 1;

    // Save a version snapshot before updating
    const versionId = `${id}-v${existing.version}`;
    getDb()
      .prepare(`
        INSERT OR IGNORE INTO document_versions (id, document_id, title, content, version, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .run(versionId, id, existing.title, existing.content, existing.version, now);

    const fields = Object.entries(updates)
      .filter(([, v]) => v !== undefined)
      .map(([k]) => `${k} = @${k}`)
      .join(', ');

    getDb()
      .prepare(`UPDATE documents SET ${fields}, version = @version, updated_at = @updated_at WHERE id = @id`)
      .run({ ...updates, version: newVersion, updated_at: now, id });

    return this.getById(id);
  },

  delete(id: string): boolean {
    const result = getDb().prepare('DELETE FROM documents WHERE id = ?').run(id);
    return result.changes > 0;
  },

  getVersions(documentId: string): DbDocumentVersion[] {
    return getDb()
      .prepare(
        'SELECT * FROM document_versions WHERE document_id = ? ORDER BY version DESC'
      )
      .all(documentId) as DbDocumentVersion[];
  },

  countByCategory(): Record<string, number> {
    const rows = getDb()
      .prepare('SELECT category, COUNT(*) as count FROM documents GROUP BY category')
      .all() as { category: string; count: number }[];
    return Object.fromEntries(rows.map((r) => [r.category, r.count]));
  },

  countBySubcategory(): Record<string, number> {
    const rows = getDb()
      .prepare(
        "SELECT category || '/' || subcategory as key, COUNT(*) as count FROM documents GROUP BY key"
      )
      .all() as { key: string; count: number }[];
    return Object.fromEntries(rows.map((r) => [r.key, r.count]));
  },
};
