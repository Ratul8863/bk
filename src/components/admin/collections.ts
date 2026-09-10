import type {
  Activity,
  ContentCollectionKey,
  ContentStatus,
  Event,
  GalleryAlbum,
  MediaAsset,
  NewsArticle,
  Notice,
  Page,
  Person,
  PersonCategory,
  Publication,
  ResearchArea,
  ResearchProject,
  Resource,
} from '@/types/content';

export type AdminCollectionSlug =
  | 'publications'
  | 'research'
  | 'news'
  | 'events'
  | 'notices'
  | 'people'
  | 'activities'
  | 'resources'
  | 'pages'
  | 'gallery'
  | 'media'
  | 'research-areas';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'tags'
  | 'checkbox'
  | 'datetime'
  | 'url'
  | 'slug'
  | 'status'
  | 'body';

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  tab?: 'content' | 'metadata' | 'media' | 'relations' | 'seo';
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  required?: boolean;
}

export interface CollectionConfig {
  slug: AdminCollectionSlug;
  key: ContentCollectionKey;
  singular: string;
  plural: string;
  addLabel: string;
  searchFields: string[];
  previewPath?: (item: { slug?: string; status?: ContentStatus; researchStatus?: string }) => string | null;
  listColumns: { key: string; label: string; render?: 'status' | 'date' | 'text' }[];
  filters?: {
    name: string;
    label: string;
    options: { value: string; label: string }[];
  }[];
  fields: FieldDef[];
  defaults: () => Record<string, unknown>;
  getTitle: (item: Record<string, unknown>) => string;
  canDuplicate?: boolean;
}

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

const seoFields: FieldDef[] = [
  { name: 'seo.title', label: 'SEO Title', type: 'text', tab: 'seo' },
  {
    name: 'seo.description',
    label: 'SEO Description',
    type: 'textarea',
    tab: 'seo',
    rows: 3,
  },
  {
    name: 'seo.keywords',
    label: 'Keywords',
    type: 'tags',
    tab: 'seo',
    help: 'Comma-separated keywords',
  },
  { name: 'seo.ogImage', label: 'OG Image URL', type: 'url', tab: 'seo' },
  {
    name: 'seo.canonicalPath',
    label: 'Canonical Path',
    type: 'text',
    tab: 'seo',
    placeholder: '/path',
  },
  { name: 'seo.noIndex', label: 'Hide from search engines', type: 'checkbox', tab: 'seo' },
];

const personCategories: { value: PersonCategory; label: string }[] = [
  { value: 'executive-director', label: 'Executive Director' },
  { value: 'distinguished-fellow', label: 'Distinguished Fellow' },
  { value: 'research-team', label: 'Research Team' },
  { value: 'administrative-team', label: 'Administrative Team' },
  { value: 'alumni', label: 'Alumni' },
  { value: 'other', label: 'Other' },
];

function nowIso() {
  return new Date().toISOString();
}

export const collectionConfigs: Record<AdminCollectionSlug, CollectionConfig> = {
  publications: {
    slug: 'publications',
    key: 'publications',
    singular: 'Publication',
    plural: 'Publications',
    addLabel: 'Add Publication',
    searchFields: ['title', 'citation', 'authors', 'venue'],
    previewPath: (item) => (item.slug ? `/publications/${item.slug}` : null),
    canDuplicate: true,
    listColumns: [
      { key: 'title', label: 'Title' },
      { key: 'type', label: 'Type' },
      { key: 'year', label: 'Year' },
      { key: 'status', label: 'Status', render: 'status' },
      { key: 'updatedAt', label: 'Updated', render: 'date' },
    ],
    filters: [
      {
        name: 'status',
        label: 'Status',
        options: statusOptions,
      },
      {
        name: 'type',
        label: 'Type',
        options: [
          { value: 'journal', label: 'Journal' },
          { value: 'book-chapter', label: 'Book chapter' },
          { value: 'conference', label: 'Conference' },
          { value: 'opinion', label: 'Opinion' },
          { value: 'report', label: 'Report' },
          { value: 'newsletter', label: 'Newsletter' },
          { value: 'annual-report', label: 'Annual report' },
          { value: 'policy-brief', label: 'Policy brief' },
          { value: 'working-paper', label: 'Working paper' },
        ],
      },
    ],
    getTitle: (item) => String(item.title ?? 'Untitled publication'),
    defaults: () => ({
      title: '',
      slug: '',
      status: 'draft',
      type: 'journal',
      authors: [],
      year: new Date().getFullYear(),
      citation: '',
      venue: '',
      abstract: '',
      areaIds: [],
      projectId: null,
      doi: null,
      url: null,
      seo: {},
    }),
    fields: [
      { name: 'title', label: 'Title', type: 'text', tab: 'content', required: true },
      { name: 'slug', label: 'Slug', type: 'slug', tab: 'content' },
      { name: 'status', label: 'Status', type: 'status', tab: 'content' },
      {
        name: 'type',
        label: 'Publication Type',
        type: 'select',
        tab: 'content',
        options: [
          { value: 'journal', label: 'Journal' },
          { value: 'book-chapter', label: 'Book chapter' },
          { value: 'conference', label: 'Conference' },
          { value: 'opinion', label: 'Opinion' },
          { value: 'report', label: 'Report' },
          { value: 'newsletter', label: 'Newsletter' },
          { value: 'annual-report', label: 'Annual report' },
          { value: 'policy-brief', label: 'Policy brief' },
          { value: 'working-paper', label: 'Working paper' },
        ],
      },
      { name: 'authors', label: 'Authors', type: 'tags', tab: 'content', help: 'Comma-separated' },
      { name: 'year', label: 'Year', type: 'number', tab: 'content' },
      { name: 'citation', label: 'Citation', type: 'textarea', tab: 'content', rows: 3 },
      { name: 'abstract', label: 'Abstract', type: 'body', tab: 'content', rows: 8 },
      { name: 'venue', label: 'Venue / Journal', type: 'text', tab: 'metadata' },
      { name: 'volume', label: 'Volume', type: 'text', tab: 'metadata' },
      { name: 'issue', label: 'Issue', type: 'text', tab: 'metadata' },
      { name: 'pages', label: 'Pages', type: 'text', tab: 'metadata' },
      { name: 'publisher', label: 'Publisher', type: 'text', tab: 'metadata' },
      { name: 'doi', label: 'DOI', type: 'text', tab: 'metadata' },
      { name: 'url', label: 'External URL', type: 'url', tab: 'metadata' },
      { name: 'coverImageUrl', label: 'Cover image URL', type: 'url', tab: 'media', help: 'Prototype or authentic cover visual' },
      { name: 'language', label: 'Language', type: 'text', tab: 'metadata' },
      {
        name: 'areaIds',
        label: 'Research Areas',
        type: 'tags',
        tab: 'relations',
        help: 'Area IDs, comma-separated',
      },
      { name: 'projectId', label: 'Related research project', type: 'text', tab: 'relations' },
      ...seoFields,
    ],
  },

  research: {
    slug: 'research',
    key: 'researchProjects',
    singular: 'Research Project',
    plural: 'Research Projects',
    addLabel: 'Add Research Project',
    searchFields: ['title', 'summary', 'leadAuthorNames'],
    previewPath: (item) => {
      if (!item.slug) return null;
      const bucket = item.researchStatus === 'ongoing' ? 'ongoing' : 'previous';
      return `/research/${bucket}/${item.slug}`;
    },
    canDuplicate: true,
    listColumns: [
      { key: 'title', label: 'Title' },
      { key: 'researchStatus', label: 'Research status' },
      { key: 'status', label: 'Status', render: 'status' },
      { key: 'updatedAt', label: 'Updated', render: 'date' },
    ],
    filters: [
      { name: 'status', label: 'Status', options: statusOptions },
      {
        name: 'researchStatus',
        label: 'Project status',
        options: [
          { value: 'ongoing', label: 'Ongoing' },
          { value: 'completed', label: 'Completed' },
          { value: 'planned', label: 'Planned' },
          { value: 'archived', label: 'Archived' },
        ],
      },
    ],
    getTitle: (item) => String(item.title ?? 'Untitled project'),
    defaults: () => ({
      title: '',
      slug: '',
      status: 'draft',
      summary: '',
      description: '',
      researchStatus: 'ongoing',
      areaIds: [],
      leadAuthorNames: [],
      year: new Date().getFullYear(),
      seo: {},
    }),
    fields: [
      { name: 'title', label: 'Title', type: 'text', tab: 'content', required: true },
      { name: 'slug', label: 'Slug', type: 'slug', tab: 'content' },
      { name: 'status', label: 'Status', type: 'status', tab: 'content' },
      {
        name: 'researchStatus',
        label: 'Research Status',
        type: 'select',
        tab: 'content',
        options: [
          { value: 'ongoing', label: 'Ongoing' },
          { value: 'completed', label: 'Completed' },
          { value: 'planned', label: 'Planned' },
          { value: 'archived', label: 'Archived' },
        ],
      },
      { name: 'summary', label: 'Summary', type: 'textarea', tab: 'content', rows: 3 },
      { name: 'description', label: 'Description', type: 'body', tab: 'content', rows: 10 },
      {
        name: 'leadAuthorNames',
        label: 'Lead Authors',
        type: 'tags',
        tab: 'metadata',
      },
      { name: 'year', label: 'Year', type: 'number', tab: 'metadata' },
      { name: 'startYear', label: 'Start Year', type: 'number', tab: 'metadata' },
      { name: 'endYear', label: 'End Year', type: 'number', tab: 'metadata' },
      {
        name: 'featuredImageUrl',
        label: 'Feature image URL',
        type: 'url',
        tab: 'media',
        help: 'Prototype or authentic project visual',
      },
      {
        name: 'areaIds',
        label: 'Research Areas',
        type: 'tags',
        tab: 'relations',
        help: 'Area IDs',
      },
      {
        name: 'publicationIds',
        label: 'Publication IDs',
        type: 'tags',
        tab: 'relations',
      },
      ...seoFields,
    ],
  },

  news: {
    slug: 'news',
    key: 'news',
    singular: 'News Article',
    plural: 'News',
    addLabel: 'Add News Article',
    searchFields: ['title', 'excerpt', 'body', 'author'],
    previewPath: (item) => (item.slug ? `/news/${item.slug}` : null),
    canDuplicate: true,
    listColumns: [
      { key: 'title', label: 'Title' },
      { key: 'status', label: 'Status', render: 'status' },
      { key: 'updatedAt', label: 'Updated', render: 'date' },
    ],
    filters: [{ name: 'status', label: 'Status', options: statusOptions }],
    getTitle: (item) => String(item.title ?? 'Untitled article'),
    defaults: () => ({
      title: '',
      slug: '',
      status: 'draft',
      excerpt: '',
      body: '',
      author: '',
      categoryLabels: [],
      featuredImageUrl: null,
      seo: {},
    }),
    fields: [
      { name: 'title', label: 'Title', type: 'text', tab: 'content', required: true },
      { name: 'slug', label: 'Slug', type: 'slug', tab: 'content' },
      { name: 'status', label: 'Status', type: 'status', tab: 'content' },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea', tab: 'content', rows: 3 },
      { name: 'body', label: 'Body', type: 'body', tab: 'content', rows: 12 },
      { name: 'author', label: 'Author', type: 'text', tab: 'metadata' },
      { name: 'categoryLabels', label: 'Categories', type: 'tags', tab: 'metadata' },
      { name: 'language', label: 'Language', type: 'text', tab: 'metadata' },
      {
        name: 'featuredImageUrl',
        label: 'Featured Image',
        type: 'url',
        tab: 'media',
        placeholder: 'https://…',
      },
      ...seoFields,
    ],
  },

  events: {
    slug: 'events',
    key: 'events',
    singular: 'Event',
    plural: 'Events',
    addLabel: 'Add Event',
    searchFields: ['title', 'summary', 'location', 'speakers'],
    previewPath: (item) => (item.slug ? `/events/${item.slug}` : null),
    canDuplicate: true,
    listColumns: [
      { key: 'title', label: 'Title' },
      { key: 'eventStatus', label: 'Event status' },
      { key: 'startAt', label: 'Starts', render: 'date' },
      { key: 'status', label: 'Status', render: 'status' },
    ],
    filters: [
      { name: 'status', label: 'Status', options: statusOptions },
      {
        name: 'eventStatus',
        label: 'Event status',
        options: [
          { value: 'upcoming', label: 'Upcoming' },
          { value: 'past', label: 'Past' },
          { value: 'cancelled', label: 'Cancelled' },
        ],
      },
    ],
    getTitle: (item) => String(item.title ?? 'Untitled event'),
    defaults: () => ({
      title: '',
      slug: '',
      status: 'draft',
      summary: '',
      description: '',
      eventStatus: 'upcoming',
      startAt: nowIso(),
      endAt: null,
      location: '',
      isOnline: false,
      speakers: [],
      featuredImageUrl: null,
      seo: {},
    }),
    fields: [
      { name: 'title', label: 'Title', type: 'text', tab: 'content', required: true },
      { name: 'slug', label: 'Slug', type: 'slug', tab: 'content' },
      { name: 'status', label: 'Status', type: 'status', tab: 'content' },
      {
        name: 'eventStatus',
        label: 'Event Status',
        type: 'select',
        tab: 'content',
        options: [
          { value: 'upcoming', label: 'Upcoming' },
          { value: 'past', label: 'Past' },
          { value: 'cancelled', label: 'Cancelled' },
        ],
      },
      { name: 'summary', label: 'Summary', type: 'textarea', tab: 'content', rows: 3 },
      { name: 'description', label: 'Description', type: 'body', tab: 'content', rows: 10 },
      { name: 'startAt', label: 'Start', type: 'datetime', tab: 'metadata' },
      { name: 'endAt', label: 'End', type: 'datetime', tab: 'metadata' },
      { name: 'location', label: 'Location', type: 'text', tab: 'metadata' },
      { name: 'isOnline', label: 'Online event', type: 'checkbox', tab: 'metadata' },
      { name: 'registrationUrl', label: 'Registration URL', type: 'url', tab: 'metadata' },
      { name: 'recordingUrl', label: 'Recording URL', type: 'url', tab: 'metadata' },
      { name: 'speakers', label: 'Speakers', type: 'tags', tab: 'relations' },
      {
        name: 'featuredImageUrl',
        label: 'Featured Image',
        type: 'url',
        tab: 'media',
      },
      ...seoFields,
    ],
  },

  notices: {
    slug: 'notices',
    key: 'notices',
    singular: 'Notice',
    plural: 'Notices',
    addLabel: 'Add Notice',
    searchFields: ['title', 'summary', 'body'],
    previewPath: (item) => (item.slug ? `/notices/${item.slug}` : null),
    canDuplicate: true,
    listColumns: [
      { key: 'title', label: 'Title' },
      { key: 'noticeType', label: 'Type' },
      { key: 'status', label: 'Status', render: 'status' },
      { key: 'updatedAt', label: 'Updated', render: 'date' },
    ],
    filters: [
      { name: 'status', label: 'Status', options: statusOptions },
      {
        name: 'noticeType',
        label: 'Type',
        options: [
          { value: 'vacancy', label: 'Vacancy' },
          { value: 'announcement', label: 'Announcement' },
          { value: 'deadline', label: 'Deadline' },
          { value: 'general', label: 'General' },
        ],
      },
    ],
    getTitle: (item) => String(item.title ?? 'Untitled notice'),
    defaults: () => ({
      title: '',
      slug: '',
      status: 'draft',
      summary: '',
      body: '',
      noticeType: 'announcement',
      deadlineAt: null,
      featuredImageUrl: null,
      seo: {},
    }),
    fields: [
      { name: 'title', label: 'Title', type: 'text', tab: 'content', required: true },
      { name: 'slug', label: 'Slug', type: 'slug', tab: 'content' },
      { name: 'status', label: 'Status', type: 'status', tab: 'content' },
      {
        name: 'noticeType',
        label: 'Notice Type',
        type: 'select',
        tab: 'content',
        options: [
          { value: 'vacancy', label: 'Vacancy' },
          { value: 'announcement', label: 'Announcement' },
          { value: 'deadline', label: 'Deadline' },
          { value: 'general', label: 'General' },
        ],
      },
      { name: 'summary', label: 'Summary', type: 'textarea', tab: 'content', rows: 3 },
      { name: 'body', label: 'Body', type: 'body', tab: 'content', rows: 12 },
      { name: 'deadlineAt', label: 'Deadline', type: 'datetime', tab: 'metadata' },
      { name: 'language', label: 'Language', type: 'text', tab: 'metadata' },
      {
        name: 'featuredImageUrl',
        label: 'Featured Image',
        type: 'url',
        tab: 'media',
      },
      ...seoFields,
    ],
  },

  people: {
    slug: 'people',
    key: 'people',
    singular: 'Person',
    plural: 'People',
    addLabel: 'Add Person',
    searchFields: ['name', 'role', 'bio', 'affiliation'],
    previewPath: (item) => (item.slug ? `/people/${item.slug}` : null),
    canDuplicate: true,
    listColumns: [
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
      { key: 'category', label: 'Category' },
      { key: 'status', label: 'Status', render: 'status' },
    ],
    filters: [
      { name: 'status', label: 'Status', options: statusOptions },
      { name: 'category', label: 'Category', options: personCategories },
    ],
    getTitle: (item) => String(item.name ?? 'Untitled person'),
    defaults: () => ({
      name: '',
      slug: '',
      status: 'draft',
      role: '',
      category: 'research-team',
      bio: '',
      shortBio: '',
      researchInterests: [],
      photoUrl: null,
      order: 99,
      seo: {},
    }),
    fields: [
      { name: 'name', label: 'Name', type: 'text', tab: 'content', required: true },
      { name: 'slug', label: 'URL slug', type: 'slug', tab: 'content' },
      // Reserved: executive-director, distinguished-fellows, research-team, administrative-team
      { name: 'status', label: 'Status', type: 'status', tab: 'content' },
      { name: 'role', label: 'Role', type: 'text', tab: 'content' },
      {
        name: 'category',
        label: 'Category',
        type: 'select',
        tab: 'content',
        options: personCategories,
      },
      { name: 'shortBio', label: 'Short Bio', type: 'textarea', tab: 'content', rows: 3 },
      { name: 'bio', label: 'Biography', type: 'body', tab: 'content', rows: 12 },
      { name: 'affiliation', label: 'Affiliation', type: 'text', tab: 'metadata' },
      { name: 'email', label: 'Email', type: 'text', tab: 'metadata' },
      { name: 'phone', label: 'Phone', type: 'text', tab: 'metadata' },
      { name: 'order', label: 'Display Order', type: 'number', tab: 'metadata' },
      {
        name: 'researchInterests',
        label: 'Research Interests',
        type: 'tags',
        tab: 'relations',
      },
      { name: 'photoUrl', label: 'Photo URL', type: 'url', tab: 'media' },
      ...seoFields,
    ],
  },

  activities: {
    slug: 'activities',
    key: 'activities',
    singular: 'Activity',
    plural: 'Activities',
    addLabel: 'Add Activity',
    searchFields: ['title', 'summary', 'description'],
    previewPath: (item) => (item.slug ? `/activities/${item.slug}` : null),
    canDuplicate: true,
    listColumns: [
      { key: 'title', label: 'Title' },
      { key: 'type', label: 'Type' },
      { key: 'status', label: 'Status', render: 'status' },
      { key: 'updatedAt', label: 'Updated', render: 'date' },
    ],
    filters: [
      { name: 'status', label: 'Status', options: statusOptions },
      {
        name: 'type',
        label: 'Type',
        options: [
          { value: 'capacity-building', label: 'Capacity building' },
          { value: 'awareness-campaign', label: 'Awareness campaign' },
          { value: 'research-talk', label: 'Research talk' },
          { value: 'innovation-showcasing', label: 'Innovation showcasing' },
        ],
      },
    ],
    getTitle: (item) => String(item.title ?? 'Untitled activity'),
    defaults: () => ({
      title: '',
      slug: '',
      status: 'draft',
      type: 'capacity-building',
      summary: '',
      description: '',
      relatedEventIds: [],
      order: 99,
      seo: {},
    }),
    fields: [
      { name: 'title', label: 'Title', type: 'text', tab: 'content', required: true },
      { name: 'slug', label: 'Slug', type: 'slug', tab: 'content' },
      { name: 'status', label: 'Status', type: 'status', tab: 'content' },
      {
        name: 'type',
        label: 'Activity Type',
        type: 'select',
        tab: 'content',
        options: [
          { value: 'capacity-building', label: 'Capacity building' },
          { value: 'awareness-campaign', label: 'Awareness campaign' },
          { value: 'research-talk', label: 'Research talk' },
          { value: 'innovation-showcasing', label: 'Innovation showcasing' },
        ],
      },
      { name: 'summary', label: 'Summary', type: 'textarea', tab: 'content', rows: 3 },
      { name: 'description', label: 'Description', type: 'body', tab: 'content', rows: 10 },
      {
        name: 'imageUrl',
        label: 'Image URL',
        type: 'url',
        tab: 'media',
        help: 'Prototype or authentic programme visual',
      },
      { name: 'order', label: 'Display Order', type: 'number', tab: 'metadata' },
      {
        name: 'relatedEventIds',
        label: 'Related events',
        type: 'tags',
        tab: 'relations',
      },
      ...seoFields,
    ],
  },

  resources: {
    slug: 'resources',
    key: 'resources',
    singular: 'Resource',
    plural: 'Resources',
    addLabel: 'Add Resource',
    searchFields: ['title', 'summary', 'topics', 'software'],
    previewPath: (item) => (item.slug ? `/resources/${item.slug}` : null),
    canDuplicate: true,
    listColumns: [
      { key: 'title', label: 'Title' },
      { key: 'resourceType', label: 'Type' },
      { key: 'status', label: 'Status', render: 'status' },
      { key: 'updatedAt', label: 'Updated', render: 'date' },
    ],
    filters: [
      { name: 'status', label: 'Status', options: statusOptions },
      {
        name: 'resourceType',
        label: 'Type',
        options: [
          { value: 'tutorial', label: 'Tutorial' },
          { value: 'video-series', label: 'Video series' },
          { value: 'archive', label: 'Archive' },
          { value: 'tool-guide', label: 'Tool guide' },
          { value: 'document', label: 'Document' },
          { value: 'other', label: 'Other' },
        ],
      },
    ],
    getTitle: (item) => String(item.title ?? 'Untitled resource'),
    defaults: () => ({
      title: '',
      slug: '',
      status: 'draft',
      summary: '',
      description: '',
      resourceType: 'tutorial',
      topics: [],
      software: [],
      externalUrl: null,
      seo: {},
    }),
    fields: [
      { name: 'title', label: 'Title', type: 'text', tab: 'content', required: true },
      { name: 'slug', label: 'Slug', type: 'slug', tab: 'content' },
      { name: 'status', label: 'Status', type: 'status', tab: 'content' },
      {
        name: 'resourceType',
        label: 'Resource Type',
        type: 'select',
        tab: 'content',
        options: [
          { value: 'tutorial', label: 'Tutorial' },
          { value: 'video-series', label: 'Video series' },
          { value: 'archive', label: 'Archive' },
          { value: 'tool-guide', label: 'Tool guide' },
          { value: 'document', label: 'Document' },
          { value: 'other', label: 'Other' },
        ],
      },
      { name: 'summary', label: 'Summary', type: 'textarea', tab: 'content', rows: 3 },
      { name: 'description', label: 'Description', type: 'body', tab: 'content', rows: 10 },
      { name: 'topics', label: 'Topics', type: 'tags', tab: 'metadata' },
      { name: 'software', label: 'Software', type: 'tags', tab: 'metadata' },
      { name: 'externalUrl', label: 'External URL', type: 'url', tab: 'media' },
      { name: 'notes', label: 'Notes', type: 'textarea', tab: 'metadata', rows: 3 },
      ...seoFields,
    ],
  },

  pages: {
    slug: 'pages',
    key: 'pages',
    singular: 'Page',
    plural: 'Pages',
    addLabel: 'Add Page',
    searchFields: ['title', 'excerpt', 'body'],
    previewPath: (item) => (item.slug ? `/${item.slug}` : null),
    canDuplicate: true,
    listColumns: [
      { key: 'title', label: 'Title' },
      { key: 'template', label: 'Template' },
      { key: 'status', label: 'Status', render: 'status' },
      { key: 'updatedAt', label: 'Updated', render: 'date' },
    ],
    filters: [{ name: 'status', label: 'Status', options: statusOptions }],
    getTitle: (item) => String(item.title ?? 'Untitled page'),
    defaults: () => ({
      title: '',
      slug: '',
      status: 'draft',
      excerpt: '',
      body: '',
      template: 'default',
      order: 99,
      seo: {},
    }),
    fields: [
      { name: 'title', label: 'Title', type: 'text', tab: 'content', required: true },
      { name: 'slug', label: 'Slug', type: 'slug', tab: 'content' },
      { name: 'status', label: 'Status', type: 'status', tab: 'content' },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea', tab: 'content', rows: 3 },
      { name: 'body', label: 'Body', type: 'body', tab: 'content', rows: 14 },
      { name: 'template', label: 'Template', type: 'text', tab: 'metadata' },
      { name: 'order', label: 'Order', type: 'number', tab: 'metadata' },
      { name: 'parentId', label: 'Parent Page ID', type: 'text', tab: 'relations' },
      ...seoFields,
    ],
  },

  gallery: {
    slug: 'gallery',
    key: 'galleryAlbums',
    singular: 'Gallery Album',
    plural: 'Gallery',
    addLabel: 'Add Album',
    searchFields: ['title', 'description'],
    previewPath: () => '/gallery',
    canDuplicate: true,
    listColumns: [
      { key: 'title', label: 'Title' },
      { key: 'comingSoon', label: 'Coming soon' },
      { key: 'status', label: 'Status', render: 'status' },
      { key: 'updatedAt', label: 'Updated', render: 'date' },
    ],
    filters: [{ name: 'status', label: 'Status', options: statusOptions }],
    getTitle: (item) => String(item.title ?? 'Untitled album'),
    defaults: () => ({
      title: '',
      slug: '',
      status: 'draft',
      description: '',
      imageIds: [],
      comingSoon: true,
      seo: {},
    }),
    fields: [
      { name: 'title', label: 'Title', type: 'text', tab: 'content', required: true },
      { name: 'slug', label: 'Slug', type: 'slug', tab: 'content' },
      { name: 'status', label: 'Status', type: 'status', tab: 'content' },
      { name: 'description', label: 'Description', type: 'textarea', tab: 'content', rows: 4 },
      { name: 'comingSoon', label: 'Coming soon', type: 'checkbox', tab: 'metadata' },
      {
        name: 'imageIds',
        label: 'Image IDs',
        type: 'tags',
        tab: 'media',
        help: 'Gallery image IDs',
      },
      { name: 'coverImageId', label: 'Cover Image ID', type: 'text', tab: 'media' },
      ...seoFields,
    ],
  },

  media: {
    slug: 'media',
    key: 'media',
    singular: 'Media Asset',
    plural: 'Media',
    addLabel: 'Add Media',
    searchFields: ['title', 'alt', 'url', 'credit'],
    listColumns: [
      { key: 'title', label: 'Title' },
      { key: 'kind', label: 'Type' },
      { key: 'status', label: 'Status', render: 'status' },
      { key: 'updatedAt', label: 'Updated', render: 'date' },
    ],
    filters: [
      { name: 'status', label: 'Status', options: statusOptions },
      {
        name: 'kind',
        label: 'Kind',
        options: [
          { value: 'image', label: 'Image' },
          { value: 'video', label: 'Video' },
          { value: 'document', label: 'Document' },
          { value: 'audio', label: 'Audio' },
          { value: 'other', label: 'Other' },
        ],
      },
    ],
    getTitle: (item) => String(item.title ?? 'Untitled media'),
    defaults: () => ({
      title: '',
      kind: 'image',
      alt: '',
      url: '',
      status: 'published',
      credit: '',
      source: 'manual',
    }),
    fields: [
      { name: 'title', label: 'Title', type: 'text', tab: 'content', required: true },
      {
        name: 'kind',
        label: 'Type',
        type: 'select',
        tab: 'content',
        options: [
          { value: 'image', label: 'Image' },
          { value: 'video', label: 'Video' },
          { value: 'document', label: 'Document' },
          { value: 'audio', label: 'Audio' },
          { value: 'other', label: 'Other' },
        ],
      },
      { name: 'status', label: 'Status', type: 'status', tab: 'content' },
      { name: 'url', label: 'URL', type: 'url', tab: 'media', required: true },
      { name: 'alt', label: 'Alt text', type: 'text', tab: 'media' },
      { name: 'credit', label: 'Credit', type: 'text', tab: 'metadata' },
      { name: 'source', label: 'Source', type: 'text', tab: 'metadata' },
      { name: 'width', label: 'Width', type: 'number', tab: 'metadata' },
      { name: 'height', label: 'Height', type: 'number', tab: 'metadata' },
    ],
  },

  'research-areas': {
    slug: 'research-areas',
    key: 'researchAreas',
    singular: 'Research Area',
    plural: 'Research Areas',
    addLabel: 'Add Research Area',
    searchFields: ['title', 'description', 'shortDescription'],
    previewPath: (item) => (item.slug ? `/research/areas/${item.slug}` : null),
    canDuplicate: true,
    listColumns: [
      { key: 'title', label: 'Title' },
      { key: 'order', label: 'Order' },
      { key: 'status', label: 'Status', render: 'status' },
      { key: 'updatedAt', label: 'Updated', render: 'date' },
    ],
    filters: [{ name: 'status', label: 'Status', options: statusOptions }],
    getTitle: (item) => String(item.title ?? 'Untitled area'),
    defaults: () => ({
      title: '',
      slug: '',
      status: 'draft',
      description: '',
      shortDescription: '',
      order: 99,
      relatedProjectIds: [],
      relatedPublicationIds: [],
      seo: {},
    }),
    fields: [
      { name: 'title', label: 'Title', type: 'text', tab: 'content', required: true },
      { name: 'slug', label: 'Slug', type: 'slug', tab: 'content' },
      { name: 'status', label: 'Status', type: 'status', tab: 'content' },
      {
        name: 'shortDescription',
        label: 'Short Description',
        type: 'textarea',
        tab: 'content',
        rows: 2,
      },
      { name: 'description', label: 'Description', type: 'body', tab: 'content', rows: 8 },
      { name: 'order', label: 'Display Order', type: 'number', tab: 'metadata' },
      {
        name: 'relatedProjectIds',
        label: 'Related research projects',
        type: 'tags',
        tab: 'relations',
      },
      {
        name: 'relatedPublicationIds',
        label: 'Related publications',
        type: 'tags',
        tab: 'relations',
      },
      ...seoFields,
    ],
  },
};

export type CollectionItem =
  | Publication
  | ResearchProject
  | NewsArticle
  | Event
  | Notice
  | Person
  | Activity
  | Resource
  | Page
  | GalleryAlbum
  | MediaAsset
  | ResearchArea;
