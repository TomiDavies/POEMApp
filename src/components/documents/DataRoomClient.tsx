'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Plus, Search, Trash2, Edit3, RefreshCw, X } from 'lucide-react';
import { Document, DocumentStatus, PoemCategory } from '@/lib/types';
import {
  POEM_FRAMEWORK,
  ADMINISTRATIVE_SECTION,
  DATA_ROOM_SECTIONS,
  getCategoryById,
  getSubcategoryById,
} from '@/lib/poem-framework';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { DocumentEditor } from '@/components/documents/DocumentEditor';
import { DeleteConfirm } from '@/components/documents/DeleteConfirm';
import { Button } from '@/components/ui/Button';
import { cn, STATUS_CONFIG, formatDateTime } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Stats {
  total: number;
  byCategory: Record<string, number>;
  bySubcategory: Record<string, number>;
  recent: Document[];
}

export function DataRoomClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryId = searchParams.get('category');
  const subcategoryId = searchParams.get('subcategory');
  const searchQuery = searchParams.get('search');

  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [editorCategory, setEditorCategory] = useState<PoemCategory | null>(null);
  const [editorSubcategory, setEditorSubcategory] = useState<string>('');

  const [deleteDoc, setDeleteDoc] = useState<Document | null>(null);
  const [viewingDoc, setViewingDoc] = useState<Document | null>(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      let url = '/api/documents';
      if (searchQuery) {
        url = `/api/documents/search?q=${encodeURIComponent(searchQuery)}`;
      } else if (categoryId && subcategoryId) {
        url = `/api/documents?category=${categoryId}&subcategory=${subcategoryId}`;
      } else if (categoryId) {
        url = `/api/documents?category=${categoryId}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setDocuments(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, [categoryId, subcategoryId, searchQuery]);

  const fetchStats = useCallback(async () => {
    const res = await fetch('/api/stats');
    const data = await res.json();
    setStats(data);
  }, []);

  useEffect(() => {
    fetchDocuments();
    fetchStats();
  }, [fetchDocuments, fetchStats]);

  const openEditor = (doc?: Document, catId?: string, subId?: string) => {
    const cId = catId ?? categoryId ?? POEM_FRAMEWORK[0].id;
    const sId = subId ?? subcategoryId ?? POEM_FRAMEWORK[0].subcategories[0].id;
    const cat = getCategoryById(cId);
    if (!cat) return;
    setEditorCategory(cat);
    setEditorSubcategory(sId);
    setEditingDoc(doc ?? null);
    setEditorOpen(true);
  };

  const handleSave = async (data: {
    title: string;
    content: string;
    status: DocumentStatus;
    tags: string[];
  }) => {
    if (editingDoc) {
      const res = await fetch(`/api/documents/${editingDoc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const updated = await res.json();
      setDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      if (viewingDoc?.id === updated.id) setViewingDoc(updated);
    } else {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          category: editorCategory!.id,
          subcategory: editorSubcategory,
        }),
      });
      const created = await res.json();
      setDocuments((prev) => [created, ...prev]);
    }
    await fetchStats();
  };

  const handleDelete = async () => {
    if (!deleteDoc) return;
    await fetch(`/api/documents/${deleteDoc.id}`, { method: 'DELETE' });
    setDocuments((prev) => prev.filter((d) => d.id !== deleteDoc.id));
    if (viewingDoc?.id === deleteDoc.id) setViewingDoc(null);
    setDeleteDoc(null);
    await fetchStats();
  };

  const category = categoryId ? getCategoryById(categoryId) : null;
  const subcategory =
    categoryId && subcategoryId
      ? getSubcategoryById(categoryId, subcategoryId)
      : null;

  // ─── Overview / Dashboard ─────────────────────────────────────────────────
  if (!categoryId && !searchQuery) {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Data Room</h1>
            <p className="text-slate-500 text-sm">
              Manage your startup documents across the POEM Framework&reg;.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Documents" value={stats?.total ?? 0} />
            {POEM_FRAMEWORK.slice(0, 3).map((cat) => (
              <StatCard
                key={cat.id}
                label={cat.name}
                value={stats?.byCategory[cat.id] ?? 0}
                color={cat.color}
              />
            ))}
          </div>

          {/* Quick create */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Quick Create</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {DATA_ROOM_SECTIONS.map((cat) =>
                cat.subcategories.map((sub) => (
                  <button
                    key={`${cat.id}-${sub.id}`}
                    onClick={() => openEditor(undefined, cat.id, sub.id)}
                    className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left group"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <div>
                      <div className="text-xs font-medium text-slate-700 group-hover:text-indigo-700">
                        {sub.name}
                      </div>
                      <div className="text-xs text-slate-400">{cat.name}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Recent documents */}
          {stats?.recent && stats.recent.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Recently Updated</h2>
              <div className="grid gap-3">
                {stats.recent.map((doc) => {
                  const cat = getCategoryById(doc.category);
                  return (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      categoryColor={cat?.color}
                      onClick={() => setViewingDoc(doc)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* The five pillars */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">POEM Framework&reg;</h2>
            <p className="text-xs text-slate-500 mb-4">
              Five pillars: Vision, Proposition, Organisation, Economics, Milestones.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {POEM_FRAMEWORK.map((cat) => (
                <SectionCard
                  key={cat.id}
                  category={cat}
                  count={stats?.byCategory[cat.id] ?? 0}
                  onClick={() => router.push(`/dataroom?category=${cat.id}`)}
                />
              ))}
            </div>
          </div>

          {/* Administrative sits outside the framework */}
          <div>
            <h2 className="text-sm font-semibold text-slate-900 mb-1">Data Room</h2>
            <p className="text-xs text-slate-500 mb-4">
              Supporting material. Not a framework pillar.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <SectionCard
                category={ADMINISTRATIVE_SECTION}
                count={stats?.byCategory[ADMINISTRATIVE_SECTION.id] ?? 0}
                onClick={() =>
                  router.push(`/dataroom?category=${ADMINISTRATIVE_SECTION.id}`)
                }
              />
            </div>
          </div>
        </div>

        {editorOpen && editorCategory && (
          <DocumentEditor
            document={editingDoc}
            category={editorCategory}
            subcategoryId={editorSubcategory}
            template={getSubcategoryById(editorCategory.id, editorSubcategory)?.template}
            onSave={handleSave}
            onClose={() => { setEditorOpen(false); setEditingDoc(null); }}
          />
        )}
        {deleteDoc && (
          <DeleteConfirm
            title={deleteDoc.title}
            onConfirm={handleDelete}
            onCancel={() => setDeleteDoc(null)}
          />
        )}
        {viewingDoc && (
          <DocumentViewer
            document={viewingDoc}
            categoryColor={getCategoryById(viewingDoc.category)?.color}
            onEdit={() => openEditor(viewingDoc, viewingDoc.category, viewingDoc.subcategory)}
            onDelete={() => { setDeleteDoc(viewingDoc); setViewingDoc(null); }}
            onClose={() => setViewingDoc(null)}
          />
        )}
      </div>
    );
  }

  // ─── Category / Subcategory / Search view ─────────────────────────────────
  const heading = searchQuery
    ? `Search: "${searchQuery}"`
    : subcategory
    ? subcategory.name
    : category?.name ?? 'All Documents';

  const subheading = searchQuery
    ? `${documents.length} result${documents.length !== 1 ? 's' : ''} found`
    : subcategory?.description ?? category?.description ?? '';

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {category && (
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                )}
                {searchQuery && <Search size={16} className="text-slate-500" />}
                <h1 className="text-xl font-bold text-slate-900">{heading}</h1>
              </div>
              {subheading && (
                <p className="text-sm text-slate-500">{subheading}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={fetchDocuments} disabled={loading}>
                <RefreshCw size={13} className={cn(loading && 'animate-spin')} />
              </Button>
              {(categoryId || subcategoryId) && (
                <Button
                  size="sm"
                  onClick={() =>
                    openEditor(
                      undefined,
                      categoryId ?? POEM_FRAMEWORK[0].id,
                      subcategoryId ??
                        getCategoryById(categoryId ?? '')?.subcategories[0].id ??
                        ''
                    )
                  }
                >
                  <Plus size={14} />
                  New Document
                </Button>
              )}
            </div>
          </div>

          {/* Subcategory tabs */}
          {category && !subcategoryId && !searchQuery && (
            <div className="flex flex-wrap gap-2 mb-6">
              {category.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() =>
                    router.push(`/dataroom?category=${category.id}&subcategory=${sub.id}`)
                  }
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:border-slate-300 transition-colors"
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}

          {/* Documents */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-24 bg-slate-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <EmptyState
              categoryId={categoryId ?? undefined}
              subcategoryId={subcategoryId ?? undefined}
              searchQuery={searchQuery ?? undefined}
              onNew={() =>
                openEditor(
                  undefined,
                  categoryId ?? POEM_FRAMEWORK[0].id,
                  subcategoryId ??
                    getCategoryById(categoryId ?? '')?.subcategories[0].id ??
                    ''
                )
              }
            />
          ) : (
            <div className="grid gap-3">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  categoryColor={getCategoryById(doc.category)?.color}
                  onClick={() => setViewingDoc(doc)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {editorOpen && editorCategory && (
        <DocumentEditor
          document={editingDoc}
          category={editorCategory}
          subcategoryId={editorSubcategory}
          template={getSubcategoryById(editorCategory.id, editorSubcategory)?.template}
          onSave={handleSave}
          onClose={() => { setEditorOpen(false); setEditingDoc(null); }}
        />
      )}
      {deleteDoc && (
        <DeleteConfirm
          title={deleteDoc.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteDoc(null)}
        />
      )}
      {viewingDoc && (
        <DocumentViewer
          document={viewingDoc}
          categoryColor={getCategoryById(viewingDoc.category)?.color}
          onEdit={() => openEditor(viewingDoc, viewingDoc.category, viewingDoc.subcategory)}
          onDelete={() => { setDeleteDoc(viewingDoc); setViewingDoc(null); }}
          onClose={() => setViewingDoc(null)}
        />
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionCard({
  category,
  count,
  onClick,
}: {
  category: PoemCategory;
  count: number;
  onClick: () => void;
}) {
  return (
    <div
      className="bg-white border border-slate-200 rounded-xl p-4 cursor-pointer hover:border-slate-300 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        <span className="font-semibold text-sm text-slate-900">{category.name}</span>
        <span className="text-xs text-slate-400 ml-auto">{count} docs</span>
      </div>
      <p className="text-xs text-slate-500 mb-3">{category.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {category.subcategories.map((sub) => (
          <span
            key={sub.id}
            className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
          >
            {sub.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      {color && <div className="w-2 h-2 rounded-full mb-3" style={{ backgroundColor: color }} />}
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}

function EmptyState({
  categoryId,
  subcategoryId,
  searchQuery,
  onNew,
}: {
  categoryId?: string;
  subcategoryId?: string;
  searchQuery?: string;
  onNew: () => void;
}) {
  if (searchQuery) {
    return (
      <div className="text-center py-16">
        <Search size={32} className="mx-auto text-slate-300 mb-3" />
        <p className="text-slate-600 font-medium mb-1">No results found</p>
        <p className="text-slate-400 text-sm">Try a different search term</p>
      </div>
    );
  }

  const sub =
    categoryId && subcategoryId ? getSubcategoryById(categoryId, subcategoryId) : null;

  return (
    <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
        <Plus size={22} className="text-indigo-500" />
      </div>
      <p className="text-slate-700 font-medium mb-1">
        {sub ? `No ${sub.name} documents yet` : 'No documents yet'}
      </p>
      <p className="text-slate-400 text-sm mb-4">
        {sub ? sub.description : 'Start adding documents to this section'}
      </p>
      {(categoryId || subcategoryId) && (
        <Button size="sm" onClick={onNew}>
          <Plus size={14} />
          Create First Document
        </Button>
      )}
    </div>
  );
}

function DocumentViewer({
  document,
  categoryColor,
  onEdit,
  onDelete,
  onClose,
}: {
  document: Document;
  categoryColor?: string;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const category = getCategoryById(document.category);
  const subcategory = getSubcategoryById(document.category, document.subcategory);
  const status = STATUS_CONFIG[document.status];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 flex items-start justify-between gap-4 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: categoryColor }}
              />
              <span>{category?.name}</span>
              <span>/</span>
              <span>{subcategory?.name}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">{document.title}</h2>
            <div className="flex items-center flex-wrap gap-2 mt-1">
              <span
                className={cn(
                  'text-xs font-medium border rounded-full px-2 py-0.5',
                  status.className
                )}
              >
                {status.label}
              </span>
              <span className="text-xs text-slate-400">
                v{document.version} · Updated {formatDateTime(document.updated_at)}
              </span>
              {document.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="secondary" size="sm" onClick={onEdit}>
              <Edit3 size={13} /> Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={13} />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={14} />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="prose prose-slate prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {document.content || '*No content yet. Click Edit to start writing.*'}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
