import {
  PublicationTypePage,
  publicationTypeMetadata,
} from '@/components/public/PublicationTypePage';

export const metadata = publicationTypeMetadata(
  'Working Papers',
  'Working papers and draft research circulating from BK School of Research.',
  '/publications/working-papers',
);

export default function Page() {
  return (
    <PublicationTypePage
      type="working-paper"
      title="Working Papers"
      description="Draft and circulating research papers from the BKSR portfolio."
      emptyTitle="No working papers published yet"
      emptyDescription="Working papers were not part of the migrated legacy Completed archive. This section is reserved for future releases."
      path="/publications/working-papers"
    />
  );
}
