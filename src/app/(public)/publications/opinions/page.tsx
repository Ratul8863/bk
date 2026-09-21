import {
  PublicationTypePage,
  publicationTypeMetadata,
} from '@/components/public/PublicationTypePage';

export const metadata = publicationTypeMetadata(
  'Opinions',
  "Thought-provoking commentary from our researchers on today's most pressing questions.",
  '/publications/opinions',
);

export default function Page() {
  return (
    <PublicationTypePage
      type="opinion"
      title="Opinions"
      description="Thought-provoking commentary from our researchers on today's most pressing questions."
      emptyTitle="No opinions published yet"
      emptyDescription="Opinion pieces will appear here when published."
      path="/publications/opinions"
    />
  );
}
