import { Suspense } from 'react';
import { ActivityDashboardClient } from '@/components/activity/ActivityDashboardClient';

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Loading…</div>}>
      <ActivityDashboardClient />
    </Suspense>
  );
}
