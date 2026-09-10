<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Learned User Preferences

- BKSR must feel like a premium editorial academic research/publication institute — not lab/biotech, LMS, generic university, SaaS, ThemeForest, news-magazine, or Blogger redesign.
- Brand palette is logo-aligned navy/royal blue with warm white surfaces and sparse red accents; do not use teal/green as primary brand identity; primary CTAs stay navy/blue.
- Prefer visual, presentation-ready pages over text-heavy brochure layouts; keep the home hero copy-light (brand, short line, CTAs—no dense paragraphs or meta strips); use a multi-photo slideshow hero rather than a single static frame; polish the accepted slideshow instead of replacing it with a wholly new composition; keep cards/components premium and custom, not generic component-library grids; where homepage cards should carry imagery (services, fields, media, notices, collaboration), use real or approved dummy images—not empty text-only boxes; keep homepage sections responsive on small devices.
- Homepage services/what-we-do uses CSS sticky stacking panels (Figma look + sticky-stack concept): next card rises over the previous while titles stay visible (not a full cover); use the Figma two-tone treatment and card shape; motion must stay smooth without lag, broken geometry, or sudden mid-scroll scale jumps.
- Do not start backend, auth, or server CMS work until explicitly requested; keep refining the existing frontend and approved information architecture unless there is a clear UX defect or an explicit stakeholder layout/sitemap diagram to align to.
- When aligning to a stakeholder layout diagram or Figma Home frame, match primary nav labels/routes and homepage section inventory and composition; adapt references to BKSR tokens and content rather than pasting exports; apply the Figma title/display font styling site-wide; place Message from Executive Director below the hero when that section is in scope; keep documented Collaboration on record with hover-to-reveal behavior.
- Meet our team: one centered featured Executive Director card above four category cards, same card shape for featured and category cards; member cards show name/role on the front and flip in-place on hover to a bio back; include a View full team CTA to `/people`; demo names/roles/bios and stock portraits are OK until a real roster is supplied—still do not invent partners, testimonials, or affiliations.
- Homepage Focus Areas uses a scroll-pinned left-to-right card reveal: pin until one extra card enters after the visible row fills (first card exits), then unpin and reveal the pager; cards need a clear View affordance; the pager must work as soon as it appears and match the Figma control design.
- What our researchers say: change scroll/animation only—do not redesign cards; use a scroll-pinned horizontal inchworm/push chain (trailing card nudges the prior forward with gaps kept—no stacking/overlap); match `docs/2026-09-10 19-14-56.mp4`; keep motion smooth, not jerky or all-cards-moving-as-one.
- Make strong design decisions from the repo, legacy site, and specs; take inspiration only (do not copy) from Stanford HAI, ODI, IIED, Altos Labs, and local peers like rursbd.org, dursbd.com, jnurhss.org, curhs.org, and bdresearchsociety.com; avoid repetitive clarifying questions when the answer is already available.
- Site header should use the full-colour BKSR logo on a solid paper/white bar aligned to the Figma navbar; avoid frosted glass, low-contrast marks, or plate treatments that obscure the logo; use Lenis for site-wide smooth scrolling.
- Hero H1 should read "BK School of Research" on a single line (do not break the brand name across lines); do not use a leading red eyebrow hairline/rule before section labels site-wide; marquee/ticker lines stay single-line and loop continuously.

## Learned Workspace Facts

- This repo is the BK School of Research (BKSR) Next.js App Router frontend for an academic research and publication organization.
- Primary legacy content source is https://bkschoolofresearch.blogspot.com/; migrated Blogger HTML/noise should be cleaned without rewriting factual meaning.
- Admin at `/admin` is a frontend/demo CMS (e.g. local persistence), not a production backend.
- Production deploy target is https://bksr.vercel.app (Vercel project `bksr`).
- Design and freeze audits are tracked in `docs/route-audit.md`, `docs/content-migration-report.md`, and `docs/final-design-audit.md`.
- Diagram-aligned nav includes Career at BKSR, Publications (Policy Briefs, Working Papers, Annual Reports, Journals, Blogs), and Activities labeled Seminar & Training / Campaigns; several of those routes remain empty CMS-ready shells—fill page-by-page without deleting empty-collection architecture.
- `/publications/journals` lists external journal articles from the publication library (not BKSR’s house journal); titles and filters should match that meaning.
- Homepage design reference is the Pharmacinta Figma file (`WPjc0aQ79C2mnASLhHkrIo`): navbar `89:53`, Focus Areas `175:50` / `184:96`, services sticky stack `184:282` / `175:90`, team-card flip `168:94`, researchers say `191:456`, Collaboration `191:535`—implement with BKSR branding and real content.
- `/people` is a sector-grouped team directory using the same flip cards as the homepage team section; active sector filters are filled rounded chips; omit page-local search (header search only); person profiles are LinkedIn-style detail pages (photo, name, bio, about, skills, research) in BKSR theme.
- BKSR in Media means press/newspaper coverage and related opinion pieces—not a social-channel link grid.
- Homepage Collaboration on record lists archive-documented collaborations only (not implied ongoing formal partnerships); Figma hover-reveal with imagery on every item; dummy photos are OK until real assets exist.
- Long-form detail pages (notices, news, events, publications) need a polished article reading layout with structured body content—not wide wall-of-text Blogger dumps; sticky directory/filter sidebars must stay viewport-bounded and internally scrollable so lower filter options remain reachable.
