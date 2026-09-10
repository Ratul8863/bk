import { cn } from '@/lib/utils';

type QuoteBlockProps = {
  quote: string;
  attribution?: string;
  role?: string;
  className?: string;
};

export function QuoteBlock({
  quote,
  attribution,
  role,
  className,
}: QuoteBlockProps) {
  return (
    <blockquote
      className={cn(
        'border-l-2 border-brand-red pl-6 md:pl-8',
        className,
      )}
    >
      <p className="font-serif text-xl italic leading-relaxed text-ink md:text-2xl md:leading-relaxed">
        “{quote}”
      </p>
      {attribution ? (
        <footer className="mt-5 font-sans text-sm text-muted">
          <cite className="not-italic font-semibold text-ink">{attribution}</cite>
          {role ? <span className="before:content-['_|_']">{role}</span> : null}
        </footer>
      ) : null}
    </blockquote>
  );
}
