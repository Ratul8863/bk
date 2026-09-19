'use client';

import { useState, type ReactNode } from 'react';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { CmsProvider, useCms } from './CmsProvider';

function AdminBanner() {
  const { apiAuthenticated } = useCms();
  if (apiAuthenticated) return null;
  return (
    <div className="border-b border-[#F0D4D4] bg-[#FFF8F8] px-4 py-2.5 text-center text-xs text-[#8A3B3B] sm:px-6">
      CMS is locked — open{' '}
      <a href="/admin/system" className="font-semibold underline">
        System &amp; data
      </a>{' '}
      to unlock editing.
    </div>
  );
}

export function AdminShell({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <CmsProvider>
      <div className="admin-root flex min-h-screen bg-[#EEF2F6] text-[#17212B]">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminBanner />
          <AdminHeader
            title={title}
            onMenuClick={() => setSidebarOpen(true)}
          />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </CmsProvider>
  );
}
