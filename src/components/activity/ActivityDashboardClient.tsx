'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  HardDrive,
  Mail,
  Video,
  NotebookText,
  AlertTriangle,
  RefreshCw,
  Info,
} from 'lucide-react';
import {
  ActivitySourceId,
  ActivitySourceMeta,
  CategoryActivitySummary,
  ProjectSummary,
} from '@/lib/types';
import { FocusItem } from '@/lib/activity';
import { POEM_FRAMEWORK, getCategoryById } from '@/lib/poem-framework';
import { Button } from '@/components/ui/Button';
import { cn, HEALTH_CONFIG, formatRelativeTime } from '@/lib/utils';

interface ActivityResponse {
  sources: ActivitySourceMeta[];
  categories: CategoryActivitySummary[];
  focus: FocusItem[];
}

const SOURCE_ICONS: Record<ActivitySourceId, typeof Calendar> = {
  calendar: Calendar,
  drive: HardDrive,
  gmail: Mail,
  readai: Video,
  notion: NotebookText,
};

export function ActivityDashboardClient() {
  const router = useRouter();
  const [data, setData] = useState<ActivityResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/activity');
      setData(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Activity</h1>
            <p className="text-slate-500 text-sm">
              Where every project stands, rolled up from Calendar, Drive, Gmail, Read.ai and
              Notion.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw size={13} className={cn(loading && 'animate-spin')} />
          </Button>
        </div>

        {/* Sample data banner */}
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg px-3 py-2 text-xs mb-6">
          <Info size={14} className="shrink-0" />
          <span>
            Showing sample data. Each source below is connector-ready but not yet authenticated
            — wire up OAuth per source to replace this with live activity.
          </span>
        </div>

        {/* Source strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {data?.sources.map((source) => {
            const Icon = SOURCE_ICONS[source.id];
            return (
              <div
                key={source.id}
                className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-slate-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-800 truncate">
                    {source.label}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {source.isLive ? 'Live' : 'Sample data'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Today's focus */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-500" />
            Needs Your Action
          </h2>
          {!data || data.focus.length === 0 ? (
            <div className="text-sm text-slate-400 bg-white border border-slate-200 rounded-xl p-6 text-center">
              Nothing outstanding across your connected sources.
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
              {data.focus.map((item) => {
                const Icon = SOURCE_ICONS[item.source];
                const category = getCategoryById(item.poemCategory);
                return (
                  <button
                    key={item.id}
                    onClick={() => router.push(`/dataroom?category=${item.poemCategory}`)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                  >
                    <Icon size={14} className="text-slate-400 shrink-0" />
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: category?.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-slate-800 truncate">{item.title}</div>
                      <div className="text-xs text-slate-400 truncate">
                        {item.project} · {item.detail}
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 shrink-0">
                      {item.ageDays === 0 ? 'today' : `${item.ageDays}d`}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Category breakdown */}
        <div>
          <h2 className="text-sm font-semibold text-slate-900 mb-4">By POEM Category</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {POEM_FRAMEWORK.map((category) => {
              const summary = data?.categories.find((c) => c.categoryId === category.id);
              return (
                <CategoryPanel
                  key={category.id}
                  categoryName={category.name}
                  categoryColor={category.color}
                  summary={summary}
                  onSelect={() => router.push(`/dataroom?category=${category.id}`)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryPanel({
  categoryName,
  categoryColor,
  summary,
  onSelect,
}: {
  categoryName: string;
  categoryColor: string;
  summary?: CategoryActivitySummary;
  onSelect: () => void;
}) {
  const health = HEALTH_CONFIG[summary?.health ?? 'stale'];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: categoryColor }} />
        <button onClick={onSelect} className="font-semibold text-sm text-slate-900 hover:text-indigo-600">
          {categoryName}
        </button>
        <span className={cn('ml-auto text-xs font-medium border rounded-full px-2 py-0.5', health.className)}>
          {health.label}
        </span>
      </div>

      {!summary || summary.projects.length === 0 ? (
        <p className="text-xs text-slate-400 py-2">No activity in this category yet.</p>
      ) : (
        <div className="space-y-2">
          {summary.projects.map((project) => (
            <ProjectRow key={`${project.project}-${project.poemCategory}`} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectRow({ project }: { project: ProjectSummary }) {
  const health = HEALTH_CONFIG[project.health];

  return (
    <div className="border border-slate-100 rounded-lg px-3 py-2">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xs font-medium text-slate-700 truncate flex-1">{project.project}</span>
        <span className={cn('text-[11px] font-medium border rounded-full px-1.5 py-0.5', health.className)}>
          {health.label}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {(Object.keys(SOURCE_ICONS) as ActivitySourceId[]).map((sourceId) => {
            const count = project.counts[sourceId];
            if (!count) return null;
            const Icon = SOURCE_ICONS[sourceId];
            return (
              <span key={sourceId} className="flex items-center gap-0.5 text-slate-400" title={sourceId}>
                <Icon size={11} />
                <span className="text-[11px]">{count}</span>
              </span>
            );
          })}
        </div>
        {project.lastActivityAt && (
          <span className="text-[11px] text-slate-400 shrink-0">
            {formatRelativeTime(project.lastActivityAt)}
          </span>
        )}
      </div>
    </div>
  );
}
