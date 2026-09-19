'use client';

import Image, { type ImageProps } from 'next/image';
import {
  cloudinaryImageLoader,
  isCloudinaryUrl,
} from '@/lib/media/cloudinary-url';

type MediaImageProps = Omit<ImageProps, 'loader'> & {
  src: string;
};

/** next/image with Cloudinary transforms when the URL is on res.cloudinary.com */
export function MediaImage({ src, alt, ...rest }: MediaImageProps) {
  const cloudinary = isCloudinaryUrl(src);
  return (
    <Image
      src={src}
      alt={alt}
      {...(cloudinary ? { loader: cloudinaryImageLoader } : {})}
      {...rest}
    />
  );
}
