import {
  ActivityProgrammePage,
  activityMetadata,
} from '@/components/public/ActivityProgrammePage';

export const metadata = activityMetadata('awareness-campaigns');

export default function Page() {
  return <ActivityProgrammePage routeSlug="awareness-campaigns" />;
}
