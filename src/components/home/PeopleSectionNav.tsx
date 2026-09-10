'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type PeopleSectionNavLink = {
  href: string;
  label: string;
};

type PeopleSectionNavProps = {
  links: PeopleSectionNavLink[];
  className?: string;
};

export function PeopleSectionNav({ links, className }: PeopleSectionNavProps) {
  const [activeHref, setActiveHref] = useState(links[0]?.href ?? '');

  useEffect(() => {
    if (!links.length) return;

    const sections = links
      .map((link) => {
        const id = link.href.replace('#', '');
        const el = document.getElementById(id);
        return el ? { href: link.href, el } : null;
      })
      .filter((item): item is { href: string; el: HTMLElement } => Boolean(item));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0];
        if (!top?.target.id) return;
        setActiveHref(`#${top.target.id}`);
      },
      {
        rootMargin: '-28% 0px -55% 0px',
        threshold: [0.05, 0.15, 0.3],
      },
    );

    sections.forEach(({ el }) => observer.observe(el));
    return () => observer.disconnect();
  }, [links]);

  if (links.length < 2) return null;

  return (
    <nav
      aria-label="Team sections"
      className={cn('mt-8 flex justify-center sm:mt-9', className)}
    >
      <ul className="flex max-w-4xl flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        {links.map((link) => {
          const active = activeHref === link.href;
          return (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={active ? 'true' : undefined}
                onClick={() => setActiveHref(link.href)}
                className={cn(
                  'inline-flex items-center justify-center rounded-[1.25rem] border px-4 py-2.5 font-sans text-sm transition-[background-color,border-color,color,box-shadow] duration-200 sm:rounded-3xl sm:px-5 sm:py-3',
                  active
                    ? 'border-ink bg-ink text-paper shadow-[0_10px_28px_-18px_rgba(13,39,69,0.55)]'
                    : 'border-ink/15 bg-white text-ink/75 hover:border-ink/35 hover:text-ink',
                )}
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
