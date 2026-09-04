export type DocumentStatus = 'draft' | 'published' | 'archived';

export interface Document {
  id: string;
  title: string;
  content: string;
  category: string;
  subcategory: string;
  status: DocumentStatus;
  version: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  title: string;
  content: string;
  version: number;
  created_at: string;
}

export interface PoemCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  subcategories: PoemSubcategory[];
}

export interface PoemSubcategory {
  id: string;
  name: string;
  description: string;
  template: string;
}

export interface CreateDocumentInput {
  title: string;
  content: string;
  category: string;
  subcategory: string;
  status?: DocumentStatus;
  tags?: string[];
}

export interface UpdateDocumentInput {
  title?: string;
  content?: string;
  status?: DocumentStatus;
  tags?: string[];
}

// ─── Activity Dashboard ──────────────────────────────────────────────────

export type ActivitySourceId = 'calendar' | 'drive' | 'gmail' | 'readai' | 'notion';

export type ActivityItemStatus = 'needs_action' | 'in_progress' | 'done' | 'info';

/**
 * One unit of activity pulled from a connected tool. `poemCategory` maps the
 * item onto a POEM_FRAMEWORK category id so activity can roll up the same
 * way documents do; `project` is a free-text label for the engagement it
 * belongs to (a portfolio company, board mandate, or workstream).
 */
export interface ActivityItem {
  id: string;
  source: ActivitySourceId;
  poemCategory: string;
  project: string;
  title: string;
  detail?: string;
  timestamp: string;
  url?: string;
  status: ActivityItemStatus;
}

export interface ActivitySourceMeta {
  id: ActivitySourceId;
  label: string;
  isLive: boolean;
}

export type ProjectHealth = 'on_track' | 'attention' | 'stale';

export interface ProjectSummary {
  project: string;
  poemCategory: string;
  health: ProjectHealth;
  lastActivityAt: string | null;
  counts: Record<ActivitySourceId, number>;
  items: ActivityItem[];
}

export interface CategoryActivitySummary {
  categoryId: string;
  health: ProjectHealth;
  projects: ProjectSummary[];
  itemCount: number;
}
