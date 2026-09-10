import {
  ActivityProgrammePage,
  activityMetadata,
} from '@/components/public/ActivityProgrammePage';

export const metadata = activityMetadata('innovation-showcasing');

export default function Page() {
  return <ActivityProgrammePage routeSlug="innovation-showcasing" />;
}
