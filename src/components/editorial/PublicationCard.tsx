import Link from 'next/link';
import { Tag } from '@/components/ui/Tag';
import { MetaLine } from '@/components/ui/MetaLine';
import { PUBLICATION_TYPE_LABELS } from '@/lib/public/labels';
import type { Publication } from '@/types/content';
import { cn } from '@/lib/utils';

type PublicationCardProps = {
  publication: Publication;
  className?: string;
};

export function PublicationCard({ publication, className }: PublicationCardProps) {
  return (
    <article
      className={cn(
        'group border-t border-border pt-6 transition-colors',
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Tag tone="accent">{PUBLICATION_TYPE_LABELS[publication.type]}</Tag>
        <span className="font-sans text-sm text-muted">{publication.year}</span>
      </div>
      <h3 className="mt-3 font-display text-xl leading-snug text-ink md:text-2xl">
        <Link
          href={`/publications/${publication.slug}`}
          className="transition-colors group-hover:text-accent"
        >
          {publication.title}
        </Link>
      </h3>
      <MetaLine
        className="mt-3"
        items={[publication.authors.join(', '), publication.venue]}
      />
    </article>
  );
}

export { PUBLICATION_TYPE_LABELS as publicationTypeLabels };
