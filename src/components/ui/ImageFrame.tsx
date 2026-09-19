import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import {
  cloudinaryImageLoader,
  isCloudinaryUrl,
} from '@/lib/media/cloudinary-url';

type Aspect = 'square' | 'video' | 'portrait' | 'wide' | 'auto';

const aspectClasses: Record<Aspect, string> = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  wide: 'aspect-[21/9]',
  auto: '',
};

type ImageFrameProps = {
  src: ImageProps['src'];
  alt: string;
  aspect?: Aspect;
  className?: string;
  frameClassName?: string;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  /** Navy institutional frame */
  framed?: boolean;
};

export function ImageFrame({
  src,
  alt,
  aspect = 'video',
  className,
  frameClassName,
  priority,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px',
  width,
  height,
  framed = false,
}: ImageFrameProps) {
  const fill = aspect !== 'auto';
  const srcString = typeof src === 'string' ? src : null;
  const useCloudinary =
    Boolean(srcString) && isCloudinaryUrl(srcString as string);

  return (
    <div
      className={cn(
        'group relative w-full max-w-full overflow-hidden bg-surface',
        aspectClasses[aspect],
        framed &&
          'border border-accent/15 shadow-[inset_0_0_0_1px_rgba(23,59,108,0.05)] ring-1 ring-accent/10',
        frameClassName,
      )}
    >
      <Image
        src={src}
        alt={alt}
        priority={priority}
        sizes={sizes}
        {...(useCloudinary
          ? { loader: cloudinaryImageLoader, unoptimized: false }
          : {})}
        {...(fill
          ? { fill: true as const }
          : { width: width ?? 1200, height: height ?? 800 })}
        className={cn(
          'object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100',
          fill ? 'h-full w-full' : 'h-auto w-full',
          className,
        )}
      />
    </div>
  );
}
