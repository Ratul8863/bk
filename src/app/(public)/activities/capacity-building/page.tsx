import {
  ActivityProgrammePage,
  activityMetadata,
} from '@/components/public/ActivityProgrammePage';

export async function generateMetadata() {
  return activityMetadata('capacity-building');
}

export default function Page() {
  return <ActivityProgrammePage routeSlug="capacity-building" />;
}
