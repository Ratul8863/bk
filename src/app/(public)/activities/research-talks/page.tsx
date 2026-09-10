import {
  ActivityProgrammePage,
  activityMetadata,
} from '@/components/public/ActivityProgrammePage';

export const metadata = activityMetadata('research-talks');

export default function Page() {
  return <ActivityProgrammePage routeSlug="research-talks" />;
}
