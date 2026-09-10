'use client';

import { useEffect, useId, useRef } from 'react';
import { cn } from '@/lib/utils';

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  destructive = true,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}) {
  const titleId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#0D2745]/40"
        aria-label="Close dialog"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md rounded-xl border border-[#D9DEE5] bg-[#F8F7F3] p-5 shadow-xl"
      >
        <h2 id={titleId} className="font-[family-name:var(--font-admin-display)] text-lg text-[#0D2745]">
          {title}
        </h2>
        <p className="mt-2 text-sm text-[#68727D]">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-[#D9DEE5] bg-white px-3 py-2 text-sm text-[#0D2745] hover:bg-[#F6F4EE]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              'rounded-lg px-3 py-2 text-sm font-medium text-white',
              destructive ? 'bg-[#8A3B3B] hover:bg-[#733030]' : 'bg-[#173B6C] hover:bg-[#0D2745]',
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
