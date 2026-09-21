import { BksrLoader } from '@/components/ui/BksrLoader';

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center bg-paper px-6 py-16">
      <BksrLoader size={88} label="Loading page" />
    </div>
  );
}
