import { cn } from '@/lib/utils';

export type SocialNetwork =
  | 'facebook'
  | 'youtube'
  | 'linkedin'
  | 'twitter'
  | 'instagram';

type SocialGlyphProps = {
  name: SocialNetwork;
  className?: string;
};

/** Brand network marks used in footer and contact. */
export function SocialGlyph({ name, className }: SocialGlyphProps) {
  const glyphClass = cn('size-4 fill-current', className);

  if (name === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" className={glyphClass} aria-hidden>
        <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
      </svg>
    );
  }

  if (name === 'youtube') {
    return (
      <svg viewBox="0 0 24 24" className={glyphClass} aria-hidden>
        <path d="M23 12.2s0-3.2-.4-4.7c-.2-.9-.9-1.6-1.8-1.8C18.5 5.2 12 5.2 12 5.2s-6.5 0-8.8.5c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.7c.2.9.9 1.6 1.8 1.8 2.3.5 8.8.5 8.8.5s6.5 0 8.8-.5c.9-.2 1.6-.9 1.8-1.8.4-1.5.4-4.7.4-4.7zM9.8 15.5v-6.6l6.3 3.3-6.3 3.3z" />
      </svg>
    );
  }

  if (name === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" className={glyphClass} aria-hidden>
        <path d="M6.9 8.7H3.6V20h3.3V8.7zM5.2 4C4 4 3 5 3 6.2S4 8.4 5.2 8.4 7.5 7.4 7.5 6.2 6.5 4 5.2 4zM20.4 20h-3.3v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20H9.9V8.7h3.2v1.5h.1c.4-.8 1.5-1.8 3.2-1.8 3.4 0 4 2.2 4 5.2V20z" />
      </svg>
    );
  }

  if (name === 'twitter') {
    return (
      <svg viewBox="0 0 24 24" className={glyphClass} aria-hidden>
        <path d="M18.9 2.2h3.3l-7.2 8.2L24 21.8h-6.6l-5.2-6.8-5.9 6.8H2.9l7.7-8.8L0 2.2h6.8l4.7 6.2 7.4-6.2zm-1.2 17.6h1.8L6.4 4h-1.9l13.2 15.8z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={glyphClass} aria-hidden>
      <path d="M7.8 2h8.4C19.2 2 22 4.8 22 7.8v8.4c0 3-2.8 5.8-5.8 5.8H7.8C4.8 22 2 19.2 2 16.2V7.8C2 4.8 4.8 2 7.8 2zm8.2 1.8H8C5.8 3.8 3.8 5.8 3.8 8v8c0 2.2 2 4.2 4.2 4.2h8c2.2 0 4.2-2 4.2-4.2V8c0-2.2-2-4.2-4.2-4.2zm-4.2 3.1A5.1 5.1 0 1 1 6.7 12 5.1 5.1 0 0 1 12 6.9zm0 1.8A3.3 3.3 0 1 0 15.3 12 3.3 3.3 0 0 0 12 8.7zm6.5-2.9a1.2 1.2 0 1 1-1.2 1.2 1.2 1.2 0 0 1 1.2-1.2z" />
    </svg>
  );
}
