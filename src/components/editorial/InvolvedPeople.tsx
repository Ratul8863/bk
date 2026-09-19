'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { contentRepository } from '@/lib/cms/repository';
import {
  getResolvedPeopleForEntity,
  humanizeLinkRole,
  type ResolvedLinkedPerson,
} from '@/lib/content/person-links';
import type { PersonLinkEntityType } from '@/types/content';
import { cn } from '@/lib/utils';

export function InvolvedPeople({
  entityType,
  entityId,
  initialPeople,
  title = 'People involved',
  className,
}: {
  entityType: PersonLinkEntityType;
  entityId: string;
  initialPeople: ResolvedLinkedPerson[];
  title?: string;
  className?: string;
}) {
  const [people, setPeople] = useState(initialPeople);

  useEffect(() => {
    const db = contentRepository.getDatabase();
    setPeople(getResolvedPeopleForEntity(db, entityType, entityId));
  }, [entityType, entityId]);

  if (!people.length) return null;

  return (
    <section className={cn(className)}>
      <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {people.map((person) => (
          <li key={person.linkId}>
            <Link
              href={person.href}
              className="group flex items-center gap-3 rounded-[1rem] p-1.5 transition-colors hover:bg-ink/[0.04]"
            >
              <div className="relative size-11 shrink-0 overflow-hidden rounded-[0.85rem] bg-ink">
                {person.photoUrl ? (
                  <Image
                    src={person.photoUrl}
                    alt=""
                    fill
                    sizes="44px"
                    className="object-cover object-top"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center font-display text-sm text-paper">
                    {person.name
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((part) => part[0]?.toUpperCase() ?? '')
                      .join('')}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate font-sans text-sm font-medium text-ink group-hover:text-accent">
                  {person.name}
                </p>
                <p className="truncate text-xs text-muted">
                  {humanizeLinkRole(person.roleOnEntity)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
