import type { ContentDatabase } from '@/types/content';
import { activities } from './activities';
import { events } from './events';
import { galleryAlbums, galleryImages } from './gallery';
import { homepage } from './homepage';
import { media } from './media';
import {
  footerNavigation,
  knowledgeHubNavigation,
  mainNavigation,
} from './navigation';
import { news } from './news';
import { notices } from './notices';
import { pages } from './pages';
import { people } from './people';
import { publications } from './publications';
import { researchAreas } from './research-areas';
import { researchProjects } from './research-projects';
import { resources } from './resources';
import { siteSettings } from './site-settings';

export const seedDatabase: ContentDatabase = {
  version: 1,
  siteSettings,
  navigation: {
    main: mainNavigation,
    footer: footerNavigation,
    knowledgeHub: knowledgeHubNavigation,
  },
  homepage,
  pages,
  people,
  researchAreas,
  researchProjects,
  publications,
  activities,
  news,
  events,
  notices,
  resources,
  galleryAlbums,
  galleryImages,
  media,
};

export {
  activities,
  events,
  galleryAlbums,
  galleryImages,
  homepage,
  media,
  mainNavigation,
  footerNavigation,
  knowledgeHubNavigation,
  news,
  notices,
  pages,
  people,
  publications,
  researchAreas,
  researchProjects,
  resources,
  siteSettings,
};
