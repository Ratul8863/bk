'use client';

import { cn } from '@/lib/utils';

export type EditorTabId = 'content' | 'metadata' | 'media' | 'relations' | 'seo';

const TABS: { id: EditorTabId; label: string }[] = [
  { id: 'content', label: 'Content' },
  { id: 'metadata', label: 'Metadata' },
  { id: 'media', label: 'Media' },
  { id: 'relations', label: 'Relations' },
  { id: 'seo', label: 'SEO' },
];

export function EditorTabs({
  active,
  onChange,
  available,
}: {
  active: EditorTabId;
  onChange: (tab: EditorTabId) => void;
  available?: EditorTabId[];
}) {
  const tabs = available
    ? TABS.filter((t) => available.includes(t.id))
    : TABS;

  return (
    <div className="flex flex-wrap gap-1 border-b border-[#D9DEE5]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            '-mb-px border-b-2 px-3 py-2.5 text-sm font-medium transition-colors',
            active === tab.id
              ? 'border-[#173B6C] text-[#173B6C]'
              : 'border-transparent text-[#68727D] hover:text-[#0D2745]',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
