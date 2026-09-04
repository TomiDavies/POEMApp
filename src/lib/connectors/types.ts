import { ActivityItem, ActivitySourceId } from '@/lib/types';

/**
 * Contract every activity source implements. `isLive` is false for every
 * connector until it is wired to a real OAuth-authenticated API client —
 * the dashboard uses it to label data as sample vs. live so nobody mistakes
 * one for the other.
 */
export interface ActivityConnector {
  id: ActivitySourceId;
  label: string;
  isLive: boolean;
  fetchActivity(): Promise<ActivityItem[]>;
}

export function daysAgo(days: number, hours = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

export function daysFromNow(days: number, hours = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}
