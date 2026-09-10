'use client';

import Link from 'next/link';
import { ExternalLink, Menu } from 'lucide-react';

export function AdminHeader({
  title,
  onMenuClick,
}: {
  title?: string;
  onMenuClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#D9DEE5] bg-[#F6F4EE]/90 px-4 backdrop-blur">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-md p-2 text-[#0D2745] hover:bg-white lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[#0D2745]">
          {title ?? 'BK School of Research'}
        </p>
        <p className="truncate text-xs text-[#68727D]">
          Content Studio · frontend demo (browser storage)
        </p>
      </div>
      <Link
        href="/"
        target="_blank"
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9DEE5] bg-white px-3 py-1.5 text-xs font-medium text-[#0D2745] hover:bg-[#F8F7F3]"
      >
        View site
        <ExternalLink className="h-3.5 w-3.5" />
      </Link>
      <div
        className="hidden items-center gap-2 rounded-full border border-[#D9DEE5] bg-white px-2.5 py-1 sm:flex"
        title="Demo mode — no authentication"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#173B6C] text-[10px] font-semibold text-white">
          ED
        </span>
        <span className="text-xs text-[#68727D]">Editor (demo)</span>
      </div>
    </header>
  );
}
