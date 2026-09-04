import {
  ActivityItem,
  ActivitySourceId,
  CategoryActivitySummary,
  ProjectHealth,
  ProjectSummary,
} from '@/lib/types';
import { POEM_FRAMEWORK } from '@/lib/poem-framework';
import { fetchAllActivity } from '@/lib/connectors';

const EMPTY_COUNTS: Record<ActivitySourceId, number> = {
  calendar: 0,
  drive: 0,
  gmail: 0,
  readai: 0,
  notion: 0,
};

const ATTENTION_AFTER_DAYS = 3;
const STALE_AFTER_DAYS = 21;

function daysSince(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24);
}

/**
 * A project/category grouping needs attention if it is carrying an open
 * action older than ATTENTION_AFTER_DAYS, and is stale if nothing has moved
 * in STALE_AFTER_DAYS regardless of open actions. Otherwise it's on track.
 * This is a transparent, explainable heuristic — not a scoring model — by
 * design, so the "why" behind a status is always a re-derivable fact.
 */
function computeHealth(items: ActivityItem[]): ProjectHealth {
  if (items.length === 0) return 'stale';

  const mostRecent = items.reduce(
    (max, item) => Math.max(max, new Date(item.timestamp).getTime()),
    0
  );
  const idleDays = (Date.now() - mostRecent) / (1000 * 60 * 60 * 24);

  const hasAgingAction = items.some(
    (item) => item.status === 'needs_action' && daysSince(item.timestamp) >= ATTENTION_AFTER_DAYS
  );
  if (hasAgingAction) return 'attention';

  if (idleDays > STALE_AFTER_DAYS) return 'stale';

  return 'on_track';
}

function worstHealth(healths: ProjectHealth[]): ProjectHealth {
  if (healths.includes('attention')) return 'attention';
  if (healths.length > 0 && healths.every((h) => h === 'stale')) return 'stale';
  if (healths.includes('stale')) return 'attention';
  return 'on_track';
}

export async function getCategoryActivitySummaries(): Promise<CategoryActivitySummary[]> {
  const allItems = await fetchAllActivity();

  // Group by project + poemCategory pair, since one project's activity can
  // legitimately span more than one POEM category.
  const groups = new Map<string, ProjectSummary>();
  for (const item of allItems) {
    const key = `${item.project}::${item.poemCategory}`;
    let group = groups.get(key);
    if (!group) {
      group = {
        project: item.project,
        poemCategory: item.poemCategory,
        health: 'on_track',
        lastActivityAt: null,
        counts: { ...EMPTY_COUNTS },
        items: [],
      };
      groups.set(key, group);
    }
    group.items.push(item);
    group.counts[item.source] += 1;
    if (!group.lastActivityAt || item.timestamp > group.lastActivityAt) {
      group.lastActivityAt = item.timestamp;
    }
  }

  for (const group of groups.values()) {
    group.items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    group.health = computeHealth(group.items);
  }

  const projectSummaries = Array.from(groups.values());

  return POEM_FRAMEWORK.map((category) => {
    const projects = projectSummaries
      .filter((p) => p.poemCategory === category.id)
      .sort((a, b) => (b.lastActivityAt ?? '').localeCompare(a.lastActivityAt ?? ''));

    return {
      categoryId: category.id,
      health: worstHealth(projects.map((p) => p.health)),
      projects,
      itemCount: projects.reduce((sum, p) => sum + p.items.length, 0),
    };
  });
}

export interface FocusItem extends ActivityItem {
  ageDays: number;
}

/** Cross-source, sorted list of everything currently flagged needs_action — the SMART "do next" list. */
export async function getTodayFocus(): Promise<FocusItem[]> {
  const allItems = await fetchAllActivity();
  return allItems
    .filter((item) => item.status === 'needs_action')
    .map((item) => ({ ...item, ageDays: Math.max(0, Math.floor(daysSince(item.timestamp))) }))
    .sort((a, b) => b.ageDays - a.ageDays);
}
