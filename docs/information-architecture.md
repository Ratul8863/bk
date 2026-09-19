# BKSR Information Architecture

Public site routes and primary navigation for BK School of Research.

## Primary navigation

Source of truth: `src/content/seed/navigation.ts` → `getNavigation()` in `src/lib/content/queries.ts`.

| Label | Path | Children |
|-------|------|----------|
| About | `/about` | Who we are, What we do, Governance, Our Policies |
| People | `/people` | Executive Director, Distinguished Fellows, Research Team, Administrative Team, Career at BKSR |
| Research | `/research` | Ongoing, Completed (`/research/previous`) — Areas & Grants remain reachable from Research hub |
| Publications | `/publications` | Policy Briefs, Working Papers, Annual Reports, Journals, Blogs |
| Activities | `/activities` | Seminar & Training, Campaigns, Research Talk, Innovation Showcasing |
| News & Events | `/news-events` | Notices, Events |
| Contact | `/contact` | — |

Header CTAs: **Contact** (`/contact`) as the solid action. Search opens `SearchOverlay`. Account icon opens member access. Research entry stays in primary nav (hub + Ongoing / Completed). Homepage hero may still use **Explore Research** → `/research`.

## Secondary / footer

| Area | Paths |
|------|-------|
| Important links | About, Research, Publications, People, News, Events, Knowledge Hub, Contact |
| Knowledge Hub | `/resources` + tutorial/archive children |
| Gallery | `/gallery` (coming soon) |
| Policies | `/about/policies`, `/about/governance` |
| Admin (not in public nav) | `/admin` |

## Route map (planned public App Router)

Route group: `src/app/(public)/` with `PublicShell` layout.

| Route | Purpose |
|-------|---------|
| `/` | Homepage |
| `/about`, `/about/who-we-are`, `/about/what-we-do`, `/about/governance`, `/about/policies` | Institutional story |
| `/people`, `/people/[slug]`, role landing pages | People directory |
| `/research`, `/research/areas`, `/research/areas/[slug]` | Areas |
| `/research/grants` | Grants |
| `/research/ongoing`, `/research/ongoing/[slug]` | Ongoing projects |
| `/research/previous`, `/research/previous/[slug]` | Completed projects |
| `/publications`, `/publications/[slug]`, type filters | Publications |
| `/activities`, `/activities/[type]` | Activities |
| `/news-events` | Hub |
| `/news`, `/news/[slug]` | News |
| `/notices`, `/notices/[slug]` | Notices |
| `/events`, `/events/[slug]` | Events |
| `/resources`, `/resources/[slug]` | Knowledge Hub |
| `/gallery` | Gallery |
| `/contact` | Contact |
| `/join` (optional) | Join / opportunities |

## Content status

Public getters default to `status === 'published'`. Pass `{ includeDrafts: true }` only for authenticated/admin previews.
