import { ActivityItem } from '@/lib/types';
import { ActivityConnector, daysAgo } from './types';

/**
 * Sample data standing in for the Read.ai connector until its API key is
 * configured. Shape mirrors what a real fetchActivity() would return so the
 * live implementation is a drop-in swap.
 */
async function fetchActivity(): Promise<ActivityItem[]> {
  return [
    {
      id: 'readai-1',
      source: 'readai',
      poemCategory: 'milestones',
      project: 'POEM DDR — Product',
      title: 'POEM DDR Product Review',
      detail: '3 action items · 0 completed',
      timestamp: daysAgo(2, 4),
      status: 'needs_action',
    },
    {
      id: 'readai-2',
      source: 'readai',
      poemCategory: 'milestones',
      project: 'DBA — Diaspora Trust Research',
      title: 'Viva Prep Session',
      detail: '2 action items · 1 completed',
      timestamp: daysAgo(6, 13),
      status: 'in_progress',
    },
    {
      id: 'readai-3',
      source: 'readai',
      poemCategory: 'milestones',
      project: 'Portfolio: Fintech — Lagos',
      title: 'Q3 Board Meeting Notes',
      detail: 'No open action items',
      timestamp: daysAgo(4, 9),
      status: 'done',
    },
    {
      id: 'readai-4',
      source: 'readai',
      poemCategory: 'milestones',
      project: 'NED Mandate — Impact Fund Board',
      title: 'Audit Committee Minutes',
      detail: '1 action item · sign-off pending',
      timestamp: daysAgo(9, 10),
      status: 'needs_action',
    },
  ];
}

export const readaiConnector: ActivityConnector = {
  id: 'readai',
  label: 'Read.ai',
  isLive: false,
  fetchActivity,
};
