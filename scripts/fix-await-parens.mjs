import fs from 'fs';
import path from 'path';

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

const files = walk('src');
let changed = 0;

for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  const orig = text;

  for (const fn of QUERY_FNS) {
    // await getFoo(...).method(  →  (await getFoo(...)).method(
    const re = new RegExp(
      `await\\s+${fn}(\\([^)]*\\))\\.(map|filter|find|sort|slice|flatMap|reduce)\\(`,
      'g',
    );
    text = text.replace(re, `(await ${fn}$1).$2(`);
  }

  if (text !== orig) {
    fs.writeFileSync(file, text);
    changed += 1;
    console.log('parens', file);
  }
}

console.log('paren-fixed', changed);
