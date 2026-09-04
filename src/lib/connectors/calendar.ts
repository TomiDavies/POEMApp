import { ActivityItem } from '@/lib/types';
import { ActivityConnector, daysAgo, daysFromNow } from './types';

/**
 * Sample data standing in for the Google Calendar connector until OAuth is
 * wired up. Shape mirrors what a real fetchActivity() would return so the
 * live implementation is a drop-in swap.
 */
async function fetchActivity(): Promise<ActivityItem[]> {
  return [
    {
      id: 'cal-1',
      source: 'calendar',
      poemCategory: 'organisation',
      project: 'POEM DDR — Product',
      title: 'Sprint planning — Activity Dashboard',
      detail: 'Internal, 30 min',
      timestamp: daysFromNow(1, 9),
      status: 'info',
    },
    {
      id: 'cal-2',
      source: 'calendar',
      poemCategory: 'vision',
      project: 'DBA — Diaspora Trust Research',
      title: 'Supervisor check-in',
      detail: 'Progress review + viva prep scope',
      timestamp: daysFromNow(2, 14),
      status: 'needs_action',
    },
    {
      id: 'cal-3',
      source: 'calendar',
      poemCategory: 'milestones',
      project: 'Portfolio: Fintech — Lagos',
      title: 'Board observer call',
      detail: 'Bridge round update from founder',
      timestamp: daysFromNow(3, 16),
      status: 'info',
    },
    {
      id: 'cal-4',
      source: 'calendar',
      poemCategory: 'milestones',
      project: 'NED Mandate — Impact Fund Board',
      title: 'Board Meeting — Audit Committee',
      detail: 'Quarterly, papers due 48h prior',
      timestamp: daysFromNow(5, 10),
      status: 'needs_action',
    },
    {
      id: 'cal-5',
      source: 'calendar',
      poemCategory: 'organisation',
      project: 'Ecosystem — Diaspora Angel Syndicate',
      title: 'Syndicate intro call — new LP',
      detail: 'Warm intro via network',
      timestamp: daysFromNow(6, 11),
      status: 'info',
    },
    {
      id: 'cal-6',
      source: 'calendar',
      poemCategory: 'milestones',
      project: 'Portfolio: Fintech — Lagos',
      title: 'Q3 Board Meeting',
      detail: 'Held — see Read.ai notes',
      timestamp: daysAgo(4, 9),
      status: 'done',
    },
  ];
}

export const calendarConnector: ActivityConnector = {
  id: 'calendar',
  label: 'Google Calendar',
  isLive: false,
  fetchActivity,
};
