import { cn } from '@/lib/utils';

type PrototypeMediaNoteProps = {
  className?: string;
};

/** Small caption for generated demo visuals */
export function PrototypeMediaNote({ className }: PrototypeMediaNoteProps) {
  return (
    <p
      className={cn(
        'font-sans text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted/80',
        className,
      )}
    >
      Prototype visual
    </p>
  );
}
