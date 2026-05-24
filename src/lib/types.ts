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
