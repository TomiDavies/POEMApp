import { ActivityItem, ActivitySourceMeta } from '@/lib/types';
import { ActivityConnector } from './types';
import { calendarConnector } from './calendar';
import { driveConnector } from './drive';
import { gmailConnector } from './gmail';
import { readaiConnector } from './readai';
import { notionConnector } from './notion';

export const CONNECTORS: ActivityConnector[] = [
  calendarConnector,
  driveConnector,
  gmailConnector,
  readaiConnector,
  notionConnector,
];

export function getConnectorMeta(): ActivitySourceMeta[] {
  return CONNECTORS.map(({ id, label, isLive }) => ({ id, label, isLive }));
}

export async function fetchAllActivity(): Promise<ActivityItem[]> {
  const results = await Promise.all(CONNECTORS.map((c) => c.fetchActivity()));
  return results
    .flat()
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
