import {
  ActivityProgrammePage,
  activityMetadata,
} from '@/components/public/ActivityProgrammePage';

export const metadata = activityMetadata('capacity-building');

export default function Page() {
  return <ActivityProgrammePage routeSlug="capacity-building" />;
}
