import {
  PublicationTypePage,
  publicationTypeMetadata,
} from '@/components/public/PublicationTypePage';

export const metadata = publicationTypeMetadata(
  'Annual reports',
  'Annual reports from BK School of Research.',
  '/publications/annual-reports',
);

export default function Page() {
  return (
    <PublicationTypePage
      type="annual-report"
      title="Annual reports"
      description="Institutional year-in-review documents from BK School of Research."
      emptyTitle="No annual reports published yet"
      emptyDescription="The legacy Completed archive listed journal articles, chapters, conference papers, and newspaper opinions — but not annual reports. This section is reserved for future institutional reports."
      path="/publications/annual-reports"
    />
  );
}
