import {
  PublicationTypePage,
  publicationTypeMetadata,
} from '@/components/public/PublicationTypePage';

export const metadata = publicationTypeMetadata(
  'Newsletters',
  'Newsletters from BK School of Research.',
  '/publications/newsletters',
);

export default function Page() {
  return (
    <PublicationTypePage
      type="newsletter"
      title="Newsletters"
      description="Periodic institutional updates from BK School of Research."
      emptyTitle="No newsletters published yet"
      emptyDescription="Newsletter issues were not part of the migrated legacy archive. When BKSR issues newsletters, they will be listed here."
      path="/publications/newsletters"
    />
  );
}
