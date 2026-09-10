# BKSR Frontend — Phase Audit

## A. Existing repo assessment

| Item | Finding |
|------|---------|
| Prior codebase | **Fresh project** — only `Website Plan.pdf` present |
| Framework | Scaffolded **Next.js 16.3** (App Router) + React 19 + TypeScript |
| Styling | **Tailwind CSS v4** |
| Structure | `src/app` with `--src-dir` |
| UI libs | None pre-installed; adding Motion + Lucide |
| Backend | None (correct for this phase) |

Preserved: Next/Tailwind/TS toolchain. No downgrade.

## B. Legacy BKSR content inventory

**Source:** `bkschoolofresearch.blogspot.com` via Firecrawl crawl + Blogger JSON feeds.

| Category | Count / notes |
|----------|----------------|
| Posts | **24** (2020–2023) |
| Static pages | **20** discovered |
| Verified person | **Bezon Kumar** (Director → mapped as Executive Director per new IA) |
| Fellows / research team / staff pages | **Empty** on legacy — not fabricated |
| Completed research | **12 journal articles**, **1 book chapter**, **7 conference papers**, **9 newspaper articles** |
| Ongoing (by theme count) | Entrepreneurship, Wellbeing, Poverty, Women Empowerment, Tourism, Productivity, Environment, Financial Economics, Sustainable Development, Behavioral Economics, Social Media, Information Literacy |
| Resources | Stata / SPSS / Excel / EViews tutorials (cross-sectional, time series, statistical) |
| Saptasudha / Editorial Board | Pages exist but **empty body** — preserve as archive shells |
| Gallery | “Coming soon” |
| Notices / webinars / vacancies | Multiple Notice + Slide posts |
| Template noise skipped | Popular/Recent/Comments widgets, SoraTemplates branding, Fashion/Music-style sidebar noise |

**Verified org facts (from About + 2023 Job Vacancy):**
- Founded Oct 2015; official journey Dec 2016
- Non-profit research org; Business, Economics, Social Sciences, Humanities
- Motto: Research, Reformation and Development
- Tagline (legacy): “a heaven for inquisitive minds”
- Positioning (plan): “Shaping Evidence-Based Policy for a Changing Global Landscape”
- 2023 notice: 350+ scholars/enumerators from 22 countries; 20+ peer-reviewed outputs; Joy Bangla Youth Award 2022
- Contact: Shahjadpur, Sirajganj-6770; +8801747256047; info / exe_dir / dir_res emails

## C. Reference-site design findings

| Reference | Principles extracted (not cloned) |
|-----------|-----------------------------------|
| Stanford HAI | Institutional credibility, mission-led hero, clear research/people hierarchy, restrained nav |
| ODI | Programme/research IA, publication-forward browse, expert content architecture |
| IIED | Issue storytelling, featured insight + publication discovery, human editorial layouts |
| Altos Labs | Whitespace, cinematic pacing, large mission typography, motion restraint only |

**BKSR identity:** warm paper ivory + deep ink + research teal; editorial serif + modern sans; “Evidence in Motion”.

## D. Proposed information architecture

Primary nav: Home · About · People · Research · Publications · Activities · News & Events · Contact  
Secondary: Resources / Knowledge Hub · Gallery · Search · Join Us  
Admin: `/admin` publishing CMS (frontend-only persistence)

## E. Proposed design system

- **BG** `#F6F4EE` · **Ink** `#10202A` · **Accent** `#1C6257` · **Sage** `#E7ECE7` · **Body** `#242B2D` · **Muted** `#697274`
- **Fonts:** Newsreader (display) + Manrope (UI/body) via `next/font`
- **Motion:** opacity + 16–32px translate; prefers-reduced-motion; no carousels
- **Layout:** 12-col editorial grid, max ~1320px, generous padding, cards used sparingly

## F. Implementation plan

1. Types + seed + CMS repository abstraction  
2. Design tokens + primitives + layout/nav/footer/search  
3. Homepage (paced sections)  
4. All public routes  
5. Admin CMS CRUD + homepage/nav/settings editors  
6. Migration tooling + docs  
7. Lint, typecheck, production build, visual pass  

Proceeding with implementation now.
