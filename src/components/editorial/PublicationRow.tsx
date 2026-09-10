import Link from 'next/link';
import { MetaLine } from '@/components/ui/MetaLine';
import { publicationTypeLabels } from '@/components/editorial/PublicationCard';
import type { Publication } from '@/types/content';
import { cn } from '@/lib/utils';

type PublicationRowProps = {
  publication: Publication;
  className?: string;
};

export function PublicationRow({ publication, className }: PublicationRowProps) {
  return (
    <article
      className={cn(
        'grid gap-3 border-b border-border py-5 md:grid-cols-[5rem_1fr_auto] md:items-baseline md:gap-8',
        className,
      )}
    >
      <p className="font-sans text-sm font-semibold text-accent">{publication.year}</p>
      <div className="min-w-0">
        <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted">
          {publicationTypeLabels[publication.type]}
        </p>
        <h3 className="mt-1 font-display text-lg leading-snug text-ink md:text-xl">
          <Link
            href={`/publications/${publication.slug}`}
            className="transition-colors hover:text-accent"
          >
            {publication.title}
          </Link>
        </h3>
        <MetaLine
          className="mt-2"
          items={[publication.authors.join(', '), publication.venue]}
        />
      </div>
      <Link
        href={`/publications/${publication.slug}`}
        className="font-sans text-sm font-semibold text-accent hover:text-ink md:justify-self-end"
      >
        View
      </Link>
    </article>
  );
}
