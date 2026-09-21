import {
  PublicationTypePage,
  publicationTypeMetadata,
} from '@/components/public/PublicationTypePage';

export const metadata = publicationTypeMetadata(
  'Journals',
  'Peer-reviewed findings that shape academic and policy conversations.',
  '/publications/journals',
);

export default function Page() {
  return (
    <PublicationTypePage
      type="journal"
      title="Journals"
      description="Peer-reviewed findings that shape academic and policy conversations."
      emptyTitle="No journal articles yet"
      emptyDescription="Journal articles will appear here when published."
      path="/publications/journals"
    />
  );
}
