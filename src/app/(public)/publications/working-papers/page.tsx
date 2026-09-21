import {
  PublicationTypePage,
  publicationTypeMetadata,
} from '@/components/public/PublicationTypePage';

export const metadata = publicationTypeMetadata(
  'Working Papers',
  'Research in progress, shared early to spark dialogue and feedback.',
  '/publications/working-papers',
);

export default function Page() {
  return (
    <PublicationTypePage
      type="working-paper"
      title="Working Papers"
      description="Research in progress, shared early to spark dialogue and feedback."
      emptyTitle="No working papers published yet"
      emptyDescription="Working papers were not part of the migrated legacy Completed archive. This section is reserved for future releases."
      path="/publications/working-papers"
    />
  );
}
