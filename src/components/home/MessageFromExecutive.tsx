import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type MessageFromExecutiveProps = {
  name: string;
  role: string;
  message: string;
  photoSrc: string;
  profileHref: string;
  className?: string;
};

function messageParagraphs(message: string) {
  const parts = message
    .trim()
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) return [];

  return parts.map((part, index) => {
    const isFirst = index === 0;
    const isLast = index === parts.length - 1;
    const bare = part.replace(/^[“"]|[”"]$/g, '');
    if (parts.length === 1) return `“${bare}”`;
    if (isFirst) return `“${bare}`;
    if (isLast) return `${bare}”`;
    return bare;
  });
}

export function MessageFromExecutive({
  name,
  role,
  message,
  photoSrc,
  profileHref,
  className,
}: MessageFromExecutiveProps) {
  const paragraphs = messageParagraphs(message);

  return (
    <article
      className={cn(
        'flex flex-col gap-2 rounded-[1.5rem] bg-ink p-1.5 sm:gap-2.5 sm:rounded-[2.5rem] sm:p-3 md:rounded-[3.75rem] md:p-4 lg:flex-row lg:items-stretch lg:gap-2.5',
        className,
      )}
    >
      <div className="relative aspect-4/5 w-full shrink-0 overflow-hidden rounded-[1.25rem] bg-surface sm:rounded-[2.125rem] md:rounded-[3.125rem] lg:aspect-auto lg:min-h-112 lg:w-[min(34%,22rem)] xl:min-h-140 xl:w-[min(32%,34rem)]">
        <Image
          src={photoSrc}
          alt={`Portrait of ${name}`}
          fill
          sizes="(max-width: 1024px) 100vw, 34rem"
          className="object-cover object-[center_20%]"
        />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-between gap-8 rounded-[1.25rem] bg-white p-5 sm:gap-10 sm:rounded-[2.125rem] sm:p-7 md:rounded-[3.125rem] md:p-8 lg:p-7.5">
        <div className="flex min-w-0 flex-col gap-5 text-ink sm:gap-6">
          <div className="max-w-xs">
            <h3 className="font-display text-[1.5rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.15rem] md:text-[2.5rem] md:leading-[1.2]">
              {name}
            </h3>
            <ul className="mt-2 list-disc pl-5 text-sm leading-6 text-muted sm:mt-2.5 sm:text-base">
              <li>{role}</li>
            </ul>
          </div>
          <div className="max-w-4xl space-y-4 text-base leading-7 text-body sm:space-y-5 sm:text-xl sm:leading-8 md:text-[1.625rem] md:leading-8.5">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            href={profileHref}
            variant="ink"
            size="md"
            className="rounded-xl px-4 py-2.5 font-normal tracking-normal"
          >
            View Profile
          </Button>
        </div>
      </div>
    </article>
  );
}
