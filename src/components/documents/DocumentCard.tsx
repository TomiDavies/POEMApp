'use client';

import { Document } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { STATUS_CONFIG, formatDate, stripMarkdown, truncate, cn } from '@/lib/utils';
import { FileText, Clock } from 'lucide-react';

interface DocumentCardProps {
  document: Document;
  categoryColor?: string;
  onClick: () => void;
}

export function DocumentCard({ document, categoryColor, onClick }: DocumentCardProps) {
  const excerpt = truncate(stripMarkdown(document.content), 120);
  const status = STATUS_CONFIG[document.status];

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <FileText
            size={15}
            className="shrink-0 text-slate-400 group-hover:text-indigo-500 transition-colors"
            style={categoryColor ? { color: categoryColor } : undefined}
          />
          <span className="font-medium text-sm text-slate-900 truncate">
            {document.title}
          </span>
        </div>
        <Badge className={cn('shrink-0', status.className)}>
          {status.label}
        </Badge>
      </div>

      {excerpt && (
        <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">
          {excerpt}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <Clock size={11} />
          <span>{formatDate(document.updated_at)}</span>
        </div>
        <div className="flex items-center gap-2">
          {document.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
          {document.tags.length > 2 && (
            <span className="text-slate-400 text-xs">+{document.tags.length - 2}</span>
          )}
          <span className="text-slate-300">v{document.version}</span>
        </div>
      </div>
    </button>
  );
}
