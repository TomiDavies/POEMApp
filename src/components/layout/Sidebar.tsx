'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Activity,
  ChevronDown,
  ChevronRight,
  FileText,
  LayoutDashboard,
} from 'lucide-react';
import { POEM_FRAMEWORK, ADMINISTRATIVE_SECTION } from '@/lib/poem-framework';
import { PoemCategory } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SidebarProps {
  counts?: Record<string, number>;
}

export function Sidebar({ counts = {} }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');
  const currentSubcategory = searchParams.get('subcategory');

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (currentCategory) initial[currentCategory] = true;
    return initial;
  });

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isHome = pathname === '/' || (pathname === '/dataroom' && !currentCategory);
  const isActivity = pathname === '/dashboard';

  return (
    <aside className="w-64 shrink-0 bg-slate-900 text-slate-100 flex flex-col h-full overflow-y-auto">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
            P
          </div>
          <div>
            <div className="text-sm font-semibold text-white leading-tight">POEM DataRoom</div>
            <div className="text-xs text-slate-400">Founder Intelligence</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5">
        {/* Dashboard */}
        <Link
          href="/dataroom"
          className={cn(
            'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors',
            isHome
              ? 'bg-indigo-600 text-white'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          )}
        >
          <LayoutDashboard size={16} />
          Overview
        </Link>

        <Link
          href="/dashboard"
          className={cn(
            'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors mt-0.5',
            isActivity
              ? 'bg-indigo-600 text-white'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          )}
        >
          <Activity size={16} />
          Activity
        </Link>

        {/* The five POEM Framework® pillars */}
        <div className="pt-2">
          <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            POEM Framework&reg;
          </div>
          {POEM_FRAMEWORK.map((category) => (
            <CategoryNav
              key={category.id}
              category={category}
              counts={counts}
              isOpen={!!expanded[category.id]}
              onToggle={() => toggle(category.id)}
              isCatActive={currentCategory === category.id}
              currentSubcategory={currentSubcategory}
            />
          ))}
        </div>

        {/* Administrative is a data room container, not a framework pillar */}
        <div className="pt-3">
          <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Data Room
          </div>
          <CategoryNav
            category={ADMINISTRATIVE_SECTION}
            counts={counts}
            isOpen={!!expanded[ADMINISTRATIVE_SECTION.id]}
            onToggle={() => toggle(ADMINISTRATIVE_SECTION.id)}
            isCatActive={currentCategory === ADMINISTRATIVE_SECTION.id}
            currentSubcategory={currentSubcategory}
          />
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <p className="text-xs text-slate-600 text-center">POEM Framework&reg; v1.0</p>
      </div>
    </aside>
  );
}

function CategoryNav({
  category,
  counts,
  isOpen,
  onToggle,
  isCatActive,
  currentSubcategory,
}: {
  category: PoemCategory;
  counts: Record<string, number>;
  isOpen: boolean;
  onToggle: () => void;
  isCatActive: boolean;
  currentSubcategory: string | null;
}) {
  const catCount = counts[category.id] ?? 0;

  return (
    <div className="mt-0.5">
      <button
        onClick={onToggle}
        className={cn(
          'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left',
          isCatActive
            ? 'text-white'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        )}
      >
        {/* Color dot */}
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: category.color }}
        />
        <span className="flex-1 truncate">{category.name}</span>
        {catCount > 0 && (
          <span className="text-xs text-slate-500 font-normal">{catCount}</span>
        )}
        {isOpen ? (
          <ChevronDown size={14} className="text-slate-500 shrink-0" />
        ) : (
          <ChevronRight size={14} className="text-slate-500 shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="ml-4 mt-0.5 space-y-0.5 border-l border-slate-800 pl-3">
          {/* Category-level link */}
          <Link
            href={`/dataroom?category=${category.id}`}
            className={cn(
              'flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors',
              isCatActive && !currentSubcategory
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            )}
          >
            <LayoutDashboard size={12} />
            All {category.name}
          </Link>

          {/* Subcategories */}
          {category.subcategories.map((sub) => {
            const isSubActive = isCatActive && currentSubcategory === sub.id;
            const subCount = counts[`${category.id}/${sub.id}`] ?? 0;

            return (
              <Link
                key={sub.id}
                href={`/dataroom?category=${category.id}&subcategory=${sub.id}`}
                className={cn(
                  'flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors',
                  isSubActive
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                )}
              >
                <FileText size={12} className="shrink-0" />
                <span className="flex-1 truncate">{sub.name}</span>
                {subCount > 0 && (
                  <span className="text-slate-600 text-xs">{subCount}</span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
