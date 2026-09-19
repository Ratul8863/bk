import { redirect } from 'next/navigation';
import {
  getPublications,
  getResearchProjectBySlug,
} from '@/lib/content/queries';
import { researchProjectExternalUrl } from '@/lib/content/research-links';

type Props = { params: Promise<{ slug: string }> };

/** No public research detail pages — send visitors to the attached journal/source, else the hub. */
export default async function ResearchProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getResearchProjectBySlug(slug);
  if (!project) redirect('/research');

  const publications = await getPublications();
  const byId = new Map(publications.map((pub) => [pub.id, pub]));
  const external = researchProjectExternalUrl(project, byId);
  redirect(external ?? '/research');
}
