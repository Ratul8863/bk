import {
  PublicationTypePage,
  publicationTypeMetadata,
} from '@/components/public/PublicationTypePage';

export const metadata = publicationTypeMetadata(
  'Journals',
  'Peer-reviewed journal articles by BKSR authors and collaborators.',
  '/publications/journals',
);

export default function Page() {
  return (
    <PublicationTypePage
      type="journal"
      title="Journal articles"
      description="Peer-reviewed journal articles from the BKSR archive — published in external journals, not a BKSR house journal."
      emptyTitle="No journal articles yet"
      emptyDescription="Journal articles will appear here when published."
      path="/publications/journals"
    />
  );
}
