/** Content model for BK School of Research CMS / seed data */

export type ContentStatus = 'draft' | 'published' | 'archived';

export type PublicationType =
  | 'journal'
  | 'book-chapter'
  | 'conference'
  | 'opinion'
  | 'report'
  | 'newsletter'
  | 'annual-report'
  | 'policy-brief'
  | 'working-paper';

export type ResearchStatus = 'ongoing' | 'completed' | 'planned' | 'archived';

export type PersonCategory =
  | 'executive-director'
  | 'distinguished-fellow'
  | 'research-team'
  | 'administrative-team'
  | 'alumni'
  | 'other';

export type ActivityType =
  | 'capacity-building'
  | 'awareness-campaign'
  | 'research-talk'
  | 'innovation-showcasing';

export type EventStatus = 'upcoming' | 'past' | 'cancelled';

export type NoticeType =
  | 'vacancy'
  | 'announcement'
  | 'deadline'
  | 'general';

export type ResourceType =
  | 'tutorial'
  | 'video-series'
  | 'archive'
  | 'tool-guide'
  | 'document'
  | 'other';

export type MediaKind = 'image' | 'video' | 'document' | 'audio' | 'other';

export type HomepageSectionType =
  | 'hero'
  | 'stats'
  | 'featured-research'
  | 'featured-publications'
  | 'director-message'
  | 'research-areas'
  | 'activities'
  | 'news'
  | 'events'
  | 'cta'
  | 'custom';

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonicalPath?: string;
  noIndex?: boolean;
}

export interface Timestamps {
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
}

export interface ContentBase extends Timestamps {
  id: string;
  slug: string;
  status: ContentStatus;
  seo?: SEOData;
}

export interface SiteSettings {
  id: string;
  organizationName: string;
  organizationShortName: string;
  tagline: string;
  positioningStatement: string;
  motto?: string;
  mission: string;
  vision: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    district: string;
    postalCode: string;
    country: string;
    full: string;
  };
  phone: string;
  emails: {
    general: string;
    executiveDirector: string;
    researchDirector: string;
  };
  social: {
    facebook?: string;
    youtube?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  foundedYear: number;
  copyright: string;
  defaultSeo: SEOData;
  updatedAt: string;
}

export interface Page extends ContentBase {
  title: string;
  excerpt?: string;
  body: string;
  bodyHtml?: string;
  template?: string;
  parentId?: string | null;
  order?: number;
  originalLegacyUrl?: string;
}

export interface Person extends ContentBase {
  name: string;
  role: string;
  category: PersonCategory;
  affiliation?: string;
  bio: string;
  shortBio?: string;
  email?: string;
  phone?: string;
  photoId?: string | null;
  photoUrl?: string | null;
  researchInterests?: string[];
  order?: number;
  legacyRoleNote?: string;
  originalLegacyUrl?: string;
}

export interface ResearchArea extends ContentBase {
  title: string;
  description: string;
  shortDescription?: string;
  order?: number;
  relatedProjectIds?: string[];
  relatedPublicationIds?: string[];
}

export interface ResearchProject extends ContentBase {
  title: string;
  summary: string;
  description?: string;
  researchStatus: ResearchStatus;
  areaIds: string[];
  leadAuthorNames: string[];
  year?: number;
  startYear?: number;
  endYear?: number | null;
  publicationIds?: string[];
  themeCount?: number;
  /** Optional feature visual (may be prototype media) */
  featuredImageUrl?: string | null;
  originalLegacyUrl?: string;
}

export interface Publication extends ContentBase {
  title: string;
  type: PublicationType;
  authors: string[];
  year: number;
  citation: string;
  venue?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
  doi?: string | null;
  url?: string | null;
  abstract?: string;
  /** Optional cover / report visual (may be prototype media) */
  coverImageUrl?: string | null;
  areaIds?: string[];
  projectId?: string | null;
  language?: string;
  originalLegacyUrl?: string;
}

export interface Activity extends ContentBase {
  title: string;
  type: ActivityType;
  summary: string;
  description: string;
  relatedEventIds?: string[];
  /** Optional section / card visual (may be prototype media) */
  imageUrl?: string | null;
  order?: number;
}

export interface NewsArticle extends ContentBase {
  title: string;
  excerpt: string;
  body: string;
  bodyHtml?: string;
  author?: string;
  categoryLabels?: string[];
  featuredImageId?: string | null;
  featuredImageUrl?: string | null;
  originalLegacyUrl?: string;
  language?: string;
}

export interface Event extends ContentBase {
  title: string;
  summary: string;
  description: string;
  eventStatus: EventStatus;
  startAt: string;
  endAt?: string | null;
  location?: string;
  isOnline?: boolean;
  registrationUrl?: string | null;
  /** YouTube / archive recording when available */
  recordingUrl?: string | null;
  featuredImageUrl?: string | null;
  speakers?: string[];
  originalLegacyUrl?: string;
}

export interface Notice extends ContentBase {
  title: string;
  summary: string;
  body: string;
  noticeType: NoticeType;
  deadlineAt?: string | null;
  featuredImageUrl?: string | null;
  originalLegacyUrl?: string;
  language?: string;
}

export interface Resource extends ContentBase {
  title: string;
  summary: string;
  description: string;
  resourceType: ResourceType;
  topics?: string[];
  software?: string[];
  externalUrl?: string | null;
  notes?: string;
  originalLegacyUrl?: string;
}

export interface GalleryAlbum extends ContentBase {
  title: string;
  description?: string;
  coverImageId?: string | null;
  imageIds: string[];
  comingSoon?: boolean;
}

export interface GalleryImage extends Timestamps {
  id: string;
  albumId: string;
  title?: string;
  caption?: string;
  alt: string;
  mediaId?: string | null;
  url: string;
  order?: number;
  status: ContentStatus;
}

export interface MediaAsset extends Timestamps {
  id: string;
  kind: MediaKind;
  title: string;
  alt?: string;
  url: string;
  source?: string;
  width?: number;
  height?: number;
  credit?: string;
  status: ContentStatus;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  description?: string;
  children?: NavigationItem[];
  external?: boolean;
  /** When false, hidden from public menus. Undefined = visible. */
  visible?: boolean;
  order: number;
}

export interface HomepageStat {
  id: string;
  label: string;
  value: string;
  /** Whether this figure is confirmed from legacy/org sources */
  verified: boolean;
  note?: string;
  order: number;
}

export interface HomepageSection {
  id: string;
  type: HomepageSectionType;
  title?: string;
  enabled: boolean;
  order: number;
  config?: Record<string, unknown>;
}

export interface HomepageConfig {
  id: string;
  heroEyebrow?: string;
  heroTitle: string;
  heroSubtitle: string;
  /** Optional hero media URL (prototype or authentic) */
  heroImageUrl?: string | null;
  heroCtas: { label: string; href: string; variant?: 'primary' | 'secondary' }[];
  directorPersonId: string;
  directorMessageExcerpt: string;
  featuredResearchProjectIds: string[];
  featuredPublicationIds: string[];
  featuredNewsIds: string[];
  featuredEventIds: string[];
  sections: HomepageSection[];
  stats: HomepageStat[];
  updatedAt: string;
}

export type ContentCollectionKey =
  | 'pages'
  | 'people'
  | 'researchAreas'
  | 'researchProjects'
  | 'publications'
  | 'activities'
  | 'news'
  | 'events'
  | 'notices'
  | 'resources'
  | 'galleryAlbums'
  | 'galleryImages'
  | 'media';

export interface ContentDatabase {
  version: number;
  siteSettings: SiteSettings;
  navigation: {
    main: NavigationItem[];
    footer: NavigationItem[];
    knowledgeHub: NavigationItem[];
  };
  homepage: HomepageConfig;
  pages: Page[];
  people: Person[];
  researchAreas: ResearchArea[];
  researchProjects: ResearchProject[];
  publications: Publication[];
  activities: Activity[];
  news: NewsArticle[];
  events: Event[];
  notices: Notice[];
  resources: Resource[];
  galleryAlbums: GalleryAlbum[];
  galleryImages: GalleryImage[];
  media: MediaAsset[];
}

export type CollectionEntityMap = {
  pages: Page;
  people: Person;
  researchAreas: ResearchArea;
  researchProjects: ResearchProject;
  publications: Publication;
  activities: Activity;
  news: NewsArticle;
  events: Event;
  notices: Notice;
  resources: Resource;
  galleryAlbums: GalleryAlbum;
  galleryImages: GalleryImage;
  media: MediaAsset;
};
