import fs from 'fs';
import path from 'path';

const QUERY_FNS = [
  'getSiteSettings',
  'getNavigation',
  'getHomepageConfig',
  'getPages',
  'getPageBySlug',
  'getPeople',
  'getPersonBySlug',
  'getPersonById',
  'getResearchAreas',
  'getResearchAreaBySlug',
  'getResearchProjects',
  'getResearchProjectBySlug',
  'getResearchProjectById',
  'getPublications',
  'getPublicationBySlug',
  'getPublicationById',
  'getActivities',
  'getActivityBySlug',
  'getNews',
  'getNewsBySlug',
  'getEvents',
  'getEventBySlug',
  'getNotices',
  'getNoticeBySlug',
  'getResources',
  'getResourceBySlug',
  'getGalleryAlbums',
  'getGalleryImages',
  'getMedia',
  'getMediaById',
  'getPersonContentLinks',
  'getLinkedPeopleForEntity',
  'getInvolvementsForPerson',
  'getRoleHistoryForPerson',
  'getAchievementsProfileForPerson',
];

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === '.next') continue;
      walk(p, out);
    } else if (/\.(tsx|ts)$/.test(ent.name)) out.push(p);
  }
  return out;
}

const files = walk('src').filter((f) => {
  const t = fs.readFileSync(f, 'utf8');
  return t.includes("from '@/lib/content/queries'");
});

let changed = 0;
for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  const orig = text;

  if (!/export default async function/.test(text)) {
    text = text.replace(/export default function (\w+)/, (m, name) => {
      const uses = QUERY_FNS.some((fn) => new RegExp(`\\b${fn}\\s*\\(`).test(orig));
      return uses ? `export default async function ${name}` : m;
    });
  }

  for (const name of [
    'PublicShell',
    'PublicationTypePage',
    'ResearchStatusList',
    'ActivityProgrammePage',
  ]) {
    text = text.replace(
      new RegExp(`export function ${name}\\b`),
      `export async function ${name}`,
    );
  }

  for (const fn of QUERY_FNS) {
    const reBare = new RegExp(`(?<!await\\s)(?<![\\w.])${fn}\\s*\\(`, 'g');
    text = text.replace(reBare, `await ${fn}(`);
  }

  text = text.replace(/await\s+await\s+/g, 'await ');

  if (text !== orig) {
    fs.writeFileSync(file, text);
    changed += 1;
    console.log('updated', file);
  }
}

console.log('files changed', changed);
