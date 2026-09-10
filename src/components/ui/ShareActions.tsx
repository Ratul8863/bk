'use client';

import { useState } from 'react';
import { Check, Link2, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ShareActionsProps = {
  title: string;
  url?: string;
  className?: string;
};

export function ShareActions({ title, url, className }: ShareActionsProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const shareUrl =
      url ?? (typeof window !== 'undefined' ? window.location.href : '');
    if (!shareUrl) return;

    try {
      if (navigator.share) {
        await navigator.share({ title, url: shareUrl });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      } catch {
        /* ignore */
      }
    }
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 font-sans text-sm text-ink transition-colors hover:border-ink hover:bg-sage/50"
      >
        {copied ? (
          <>
            <Check className="size-4 text-accent" aria-hidden />
            Copied
          </>
        ) : (
          <>
            <Share2 className="size-4" aria-hidden />
            Share
          </>
        )}
      </button>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex size-9 items-center justify-center rounded-sm border border-border text-muted transition-colors hover:border-ink hover:text-ink"
        aria-label="Copy link"
      >
        <Link2 className="size-4" aria-hidden />
      </button>
    </div>
  );
}
