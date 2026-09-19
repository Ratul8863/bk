import type { PersonContentLink } from '@/types/content';
import { events } from './events';
import { people } from './people';
import { publications } from './publications';
import { researchProjects } from './research-projects';

const now = '2026-09-13T00:00:00.000Z';
const BEZON_ID = people[0]?.id ?? 'person-bezon-kumar';

function looksLikeBezon(name: string): boolean {
  const n = name.toLowerCase().trim();
  return (
    n.includes('bezon') ||
    /\bb\.?\s*kumar\b/.test(n) ||
    /^kumar,?\s*b\.?$/.test(n) ||
    /^kumar\s+b\.?$/.test(n)
  );
}

function link(
  id: string,
  entityType: PersonContentLink['entityType'],
  entityId: string,
  role: string,
  order: number,
): PersonContentLink {
  return {
    id,
    personId: BEZON_ID,
    entityType,
    entityId,
    role,
    order,
    createdAt: now,
    updatedAt: now,
  };
}

const eventLinks = events.flatMap((event, index) => {
  const speaker = event.speakers?.find(looksLikeBezon);
  if (!speaker) return [];
  const role = /moderator/i.test(speaker) ? 'moderator' : 'speaker';
  return [link(`pcl-event-${event.id}`, 'event', event.id, role, index)];
});

const researchLinks = researchProjects.flatMap((project, index) => {
  if (!project.leadAuthorNames.some(looksLikeBezon)) return [];
  const lead = project.leadAuthorNames[0];
  const role = lead && looksLikeBezon(lead) ? 'lead' : 'author';
  return [
    link(`pcl-research-${project.id}`, 'research', project.id, role, index),
  ];
});

const publicationLinks = publications.flatMap((pub, index) => {
  if (!pub.authors.some(looksLikeBezon)) return [];
  return [
    link(`pcl-pub-${pub.id}`, 'publication', pub.id, 'author', index),
  ];
});

export const personContentLinks: PersonContentLink[] = [
  ...eventLinks,
  ...researchLinks,
  ...publicationLinks,
];
