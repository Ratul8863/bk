import { Button } from '@/components/ui/Button';
import { ImageFrame } from '@/components/ui/ImageFrame';

export type NoticesNewsSlide = {
  id: string;
  href: string;
  title: string;
  summary?: string;
  imageUrl?: string | null;
};

type NoticesNewsCarouselProps = {
  slides: NoticesNewsSlide[];
  fallbackImage?: string;
};

const VISIBLE = 3;

export function NoticesNewsCarousel({
  slides,
  fallbackImage,
}: NoticesNewsCarouselProps) {
  if (!slides.length) return null;

  const visible = slides.slice(0, VISIBLE);

  const imageFor = (slide: NoticesNewsSlide) =>
    slide.imageUrl ||
    fallbackImage ||
    '/media/prototype/bksr-hero-seminar.jpg';

  return (
    <div className="relative min-w-0">
      <ul className="grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {visible.map((slide) => (
          <li key={slide.id} className="min-w-0">
            <article className="flex h-full flex-col gap-6 rounded-[2.125rem] bg-ink p-5">
              <ImageFrame
                src={imageFor(slide)}
                alt=""
                aspect="video"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                frameClassName="shrink-0 rounded-[1.5625rem] border-0 bg-[#d9d9d9]"
                className="object-cover"
              />

              <div className="flex min-w-0 flex-1 flex-col gap-4 text-paper">
                <h3 className="font-instrument text-xl font-medium leading-snug sm:text-2xl">
                  {slide.title}
                </h3>
                {slide.summary ? (
                  <p className="line-clamp-3 font-instrument text-sm leading-normal text-paper/90 sm:text-base">
                    {slide.summary}
                  </p>
                ) : null}
              </div>

              <Button
                href={slide.href}
                variant="onInk"
                size="lg"
                className="mt-auto w-fit font-normal tracking-normal"
              >
                Learn More
              </Button>
            </article>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-center sm:mt-8">
        <Button href="/publications/opinions" variant="ink" size="lg">
          View all opinions
        </Button>
      </div>
    </div>
  );
}
