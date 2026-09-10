import { getSeedDatabase } from '@/lib/cms/repository';
import type {
  Activity,
  ContentStatus,
  Event,
  GalleryAlbum,
  GalleryImage,
  HomepageConfig,
  MediaAsset,
  NavigationItem,
  NewsArticle,
  Notice,
  Page,
  Person,
  PersonCategory,
  Publication,
  PublicationType,
  ResearchArea,
  ResearchProject,
  ResearchStatus,
  Resource,
  SiteSettings,
} from '@/types/content';

type PublishedFilter = {
  includeDrafts?: boolean;
};

function isPublished(status: ContentStatus): boolean {
  return status === 'published';
}

function filterPublished<T extends { status: ContentStatus }>(
  items: T[],
  options?: PublishedFilter,
): T[] {
  if (options?.includeDrafts) return items;
  return items.filter((item) => isPublished(item.status));
}

function byOrder<T extends { order?: number }>(a: T, b: T): number {
  return (a.order ?? 999) - (b.order ?? 999);
}

export function getSiteSettings(): SiteSettings {
  return getSeedDatabase().siteSettings;
}

export function getNavigation(): {
  main: NavigationItem[];
  footer: NavigationItem[];
  knowledgeHub: NavigationItem[];
} {
  return getSeedDatabase().navigation;
}

export function getHomepageConfig(): HomepageConfig {
  return getSeedDatabase().homepage;
}

export function getPages(options?: PublishedFilter): Page[] {
  return filterPublished(getSeedDatabase().pages, options).sort(byOrder);
}

export function getPageBySlug(
  slug: string,
  options?: PublishedFilter,
): Page | undefined {
  return getPages(options).find((page) => page.slug === slug);
}

export function getPeople(
  options?: PublishedFilter & { category?: PersonCategory },
): Person[] {
  let people = filterPublished(getSeedDatabase().people, options);
  if (options?.category) {
    people = people.filter((person) => person.category === options.category);
  }
  return people.sort(byOrder);
}

export function getPersonBySlug(
  slug: string,
  options?: PublishedFilter,
): Person | undefined {
  return getPeople(options).find((person) => person.slug === slug);
}

export function getPersonById(
  id: string,
  options?: PublishedFilter,
): Person | undefined {
  return getPeople(options).find((person) => person.id === id);
}

export function getResearchAreas(options?: PublishedFilter): ResearchArea[] {
  return filterPublished(getSeedDatabase().researchAreas, options).sort(byOrder);
}

export function getResearchAreaBySlug(
  slug: string,
  options?: PublishedFilter,
): ResearchArea | undefined {
  return getResearchAreas(options).find((area) => area.slug === slug);
}

export function getResearchProjects(
  options?: PublishedFilter & { researchStatus?: ResearchStatus },
): ResearchProject[] {
  let projects = filterPublished(getSeedDatabase().researchProjects, options);
  if (options?.researchStatus) {
    projects = projects.filter(
      (project) => project.researchStatus === options.researchStatus,
    );
  }
  return projects;
}

export function getResearchProjectBySlug(
  slug: string,
  options?: PublishedFilter,
): ResearchProject | undefined {
  return getResearchProjects(options).find((project) => project.slug === slug);
}

export function getResearchProjectById(
  id: string,
  options?: PublishedFilter,
): ResearchProject | undefined {
  return getResearchProjects(options).find((project) => project.id === id);
}

export function getPublications(
  options?: PublishedFilter & { type?: PublicationType; year?: number },
): Publication[] {
  let publications = filterPublished(getSeedDatabase().publications, options);
  if (options?.type) {
    publications = publications.filter((pub) => pub.type === options.type);
  }
  if (options?.year != null) {
    publications = publications.filter((pub) => pub.year === options.year);
  }
  return publications.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
}

export function getPublicationBySlug(
  slug: string,
  options?: PublishedFilter,
): Publication | undefined {
  return getPublications(options).find((pub) => pub.slug === slug);
}

export function getPublicationById(
  id: string,
  options?: PublishedFilter,
): Publication | undefined {
  return getPublications(options).find((pub) => pub.id === id);
}

export function getActivities(options?: PublishedFilter): Activity[] {
  return filterPublished(getSeedDatabase().activities, options).sort(byOrder);
}

export function getActivityBySlug(
  slug: string,
  options?: PublishedFilter,
): Activity | undefined {
  return getActivities(options).find((activity) => activity.slug === slug);
}

export function getNews(options?: PublishedFilter): NewsArticle[] {
  return filterPublished(getSeedDatabase().news, options).sort((a, b) => {
    const aDate = a.publishedAt ?? a.createdAt;
    const bDate = b.publishedAt ?? b.createdAt;
    return bDate.localeCompare(aDate);
  });
}

export function getNewsBySlug(
  slug: string,
  options?: PublishedFilter,
): NewsArticle | undefined {
  return getNews(options).find((article) => article.slug === slug);
}

export function getEvents(
  options?: PublishedFilter & { eventStatus?: Event['eventStatus'] },
): Event[] {
  let events = filterPublished(getSeedDatabase().events, options);
  if (options?.eventStatus) {
    events = events.filter((event) => event.eventStatus === options.eventStatus);
  }
  return events.sort((a, b) => b.startAt.localeCompare(a.startAt));
}

export function getEventBySlug(
  slug: string,
  options?: PublishedFilter,
): Event | undefined {
  return getEvents(options).find((event) => event.slug === slug);
}

export function getNotices(options?: PublishedFilter): Notice[] {
  return filterPublished(getSeedDatabase().notices, options).sort((a, b) => {
    const aDate = a.publishedAt ?? a.createdAt;
    const bDate = b.publishedAt ?? b.createdAt;
    return bDate.localeCompare(aDate);
  });
}

export function getNoticeBySlug(
  slug: string,
  options?: PublishedFilter,
): Notice | undefined {
  return getNotices(options).find((notice) => notice.slug === slug);
}

export function getResources(options?: PublishedFilter): Resource[] {
  return filterPublished(getSeedDatabase().resources, options);
}

export function getResourceBySlug(
  slug: string,
  options?: PublishedFilter,
): Resource | undefined {
  return getResources(options).find((resource) => resource.slug === slug);
}

export function getGalleryAlbums(options?: PublishedFilter): GalleryAlbum[] {
  return filterPublished(getSeedDatabase().galleryAlbums, options);
}

export function getGalleryImages(options?: PublishedFilter): GalleryImage[] {
  return filterPublished(getSeedDatabase().galleryImages, options).sort(byOrder);
}

export function getMedia(options?: PublishedFilter): MediaAsset[] {
  return filterPublished(getSeedDatabase().media, options);
}

export function getMediaById(
  id: string,
  options?: PublishedFilter,
): MediaAsset | undefined {
  return getMedia(options).find((asset) => asset.id === id);
}
