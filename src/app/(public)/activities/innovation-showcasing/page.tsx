import {
  ActivityProgrammePage,
  activityMetadata,
} from '@/components/public/ActivityProgrammePage';

export async function generateMetadata() {
  return activityMetadata('innovation-showcasing');
}

export default function Page() {
  return <ActivityProgrammePage routeSlug="innovation-showcasing" />;
}
