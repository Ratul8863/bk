import {
  PublicationTypePage,
  publicationTypeMetadata,
} from '@/components/public/PublicationTypePage';

export const metadata = publicationTypeMetadata(
  'Annual Reports',
  'A year-in-review of our research, impact, and milestones.',
  '/publications/annual-reports',
);

export default function Page() {
  return (
    <PublicationTypePage
      type="annual-report"
      title="Annual Reports"
      description="A year-in-review of our research, impact, and milestones."
      emptyTitle="No annual reports published yet"
      emptyDescription="The legacy Completed archive listed journal articles, chapters, conference papers, and newspaper opinions — but not annual reports. This section is reserved for future institutional reports."
      path="/publications/annual-reports"
    />
  );
}
