import { Suspense } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { documentsDb } from '@/lib/db';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
