import { prototypeMedia } from '@/lib/content/prototype-media';

/** Shared photographic planes for inner-page heroes (homepage language). */
export const pageHeroMedia = {
  about: prototypeMedia.heroSlideSeminar.url,
  people: prototypeMedia.directorPortrait.url,
  research: prototypeMedia.researchField.url,
  publications: prototypeMedia.knowledgeArchive.url,
  activities: prototypeMedia.activityWorkshop.url,
  events: prototypeMedia.eventSeminar.url,
  newsEvents: prototypeMedia.eventSeminar.url,
  news: prototypeMedia.heroSlideWebinar.url,
  notices: prototypeMedia.heroSlideArchive.url,
  contact: prototypeMedia.heroSlideField.url,
  resources: prototypeMedia.knowledgeArchive.url,
  gallery: prototypeMedia.heroSlideSeminar.url,
  default: prototypeMedia.heroSlideSeminar.url,
} as const;
