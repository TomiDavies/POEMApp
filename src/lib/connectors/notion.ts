import { ActivityItem } from '@/lib/types';
import { ActivityConnector, daysAgo } from './types';

/**
 * Sample data standing in for the Notion connector until its integration
 * token is configured. Shape mirrors what a real fetchActivity() would
 * return so the live implementation is a drop-in swap.
 */
async function fetchActivity(): Promise<ActivityItem[]> {
  return [
    {
      id: 'notion-1',
      source: 'notion',
      poemCategory: 'vision',
      project: 'POEM DDR — Product',
      title: 'POEM DDR — Roadmap 2026',
      detail: 'Edited 1 day ago',
      timestamp: daysAgo(1, 2),
      status: 'info',
    },
    {
      id: 'notion-2',
      source: 'notion',
      poemCategory: 'proposition',
      project: 'DBA — Diaspora Trust Research',
      title: 'Artefact-Mediated Trust — Coding Framework',
      detail: 'Edited 3 days ago',
      timestamp: daysAgo(3, 7),
      status: 'in_progress',
    },
    {
      id: 'notion-3',
      source: 'notion',
      poemCategory: 'economics',
      project: 'Portfolio: Fintech — Lagos',
      title: 'Fintech Lagos — Risk Register',
      detail: 'Edited 10 days ago',
      timestamp: daysAgo(10, 1),
      status: 'info',
    },
    {
      id: 'notion-4',
      source: 'notion',
      poemCategory: 'administrative',
      project: 'NED Mandate — Impact Fund Board',
      title: 'NED Mandate — Conflicts Register',
      detail: 'Edited 18 days ago — due a refresh',
      timestamp: daysAgo(18, 0),
      status: 'needs_action',
    },
    {
      id: 'notion-5',
      source: 'notion',
      poemCategory: 'vision',
      project: 'Ecosystem — Diaspora Angel Syndicate',
      title: 'Syndicate Thesis v2',
      detail: 'Edited 2 days ago',
      timestamp: daysAgo(2, 5),
      status: 'info',
    },
  ];
}

export const notionConnector: ActivityConnector = {
  id: 'notion',
  label: 'Notion',
  isLive: false,
  fetchActivity,
};
