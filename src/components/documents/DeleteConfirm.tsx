'use client';

import { Button } from '@/components/ui/Button';
import { Trash2, X } from 'lucide-react';

interface DeleteConfirmProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirm({ title, onConfirm, onCancel }: DeleteConfirmProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <Trash2 size={18} className="text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Delete document?</h3>
            <p className="text-sm text-slate-600 mt-1">
              &ldquo;{title}&rdquo; will be permanently deleted. This cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            <X size={13} /> Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>
            <Trash2 size={13} /> Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
