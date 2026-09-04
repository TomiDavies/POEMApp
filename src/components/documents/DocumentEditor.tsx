'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Save, Eye, Edit3, Tag, ChevronDown, History } from 'lucide-react';
import { Document, DocumentStatus, PoemCategory } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { cn, STATUS_CONFIG, formatDateTime } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocumentEditorProps {
  document: Document | null;
  category: PoemCategory;
  subcategoryId: string;
  template?: string;
  onSave: (data: { title: string; content: string; status: DocumentStatus; tags: string[] }) => Promise<void>;
  onClose: () => void;
}

type ViewMode = 'edit' | 'preview' | 'split';

export function DocumentEditor({
  document,
  category,
  subcategoryId,
  template,
  onSave,
  onClose,
}: DocumentEditorProps) {
  const [title, setTitle] = useState(document?.title ?? '');
  const [content, setContent] = useState(document?.content ?? template ?? '');
  const [status, setStatus] = useState<DocumentStatus>(document?.status ?? 'draft');
  const [tags, setTags] = useState<string[]>(document?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [versions, setVersions] = useState<Array<{ id: string; version: number; created_at: string }>>([]);

  useEffect(() => {
    if (document?.id) {
      fetch(`/api/documents/${document.id}/versions`)
        .then((r) => r.json())
        .then(setVersions)
        .catch(() => {});
    }
  }, [document?.id]);

  const handleSave = useCallback(async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onSave({ title, content, status, tags });
      setDirty(false);
    } finally {
      setSaving(false);
    }
  }, [title, content, status, tags, onSave]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      // Tab inserts spaces
      if (e.key === 'Tab') {
        e.preventDefault();
        const el = e.currentTarget;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const newContent = content.slice(0, start) + '  ' + content.slice(end);
        setContent(newContent);
        setTimeout(() => el.setSelectionRange(start + 2, start + 2), 0);
      }
    },
    [content, handleSave]
  );

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setDirty(true);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
    setDirty(true);
  };

  const subcategory = category.subcategories.find((s) => s.id === subcategoryId);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Editor Header */}
      <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-3 flex items-center gap-4">
        {/* Category breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <span>{category.name}</span>
          <span>/</span>
          <span>{subcategory?.name}</span>
        </div>

        {/* Title */}
        <input
          type="text"
          placeholder="Document title…"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setDirty(true); }}
          className="flex-1 text-base font-semibold text-slate-900 placeholder:text-slate-300 outline-none border-0 bg-transparent"
        />

        {/* Status */}
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className={cn(
              'flex items-center gap-1 text-xs font-medium border rounded-full px-2.5 py-1 transition-colors',
              STATUS_CONFIG[status].className
            )}
          >
            {STATUS_CONFIG[status].label}
            <ChevronDown size={12} />
          </button>
          {showStatusMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-10 min-w-[130px]">
              {(Object.keys(STATUS_CONFIG) as DocumentStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatus(s); setDirty(true); setShowStatusMenu(false); }}
                  className={cn(
                    'w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-slate-50 transition-colors',
                    STATUS_CONFIG[s].className.replace('border', 'border-0')
                  )}
                >
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View mode */}
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
          {(['edit', 'split', 'preview'] as ViewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium transition-colors capitalize',
                viewMode === m
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              {m === 'edit' ? <Edit3 size={13} /> : m === 'preview' ? <Eye size={13} /> : 'Split'}
            </button>
          ))}
        </div>

        {/* Version history */}
        {document && versions.length > 0 && (
          <button
            onClick={() => setShowVersions(!showVersions)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
          >
            <History size={14} />
            v{document.version}
          </button>
        )}

        {/* Save / Close */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            size="sm"
          >
            <Save size={13} />
            {saving ? 'Saving…' : dirty ? 'Save*' : 'Save'}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={14} />
          </Button>
        </div>
      </div>

      {/* Tags bar */}
      <div className="shrink-0 border-b border-slate-100 px-6 py-2 flex items-center gap-2">
        <Tag size={13} className="text-slate-400" />
        <div className="flex flex-wrap gap-1.5 flex-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs rounded-full px-2 py-0.5"
            >
              {tag}
              <button onClick={() => removeTag(tag)} className="hover:text-indigo-900">
                <X size={10} />
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Add tag…"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                addTag();
              }
            }}
            onBlur={addTag}
            className="text-xs outline-none bg-transparent text-slate-600 placeholder:text-slate-300 min-w-[80px]"
          />
        </div>
        {document && (
          <span className="text-xs text-slate-400 shrink-0">
            Updated {formatDateTime(document.updated_at)}
          </span>
        )}
      </div>

      {/* Editor area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Write pane */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div
            className={cn(
              'flex flex-col overflow-hidden',
              viewMode === 'split' ? 'w-1/2 border-r border-slate-200' : 'w-full'
            )}
          >
            <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-100 text-xs text-slate-500 font-medium">
              Markdown
            </div>
            <textarea
              value={content}
              onChange={(e) => { setContent(e.target.value); setDirty(true); }}
              onKeyDown={handleKeyDown}
              className="flex-1 p-6 font-mono text-sm text-slate-800 resize-none outline-none leading-relaxed bg-white placeholder:text-slate-300"
              placeholder="Start writing in Markdown…"
              spellCheck
            />
          </div>
        )}

        {/* Preview pane */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div
            className={cn(
              'flex flex-col overflow-hidden',
              viewMode === 'split' ? 'w-1/2' : 'w-full'
            )}
          >
            <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-100 text-xs text-slate-500 font-medium">
              Preview
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              <div className="prose prose-slate prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content || '*Nothing to preview yet*'}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Version history panel */}
      {showVersions && versions.length > 0 && (
        <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-6 py-3">
          <div className="flex items-center gap-2 mb-2">
            <History size={13} className="text-slate-500" />
            <span className="text-xs font-medium text-slate-700">Version History</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {versions.map((v) => (
              <div
                key={v.id}
                className="shrink-0 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600"
              >
                <div className="font-medium">v{v.version}</div>
                <div className="text-slate-400">{formatDateTime(v.created_at)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
