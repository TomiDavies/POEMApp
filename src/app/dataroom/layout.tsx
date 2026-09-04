import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { documentsDb } from '@/lib/db';
import { hasValidSession } from '@/lib/session';

export default async function DataRoomLayout({ children }: { children: React.ReactNode }) {
  if (!(await hasValidSession())) {
    redirect('/login');
  }

  const byCat = documentsDb.countByCategory();
  const bySub = documentsDb.countBySubcategory();
  const counts = { ...byCat, ...bySub };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Suspense>
        <Sidebar counts={counts} />
      </Suspense>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 flex overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
