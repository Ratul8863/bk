import fs from 'fs';

function slugify(input) {
  return String(input)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

const posts = JSON.parse(
  fs.readFileSync('./src/content/imported/legacy-posts.json', 'utf8'),
);
const pages = JSON.parse(
  fs.readFileSync('./src/content/imported/legacy-pages.json', 'utf8'),
);

const seen = new Map();
for (const item of [...posts, ...pages]) {
  if (!item.featuredImage) continue;
  if (seen.has(item.featuredImage)) continue;
  seen.set(item.featuredImage, item);
}

const assets = [...seen.entries()].map(([url, item], i) => {
  const title = String(item.title || 'Legacy media').trim();
  const id = `media-legacy-${String(i + 1).padStart(2, '0')}-${slugify(title).slice(0, 40) || 'asset'}`;
  return `  {
    id: ${JSON.stringify(id)},
    kind: 'image' as const,
    title: ${JSON.stringify(title)},
    alt: ${JSON.stringify(title)},
    url: ${JSON.stringify(url)},
    source: ${JSON.stringify(item.originalUrl)},
    credit: 'Legacy BKSR Blogger import',
    status: 'published' as const,
    createdAt: ${JSON.stringify(new Date(item.publishedDate || '2020-01-01').toISOString())},
    updatedAt: ${JSON.stringify(new Date(item.updatedDate || item.publishedDate || '2020-01-01').toISOString())},
  }`;
});

const out = `import type { MediaAsset } from '@/types/content';

/** Featured images found on legacy Blogger posts/pages — no invented media */
export const media: MediaAsset[] = [
${assets.join(',\n')}
];
`;

fs.writeFileSync('./src/content/seed/media.ts', out);
console.log('media assets', assets.length);
