import { Suspense } from 'react';
import { DataRoomClient } from '@/components/documents/DataRoomClient';

export default function DataRoomPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Loading…</div>}>
      <DataRoomClient />
    </Suspense>
  );
}
