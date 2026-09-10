'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminNavGroups } from './admin-nav';

export function AdminSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const base = href.split('?')[0];
    if (base === '/admin') return pathname === '/admin';
    return pathname === base || pathname.startsWith(`${base}/`);
  };

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-[#0D2745]/40 lg:hidden',
          open ? 'block' : 'hidden',
        )}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#D9DEE5] bg-[#F8F7F3] transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-[#D9DEE5] px-4">
          <Link href="/admin" className="min-w-0" onClick={onClose}>
            <div className="truncate font-[family-name:var(--font-admin-display)] text-lg text-[#0D2745]">
              BKSR
            </div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-[#68727D]">
              Content Studio
            </div>
          </Link>
          <button
            type="button"
            className="rounded-md p-1.5 text-[#68727D] hover:bg-[#F6F4EE] lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav data-lenis-prevent className="flex-1 overflow-y-auto px-3 py-4">
          {adminNavGroups.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9AA3A5]">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <li key={`${group.label}-${item.href}-${item.label}`}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors',
                          active
                            ? 'bg-[#E4F0EB] font-medium text-[#173B6C]'
                            : 'text-[#242B2D] hover:bg-[#F6F4EE]',
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0 opacity-80" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-[#D9DEE5] p-3 text-xs text-[#68727D]">
          Demo CMS — changes stay in this browser
        </div>
      </aside>
    </>
  );
}
