import type { GalleryAlbum, GalleryImage } from '@/types/content';

const ts = {
  createdAt: '2020-01-01T00:00:00.000Z',
  updatedAt: '2026-08-30T00:00:00.000Z',
  publishedAt: '2020-01-01T00:00:00.000Z',
};

/** Legacy Gallery page stated only “Coming soon” — no invented photos */
export const galleryAlbums: GalleryAlbum[] = [
  {
    ...ts,
    id: 'album-coming-soon',
    slug: 'coming-soon',
    status: 'draft',
    title: 'Coming soon',
    description:
      'The legacy BKSR Gallery page (https://bkschoolofresearch.blogspot.com/p/galary.html) stated “Coming soon.” No photographs were published there; this album is a placeholder until real media is added.',
    coverImageId: null,
    imageIds: [],
    comingSoon: true,
    seo: {
      title: 'Gallery | BKSR',
      description: 'BK School of Research gallery — coming soon.',
      canonicalPath: '/gallery',
      noIndex: true,
    },
  },
];

export const galleryImages: GalleryImage[] = [];
