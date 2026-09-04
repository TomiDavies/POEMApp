import { ActivityItem } from '@/lib/types';
import { ActivityConnector, daysAgo } from './types';

/**
 * Sample data standing in for the Google Drive connector until OAuth is
 * wired up. Shape mirrors what a real fetchActivity() would return so the
 * live implementation is a drop-in swap.
 */
async function fetchActivity(): Promise<ActivityItem[]> {
  return [
    {
      id: 'drive-1',
      source: 'drive',
      poemCategory: 'milestones',
      project: 'POEM DDR — Product',
      title: 'POEM DDR v1.1 Release Notes',
      detail: 'Google Doc · edited by you',
      timestamp: daysAgo(1, 3),
      status: 'in_progress',
    },
    {
      id: 'drive-2',
      source: 'drive',
      poemCategory: 'proposition',
      project: 'DBA — Diaspora Trust Research',
      title: 'Lit Review Draft v4',
      detail: 'Google Doc · 41 comments open',
      timestamp: daysAgo(2, 8),
      status: 'in_progress',
    },
    {
      id: 'drive-3',
      source: 'drive',
      poemCategory: 'organisation',
      project: 'Portfolio: Fintech — Lagos',
      title: 'Cap Table — Sept 2026',
      detail: 'Google Sheet · shared by founder',
      timestamp: daysAgo(3, 12),
      status: 'info',
    },
    {
      id: 'drive-4',
      source: 'drive',
      poemCategory: 'administrative',
      project: 'NED Mandate — Impact Fund Board',
      title: 'Board Pack Q3 2026',
      detail: 'PDF · circulated by company secretary',
      timestamp: daysAgo(0, 6),
      status: 'needs_action',
    },
    {
      id: 'drive-5',
      source: 'drive',
      poemCategory: 'proposition',
      project: 'Ecosystem — Diaspora Angel Syndicate',
      title: 'Deal Pipeline Tracker',
      detail: 'Google Sheet · updated weekly',
      timestamp: daysAgo(5, 2),
      status: 'in_progress',
    },
  ];
}

export const driveConnector: ActivityConnector = {
  id: 'drive',
  label: 'Google Drive',
  isLive: false,
  fetchActivity,
};
