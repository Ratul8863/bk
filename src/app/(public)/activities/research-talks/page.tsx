import {
  ActivityProgrammePage,
  activityMetadata,
} from '@/components/public/ActivityProgrammePage';

export async function generateMetadata() {
  return activityMetadata('research-talks');
}

export default function Page() {
  return <ActivityProgrammePage routeSlug="research-talks" />;
}
