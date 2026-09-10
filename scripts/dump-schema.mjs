import { createRequire } from 'module';
import { writeFileSync } from 'fs';
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

// Use tsx loader via dynamic import of compiled approach - just read TS as text and parse fields
import { readFileSync } from 'fs';

function pickInterface(src, name) {
  const re = new RegExp(`export interface ${name}[^{]*\\{([\\s\\S]*?)\\n\\}`);
  const m = src.match(re);
  return m ? m[1] : null;
}

const types = readFileSync('src/types/content.ts', 'utf8');
const people = readFileSync('src/content/seed/people.ts', 'utf8');
const projects = readFileSync('src/content/seed/research-projects.ts', 'utf8');
const pubs = readFileSync('src/content/seed/publications.ts', 'utf8');
const events = readFileSync('src/content/seed/events.ts', 'utf8');
const homepage = readFileSync('src/content/seed/homepage.ts', 'utf8');
const queries = readFileSync('src/lib/content/queries.ts', 'utf8');
const labels = readFileSync('src/lib/public/labels.ts', 'utf8');
const page = readFileSync('src/app/(public)/page.tsx', 'utf8');
const researchFeature = readFileSync('src/components/editorial/ResearchFeature.tsx', 'utf8');

const out = {
  Person: pickInterface(types, 'Person'),
  ResearchProject: pickInterface(types, 'ResearchProject'),
  Publication: pickInterface(types, 'Publication'),
  Event: pickInterface(types, 'Event'),
  HomepageConfig: pickInterface(types, 'HomepageConfig'),
  SiteSettings: pickInterface(types, 'SiteSettings'),
  peopleSnippet: people.slice(0, 800),
  projectSnippet: projects.slice(0, 900),
  eventSnippet: events.slice(0, 700),
  homepageSnippet: homepage.slice(0, 900),
  queryExports: [...queries.matchAll(/export function (\w+)/g)].map((m) => m[1]),
  labelExports: [...labels.matchAll(/export const (\w+)/g)].map((m) => m[1]),
  homepageImports: page.match(/from '@[^']+'/g),
  homepageFieldUses: [...page.matchAll(/\.(researchStatus|leadAuthorNames|leadAuthorNames|shortBio|affiliation|citation|startAt|publishedAt|role)\b/g)].map(m=>m[1]),
  researchFeatureFields: [...researchFeature.matchAll(/\.(researchStatus|leadAuthorNames|leadAuthorNames|year|summary)\b/g)].map(m=>m[1]),
  typeEnums: {
    PublicationType: types.match(/export type PublicationType =([\s\S]*?);/)?.[1],
    ResearchStatus: types.match(/export type ResearchStatus =([\s\S]*?);/)?.[1],
    PersonCategory: types.match(/export type PersonCategory =([\s\S]*?);/)?.[1],
    ActivityType: types.match(/export type ActivityType =([\s\S]*?);/)?.[1],
  },
};

writeFileSync('schema-dump.json', JSON.stringify(out, null, 2));
console.log('ok');
