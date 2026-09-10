import {
  PublicationTypePage,
  publicationTypeMetadata,
} from '@/components/public/PublicationTypePage';

export const metadata = publicationTypeMetadata(
  'Policy Briefs',
  'Short evidence briefs for policy audiences from BK School of Research.',
  '/publications/policy-briefs',
);

export default function Page() {
  return (
    <PublicationTypePage
      type="policy-brief"
      title="Policy Briefs"
      description="Concise briefs that translate BKSR research into policy-facing evidence."
      emptyTitle="No policy briefs published yet"
      emptyDescription="Policy briefs were not part of the migrated legacy archive. When BKSR publishes briefs, they will be listed here."
      path="/publications/policy-briefs"
    />
  );
}
