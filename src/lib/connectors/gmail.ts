import { ActivityItem } from '@/lib/types';
import { ActivityConnector, daysAgo } from './types';

/**
 * Sample data standing in for the Gmail connector until OAuth is wired up.
 * `detail` carries the thread state (unread / awaiting reply / replied with
 * next action / closed) since that is Gmail-specific and not worth adding
 * to the shared ActivityItem shape.
 */
async function fetchActivity(): Promise<ActivityItem[]> {
  return [
    {
      id: 'gmail-1',
      source: 'gmail',
      poemCategory: 'economics',
      project: 'POEM DDR — Product',
      title: 'Hosting renewal — invoice query',
      detail: 'Unread · from billing@vendor.example',
      timestamp: daysAgo(0, 5),
      status: 'needs_action',
    },
    {
      id: 'gmail-2',
      source: 'gmail',
      poemCategory: 'organisation',
      project: 'DBA — Diaspora Trust Research',
      title: 'Participant recruitment — cohort 3',
      detail: 'Awaiting your reply · sent 5 days ago',
      timestamp: daysAgo(5, 9),
      status: 'needs_action',
    },
    {
      id: 'gmail-3',
      source: 'gmail',
      poemCategory: 'economics',
      project: 'Portfolio: Fintech — Lagos',
      title: 'Bridge round — term sheet redline',
      detail: 'Awaiting your reply · sent 4 days ago',
      timestamp: daysAgo(4, 15),
      status: 'needs_action',
    },
    {
      id: 'gmail-4',
      source: 'gmail',
      poemCategory: 'organisation',
      project: 'NED Mandate — Impact Fund Board',
      title: 'Governance policy sign-off',
      detail: 'Unread · from company secretary',
      timestamp: daysAgo(1, 1),
      status: 'needs_action',
    },
    {
      id: 'gmail-5',
      source: 'gmail',
      poemCategory: 'economics',
      project: 'Ecosystem — Diaspora Angel Syndicate',
      title: 'Syndicate deal memo — Portfolio Co Y',
      detail: 'Replied · next action logged for Fri',
      timestamp: daysAgo(2, 10),
      status: 'in_progress',
    },
    {
      id: 'gmail-6',
      source: 'gmail',
      poemCategory: 'milestones',
      project: 'Portfolio: Fintech — Lagos',
      title: 'Q3 board meeting — thanks & follow-up',
      detail: 'Replied · closed',
      timestamp: daysAgo(4, 6),
      status: 'done',
    },
  ];
}

export const gmailConnector: ActivityConnector = {
  id: 'gmail',
  label: 'Gmail',
  isLive: false,
  fetchActivity,
};
