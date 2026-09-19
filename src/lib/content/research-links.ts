import type { Publication, ResearchProject } from '@/types/content';

/** Normalize a DOI or DOI URL to https://doi.org/... */
export function doiToUrl(doi: string | null | undefined): string | null {
  if (!doi?.trim()) return null;
  const cleaned = doi
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, '');
  if (!cleaned) return null;
  return `https://doi.org/${cleaned}`;
}

export function publicationExternalUrl(
  publication: Pick<Publication, 'url' | 'doi'>,
): string | null {
  const direct = publication.url?.trim();
  if (direct) return direct;
  return doiToUrl(publication.doi);
}

/**
 * Prefer an explicit project URL, then the first linked publication’s
 * journal/DOI/external link. No internal `/research/[slug]` fallback.
 */
export function researchProjectExternalUrl(
  project: Pick<ResearchProject, 'url' | 'publicationIds'>,
  publicationsById?: Map<string, Publication>,
): string | null {
  const attached = project.url?.trim();
  if (attached) return attached;
  if (!publicationsById) return null;
  for (const id of project.publicationIds ?? []) {
    const pub = publicationsById.get(id);
    if (!pub) continue;
    const href = publicationExternalUrl(pub);
    if (href) return href;
  }
  return null;
}

export function withResearchExternalUrls(
  projects: ResearchProject[],
  publications: Publication[],
): ResearchProject[] {
  const byId = new Map(publications.map((pub) => [pub.id, pub]));
  return projects.map((project) => {
    const url = researchProjectExternalUrl(project, byId);
    return url ? { ...project, url } : { ...project, url: project.url ?? null };
  });
}
