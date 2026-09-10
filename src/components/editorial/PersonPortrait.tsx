import { ImageFrame } from '@/components/ui/ImageFrame';
import { cn } from '@/lib/utils';

type PersonPortraitProps = {
  name: string;
  src?: string | null;
  className?: string;
  aspect?: 'portrait' | 'square';
  framed?: boolean;
};

export function PersonPortrait({
  name,
  src,
  className,
  aspect = 'portrait',
  framed = false,
}: PersonPortraitProps) {
  if (src) {
    return (
      <ImageFrame
        src={src}
        alt={`Portrait of ${name}`}
        aspect={aspect}
        framed={framed}
        frameClassName={cn('bg-surface', className)}
      />
    );
  }

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div
      className={cn(
        'relative flex items-end overflow-hidden bg-surface',
        aspect === 'square' ? 'aspect-square' : 'aspect-[3/4]',
        className,
      )}
      aria-label={`Portrait placeholder for ${name}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(23,59,108,0.12),transparent_55%)]" />
      <span className="relative p-5 font-display text-4xl text-ink/25 md:text-5xl">
        {initials || 'BK'}
      </span>
    </div>
  );
}
