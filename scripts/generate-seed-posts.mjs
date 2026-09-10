import fs from 'fs';
import {
  cleanCategoryLabels,
  cleanExcerpt,
  cleanHtml,
  cleanPlainText,
} from './lib/blogger-clean.mjs';

const posts = JSON.parse(
  fs.readFileSync('./src/content/imported/legacy-posts.json', 'utf8'),
).map((p) => {
  const fullContentHtml = cleanHtml(p.fullContentHtml || '');
  const fullContentText = cleanPlainText(
    p.fullContentText || fullContentHtml.replace(/<[^>]+>/g, ' '),
  );
  return {
    ...p,
    fullContentHtml,
    fullContentText,
    summary: cleanExcerpt(p.summary, fullContentText),
    categories: cleanCategoryLabels(p.categories || []),
  };
});

fs.writeFileSync(
  './src/content/imported/legacy-posts.cleaned.json',
  JSON.stringify(posts, null, 2),
);

const esc = (s) => JSON.stringify(s ?? '');

const eventsMeta = [
  {
    slug: 'covid-19-pandemic-and-child-protection',
    id: 'event-covid-child-protection',
    startAt: '2020-10-04T16:00:00+06:00',
    speakers: ['Dr. Faraha Nawaz', 'Bezon Kumar (moderator)'],
  },
  {
    slug: 'impact-of-covid-19-on-youth-mental',
    id: 'event-covid-youth-mental-health',
    startAt: '2020-07-26T16:30:00+06:00',
    speakers: ['Dr. Swati Chawla', 'Bezon Kumar (moderator)'],
  },
  {
    slug: 'gender-and-development-fundamentals',
    id: 'event-gender-development',
    startAt: '2020-07-19T16:30:00+06:00',
    speakers: ['Mr. Cyrus O. Ogorida', 'Bezon Kumar (moderator)'],
  },
  {
    slug: 'globalization-and-youths-in-south-asia',
    id: 'event-globalization-youths',
    startAt: '2020-07-12T16:30:00+06:00',
    speakers: ['Professor Dr. Vivek Kumar', 'Bezon Kumar (moderator)'],
  },
  {
    slug: 'spss-for-beginners',
    id: 'event-spss-beginners',
    startAt: '2020-06-27T16:00:00+06:00',
    speakers: ['Mr. Atman Shah'],
  },
];

const noticesMeta = [
  { slug: 'job-vacancy', id: 'notice-job-vacancy-2023', type: 'vacancy', lang: 'en' },
  {
    slug: 'bk-school-of-research-is-looking-for',
    id: 'notice-research-assistant-2020',
    type: 'vacancy',
    lang: 'en',
  },
  { slug: 'vacancy', id: 'notice-program-associate-bn', type: 'vacancy', lang: 'bn' },
  {
    slug: 'vacancy-announcement',
    id: 'notice-vacancy-announcement-2020',
    type: 'vacancy',
    lang: 'en',
  },
  {
    slug: 'blog-post_10',
    id: 'notice-make-niye-likhi-results-pending',
    type: 'announcement',
    lang: 'bn',
    outSlug: 'make-niye-likhi-result-notice',
  },
];

const newsBySlug = [
  { slug: 'education-and-its-strategy', id: 'news-education-and-its-strategy' },
  { slug: 'why-indias-northeast-region-assams', id: 'news-assam-flood-climate-change' },
  {
    slug: 'environmental-impact-and-sustainability',
    id: 'news-environmental-impact-facility-management',
  },
  {
    slug: 'core-contribution-of-richard-thaler',
    id: 'news-richard-thaler-behavioral-economics',
  },
  {
    slug: 'the-story-behind-2017-nobel-prize-in_2',
    id: 'news-2017-nobel-prize-economics',
  },
  {
    slug: 'bangabandhus-7th-march-speech-part-of',
    id: 'news-bangabandhu-7th-march-speech',
  },
  { slug: 'climate-change-in-bangladesh-causes', id: 'news-climate-change-bangladesh' },
  { slug: 'remittance-effective-mechanism-for', id: 'news-remittance-effective-mechanism' },
];

const newsByTitle = [
  {
    title: 'আমার বাবা আমার গর্ব',
    id: 'news-amar-baba-amar-gorbo',
    lang: 'bn',
    outSlug: 'amar-baba-amar-gorbo',
  },
  {
    title: 'সেরা তিনজন লেখক নির্বাচিত',
    id: 'news-make-niye-likhi-winners',
    lang: 'bn',
    outSlug: 'make-niye-likhi-winners',
  },
  {
    title: 'মাকে নিয়ে লিখি',
    id: 'news-make-niye-likhi-call',
    lang: 'bn',
    outSlug: 'make-niye-likhi',
  },
  {
    title: '২৬ মার্চ, ১৯৭১',
    id: 'news-poem-26-march-1971',
    lang: 'bn',
    outSlug: '26-march-1971-poem',
  },
  {
    title: 'প্রবাসী আয়: উন্নয়নের একটি কার্যকরী হাতিয়ার',
    id: 'news-probashi-aay-bn',
    lang: 'bn',
    outSlug: 'probashi-aay-unnoyner-hatiyar',
  },
  {
    title: 'গবেষণা: টেকসই উন্নয়নের মূল হাতিয়ার',
    id: 'news-gobeshona-sustainable-development',
    lang: 'bn',
    outSlug: 'gobeshona-sustainable-development',
  },
];

const bySlug = (slug) => posts.find((p) => p.slug === slug);
const byTitle = (title) => posts.find((p) => p.title.trim() === title);
const iso = (d) => new Date(d).toISOString();

const eventsOut = eventsMeta
  .map((e) => {
    const p = bySlug(e.slug);
    return `  {
    id: '${e.id}',
    slug: '${e.slug}',
    status: 'published',
    createdAt: '${iso(p.publishedDate)}',
    updatedAt: '${iso(p.updatedDate || p.publishedDate)}',
    publishedAt: '${iso(p.publishedDate)}',
    title: ${esc(p.title.trim())},
    summary: ${esc((p.summary || '').slice(0, 280))},
    description: ${esc(p.fullContentText)},
    eventStatus: 'past',
    startAt: '${e.startAt}',
    endAt: null,
    location: 'Online (YouTube — BK School of Research)',
    isOnline: true,
    speakers: ${JSON.stringify(e.speakers)},
    featuredImageUrl: ${esc(p.featuredImage)},
    originalLegacyUrl: ${esc(p.originalUrl)},
    seo: {
      title: ${esc(`${p.title.trim()} | BKSR`)},
      description: ${esc((p.summary || '').slice(0, 160))},
      canonicalPath: '/events/${e.slug}',
    },
  }`;
  })
  .join(',\n');

const noticesOut = noticesMeta
  .map((n) => {
    const p = bySlug(n.slug);
    const outSlug = n.outSlug || p.slug;
    return `  {
    id: '${n.id}',
    slug: '${outSlug}',
    status: 'published',
    createdAt: '${iso(p.publishedDate)}',
    updatedAt: '${iso(p.updatedDate || p.publishedDate)}',
    publishedAt: '${iso(p.publishedDate)}',
    title: ${esc(p.title.trim())},
    summary: ${esc((p.summary || '').slice(0, 280))},
    body: ${esc(p.fullContentText)},
    noticeType: '${n.type}',
    featuredImageUrl: ${esc(p.featuredImage)},
    originalLegacyUrl: ${esc(p.originalUrl)},
    language: '${n.lang}',
    seo: {
      title: ${esc(`${p.title.trim()} | BKSR`)},
      description: ${esc((p.summary || '').slice(0, 160))},
      canonicalPath: '/notices/${outSlug}',
    },
  }`;
  })
  .join(',\n');

const newsItems = [];
for (const n of newsBySlug) {
  newsItems.push({ p: bySlug(n.slug), id: n.id, lang: 'en', slug: n.slug });
}
for (const n of newsByTitle) {
  const p = byTitle(n.title);
  if (!p) throw new Error(`Missing post: ${n.title}`);
  newsItems.push({ p, id: n.id, lang: n.lang, slug: n.outSlug });
}

const newsOut = newsItems
  .map(
    ({ p, id, lang, slug }) => `  {
    id: '${id}',
    slug: '${slug}',
    status: 'published',
    createdAt: '${iso(p.publishedDate)}',
    updatedAt: '${iso(p.updatedDate || p.publishedDate)}',
    publishedAt: '${iso(p.publishedDate)}',
    title: ${esc(p.title.trim())},
    excerpt: ${esc((p.summary || '').slice(0, 280))},
    body: ${esc(p.fullContentText)},
    author: ${esc(p.author || 'BK School of Research')},
    categoryLabels: ${JSON.stringify(cleanCategoryLabels(p.categories || []))},
    featuredImageUrl: ${esc(p.featuredImage)},
    originalLegacyUrl: ${esc(p.originalUrl)},
    language: '${lang}',
    seo: {
      title: ${esc(`${p.title.trim()} | BKSR`)},
      description: ${esc((p.summary || '').slice(0, 160))},
      canonicalPath: '/news/${slug}',
    },
  }`,
  )
  .join(',\n');

const header = (type) => `import type { ${type} } from '@/types/content';\n\n`;

fs.writeFileSync(
  './src/content/seed/events.ts',
  `${header('Event')}export const events: Event[] = [\n${eventsOut}\n];\n`,
);
fs.writeFileSync(
  './src/content/seed/notices.ts',
  `${header('Notice')}export const notices: Notice[] = [\n${noticesOut}\n];\n`,
);
fs.writeFileSync(
  './src/content/seed/news.ts',
  `${header('NewsArticle')}export const news: NewsArticle[] = [\n${newsOut}\n];\n`,
);

console.log({
  events: eventsMeta.length,
  notices: noticesMeta.length,
  news: newsItems.length,
});
