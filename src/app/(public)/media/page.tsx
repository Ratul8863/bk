import {
  PublicationTypePage,
  publicationTypeMetadata,
} from '@/components/public/PublicationTypePage';

export const metadata = publicationTypeMetadata(
  'BKSR in Media',
  'Where BK School of Research appears across newspapers, television, and digital outlets.',
  '/media',
);

export default function Page() {
  return (
    <PublicationTypePage
      type="press-coverage"
      title="BKSR in Media"
      description="Where BK School of Research appears across newspapers, television, and digital outlets."
      emptyTitle="No press coverage listed yet"
      emptyDescription="Media clippings and broadcast features will appear here when published."
      path="/media"
    />
  );
}
