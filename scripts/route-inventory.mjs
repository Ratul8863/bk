import fs from "fs";
import path from "path";

function countIds(file) {
  const s = fs.readFileSync(file, "utf8");
  return [...s.matchAll(/\bid:\s*['"][^'"]+['"]/g)].length;
}

function countByType(file) {
  const s = fs.readFileSync(file, "utf8");
  const types = {};
  for (const m of s.matchAll(/\btype:\s*['"]([^'"]+)['"]/g)) {
    types[m[1]] = (types[m[1]] ?? 0) + 1;
  }
  return types;
}

const seed = "src/content/seed";
const counts = {
  publications: countIds(`${seed}/publications.ts`),
  researchProjects: countIds(`${seed}/research-projects.ts`),
  news: countIds(`${seed}/news.ts`),
  events: countIds(`${seed}/events.ts`),
  notices: countIds(`${seed}/notices.ts`),
  resources: countIds(`${seed}/resources.ts`),
  people: countIds(`${seed}/people.ts`),
  activities: countIds(`${seed}/activities.ts`),
  galleryAlbums: countIds(`${seed}/gallery.ts`),
  pages: countIds(`${seed}/pages.ts`),
};

const pubTypes = countByType(`${seed}/publications.ts`);

const CATEGORY_SLUGS = [
  "executive-director",
  "distinguished-fellows",
  "research-team",
  "administrative-team",
];

const PUBLIC_STATIC = [
  "/",
  "/_not-found",
  "/about",
  "/about/governance",
  "/about/policies",
  "/about/what-we-do",
  "/about/who-we-are",
  "/activities",
  "/activities/awareness-campaigns",
  "/activities/capacity-building",
  "/activities/innovation-showcasing",
  "/activities/research-talks",
  "/contact",
  "/events",
  "/gallery",
  "/news",
  "/notices",
  "/people",
  "/privacy",
  "/publications",
  "/publications/annual-reports",
  "/publications/journals",
  "/publications/newsletters",
  "/publications/opinions",
  "/research",
  "/research/areas",
  "/research/grants",
  "/research/ongoing",
  "/research/previous",
  "/resources",
];

const PUBLIC_DYNAMIC_SSR = ["/search"];

const ADMIN_STATIC = [
  "/admin",
  "/admin/activities",
  "/admin/activities/new",
  "/admin/contact",
  "/admin/events",
  "/admin/events/new",
  "/admin/gallery",
  "/admin/gallery/new",
  "/admin/homepage",
  "/admin/media",
  "/admin/media/new",
  "/admin/navigation",
  "/admin/news",
  "/admin/news/new",
  "/admin/notices",
  "/admin/notices/new",
  "/admin/pages",
  "/admin/pages/new",
  "/admin/people",
  "/admin/people/new",
  "/admin/publications",
  "/admin/publications/new",
  "/admin/research",
  "/admin/research/new",
  "/admin/research-areas",
  "/admin/research-areas/new",
  "/admin/resources",
  "/admin/resources/new",
  "/admin/seo",
  "/admin/settings",
  "/admin/social",
  "/admin/system",
];

const ADMIN_DYNAMIC = [
  "/admin/activities/[id]",
  "/admin/events/[id]",
  "/admin/gallery/[id]",
  "/admin/media/[id]",
  "/admin/news/[id]",
  "/admin/notices/[id]",
  "/admin/pages/[id]",
  "/admin/people/[id]",
  "/admin/publications/[id]",
  "/admin/research/[id]",
  "/admin/research-areas/[id]",
  "/admin/resources/[id]",
];

const peopleSsg = counts.people + CATEGORY_SLUGS.length;
const ssgDetail =
  counts.publications +
  counts.researchProjects +
  counts.news +
  counts.events +
  counts.notices +
  counts.resources +
  peopleSsg;

// Next reports Generating static pages (N/N). That includes:
// public static (no /search) + SSG detail expansions + admin static pages
const expectedBuildStatic =
  PUBLIC_STATIC.length + ssgDetail + ADMIN_STATIC.length;

const pageFiles = [];
function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (ent.name === "page.tsx") pageFiles.push(p);
  }
}
walk("src/app");

const buildTxt = fs.existsSync(".firecrawl/build-routes.txt")
  ? fs.readFileSync(".firecrawl/build-routes.txt", "utf8")
  : "";
const buildMatch = buildTxt.match(
  /Generating static pages[^\n]*\((\d+)\/(\d+)\)/,
);

const report = {
  buildReportedStaticPages: buildMatch
    ? Number(buildMatch[1])
    : null,
  pageTsxFiles: pageFiles.length,
  buckets: {
    publicStaticPrerendered: PUBLIC_STATIC.length,
    publicDynamicSsr: PUBLIC_DYNAMIC_SSR.length,
    generatedSsgDetail: ssgDetail,
    generatedSsgBreakdown: {
      publications: counts.publications,
      researchProjects: counts.researchProjects,
      news: counts.news,
      events: counts.events,
      notices: counts.notices,
      resources: counts.resources,
      peopleProfiles: counts.people,
      peopleCategoryHubs: CATEGORY_SLUGS.length,
      peopleParamsTotal: peopleSsg,
    },
    adminStaticPrerendered: ADMIN_STATIC.length,
    adminDynamicHandlers: ADMIN_DYNAMIC.length,
  },
  math: {
    expectedBuildStaticPages: expectedBuildStatic,
    totalRoutableEndpoints:
      PUBLIC_STATIC.length +
      PUBLIC_DYNAMIC_SSR.length +
      ssgDetail +
      ADMIN_STATIC.length +
      ADMIN_DYNAMIC.length,
    note: "Build (155) = publicStatic + SSG detail expansions + adminStatic. Dynamic handlers (/search, admin/[id]) are NOT in the 155 prerender count.",
  },
  seedCounts: counts,
  publicationTypes: pubTypes,
  emptyOrThinPublicNav: {
    "/publications/annual-reports": (pubTypes["annual-report"] ?? 0) === 0,
    "/publications/newsletters": (pubTypes.newsletter ?? 0) === 0,
    "/publications/journals": (pubTypes.journal ?? 0) > 0,
    "/publications/opinions": (pubTypes.opinion ?? 0) > 0,
    "/research/grants": true,
    "/gallery": true,
    "/people/distinguished-fellows": true,
    "/people/research-team": true,
    "/people/administrative-team": true,
    "/people/executive-director": false,
  },
};

fs.writeFileSync(
  ".firecrawl/route-inventory.json",
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
