import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Document } from './types';
import { DbDocument } from './db';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseDbDocument(doc: DbDocument): Document {
  return {
    ...doc,
    tags: JSON.parse(doc.tags || '[]'),
    status: doc.status as Document['status'],
  };
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

export function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s*[-*+]\s/gm, '')
    .replace(/^\s*\d+\.\s/gm, '')
    .replace(/\n{2,}/g, ' ')
    .trim();
}

export const STATUS_CONFIG = {
  draft: { label: 'Draft', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  published: { label: 'Published', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  archived: { label: 'Archived', className: 'bg-slate-100 text-slate-600 border-slate-200' },
} as const;
