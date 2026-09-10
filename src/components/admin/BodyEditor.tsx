'use client';

import { useRef } from 'react';
import { Bold, Heading2, Italic } from 'lucide-react';
import { cn } from '@/lib/utils';

function wrapSelection(
  value: string,
  start: number,
  end: number,
  before: string,
  after: string,
) {
  const selected = value.slice(start, end) || 'text';
  const next = value.slice(0, start) + before + selected + after + value.slice(end);
  return {
    next,
    cursorStart: start + before.length,
    cursorEnd: start + before.length + selected.length,
  };
}

export function BodyEditor({
  id,
  label,
  value,
  onChange,
  rows = 10,
  className,
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const apply = (before: string, after: string) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const { next, cursorStart, cursorEnd } = wrapSelection(
      value,
      start,
      end,
      before,
      after,
    );
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursorStart, cursorEnd);
    });
  };

  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="block text-sm font-medium text-[#0D2745]">
        {label}
      </label>
      <div className="overflow-hidden rounded-lg border border-[#D9DEE5] bg-white">
        <div className="flex gap-1 border-b border-[#D9DEE5] bg-[#F6F4EE] px-2 py-1.5">
          <button
            type="button"
            title="Bold"
            onClick={() => apply('**', '**')}
            className="rounded p-1.5 text-[#68727D] hover:bg-white hover:text-[#0D2745]"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Italic"
            onClick={() => apply('_', '_')}
            className="rounded p-1.5 text-[#68727D] hover:bg-white hover:text-[#0D2745]"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Heading"
            onClick={() => apply('\n## ', '\n')}
            className="rounded p-1.5 text-[#68727D] hover:bg-white hover:text-[#0D2745]"
          >
            <Heading2 className="h-4 w-4" />
          </button>
        </div>
        <textarea
          ref={ref}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="w-full resize-y bg-transparent px-3 py-2.5 text-sm text-[#242B2D] outline-none placeholder:text-[#9AA3A5]"
          placeholder="Write content…"
        />
      </div>
    </div>
  );
}
