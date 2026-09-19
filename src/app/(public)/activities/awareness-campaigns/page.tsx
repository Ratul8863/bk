import {
  ActivityProgrammePage,
  activityMetadata,
} from '@/components/public/ActivityProgrammePage';

export async function generateMetadata() {
  return activityMetadata('awareness-campaigns');
}

export default function Page() {
  return <ActivityProgrammePage routeSlug="awareness-campaigns" />;
}
