'use client';

import { useState, type ReactNode } from 'react';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { CmsProvider } from './CmsProvider';

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
      <div className="admin-root flex min-h-screen bg-[#F6F4EE] text-[#242B2D]">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="border-b border-[#D9DEE5] bg-[#EAF0F6] px-4 py-2 text-center text-xs text-[#242B2D] sm:px-6">
            Demo Content Studio — changes stay in this browser until a backend is connected.
          </div>
          <AdminHeader
            title={title}
            onMenuClick={() => setSidebarOpen(true)}
          />
          <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </CmsProvider>
  );
}
