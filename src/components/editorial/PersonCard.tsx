import Link from 'next/link';
import { PersonPortrait } from '@/components/editorial/PersonPortrait';
import type { Person } from '@/types/content';
import { cn } from '@/lib/utils';

type PersonCardProps = {
  person: Person;
  className?: string;
};

export function PersonCard({ person, className }: PersonCardProps) {
  return (
    <article className={cn('group', className)}>
      <PersonPortrait
        name={person.name}
        src={person.photoUrl}
        className="mb-5"
      />
      <h3 className="font-display text-xl text-ink md:text-2xl">
        <Link
          href={`/people/${person.slug}`}
          className="transition-colors group-hover:text-accent"
        >
          {person.name}
        </Link>
      </h3>
      <p className="mt-1 font-sans text-sm font-semibold text-accent">{person.role}</p>
      {person.affiliation ? (
        <p className="mt-2 text-sm leading-relaxed text-muted">{person.affiliation}</p>
      ) : null}
      {person.shortBio ? (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-body">
          {person.shortBio}
        </p>
      ) : null}
    </article>
  );
}
