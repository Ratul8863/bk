'use client';

import { cn } from '@/lib/utils';

export type EditorTabId = 'content' | 'metadata' | 'media' | 'relations';

const TABS: { id: EditorTabId; label: string; hint: string }[] = [
  {
    id: 'content',
    label: 'Main details',
    hint: 'Title, summary, and the main text people read',
  },
  {
    id: 'metadata',
    label: 'Dates & extras',
    hint: 'Dates, place, author, and other facts',
  },
  {
    id: 'media',
    label: 'Photo',
    hint: 'Cover or featured image',
  },
  {
    id: 'relations',
    label: 'Links',
    hint: 'People involved, publications, and related records',
  },
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
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 border-b border-[#E2E8F0]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            title={tab.hint}
            onClick={() => onChange(tab.id)}
            className={cn(
              '-mb-px border-b-2 px-3 py-2.5 text-sm font-medium transition-colors',
              active === tab.id
                ? 'border-[#0B1F36] text-[#0B1F36]'
                : 'border-transparent text-[#5B6B7C] hover:text-[#0B1F36]',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-[#5B6B7C]">
        {tabs.find((t) => t.id === active)?.hint}
      </p>
    </div>
  );
}
