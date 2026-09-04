'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/app/login/actions';

export function Header() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/dataroom?search=${encodeURIComponent(query.trim())}`);
      }
    },
    [query, router]
  );

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center px-6 gap-4 shrink-0">
      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <div
          className={cn(
            'flex items-center gap-2 border rounded-lg px-3 py-1.5 transition-colors',
            focused ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-slate-200 bg-slate-50'
          )}
        >
          <Search size={15} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search documents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </form>
      <form action={logout}>
        <button
          type="submit"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </form>
    </header>
  );
}
