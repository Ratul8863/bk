# BKSR route audit

Date: 2026-08-30 (final factual reconciliation)  
Source of truth: `npm run build` → `Generating static pages (155/155)` + on-disk `.next/server/app/**/*.html` (153 files).

---

## Exact counts

| Metric | Count |
|--------|------:|
| Next.js reported static pages generated | **155** |
| Prerendered `.html` artifacts on disk | **153** |
| Dynamic route handlers (not prerendered) | **13** |
| User-facing addressable URLs (excl. framework error pages) | **164** |

### Why 155 ≠ 30+90+44

The earlier audit mixed incompatible buckets:

- “~30 public static” was roughly right for **content indexes**, but was added to “~90 generated” and “~44 admin” as if those were the same kind of number as the build’s **155**.
- Admin **page.tsx files** were ~44 (including 12 dynamic `[id]` handlers). Only **32** admin routes are statically prerendered; **12** `[id]` handlers are dynamic (`ƒ`) and are **not** in the 155.

### Accurate bucket math (reconciles to 153 HTML)

| Bucket | Count | Notes |
|--------|------:|-------|
| **A. Public content static indexes** | **29** | `/`, about×5, activities×5, contact, events, gallery, news, notices, people, privacy, publications×5, research×5, resources |
| **B. Framework static** | **2** | `/_not-found`, `/_global-error` (Next internals; present in HTML output) |
| **C. Generated SSG detail expansions** | **90** | See breakdown below |
| **D. Admin static** | **32** | Dashboard, collection lists, `/new`, settings shells — **not** `[id]` |
| **A+B+C+D** | **153** | Matches on-disk HTML |
| **E. Dynamic handlers** | **13** | `/search` (1) + `/admin/*/ [id]` (12) |
| **Build-reported 155 − HTML 153** | **2** | Next bookkeeping / non-HTML static units — **not** additional `src/app` routes |

**29 + 2 + 90 + 32 = 153** (HTML)  
**155 = build counter** (includes 2 extra non-route accounting units)  
**164 = 29 + 90 + 32 + 13** user-facing endpoints (excluding `/_not-found` and `/_global-error`)

---

## C. SSG detail breakdown (90)

| Collection | Params |
|------------|-------:|
| Publications | 29 |
| Research projects | 24 |
| News | 14 |
| Events | 5 |
| Notices | 5 |
| Resources | 8 |
| People profiles | 1 (`bezon-kumar`) |
| People category hubs | 4 (reserved) |
| **Total** | **90** |

---

## `/people/[slug]` architecture

**Intentional:** category hubs and person profiles share the dynamic segment.

| Slug | Role |
|------|------|
| `executive-director` | Category hub (reserved) |
| `distinguished-fellows` | Category hub (reserved) |
| `research-team` | Category hub (reserved) |
| `administrative-team` | Category hub (reserved) |
| `bezon-kumar` | Person profile |

**Collision control (implemented):**

1. Reserved hub slugs live in `src/lib/content/people-slugs.ts`.
2. Resolution order: **reserved category first → person → 404**.
3. `generateStaticParams` omits any person whose slug is reserved.
4. Admin people editor **blocks saving** reserved slugs.

Current seed has no collision (`bezon-kumar` ≠ reserved set). Architecturally clean for freeze.

---

## Redirects (not separate prerendered pages)

| From | To |
|------|----|
| `/news-events` | `/news` |
| `/activities/awareness-campaign` | `/activities/awareness-campaigns` |
| `/activities/research-talk` | `/activities/research-talks` |

---

## Empty / thin public nav destinations

Architecture retained; no content fabricated. For future CMS visibility flags:

| Route | Published content now |
|-------|------------------------|
| `/publications/annual-reports` | **Empty** (0 `annual-report`) |
| `/publications/newsletters` | **Empty** (0 `newsletter`) |
| `/publications/journals` | 12 journals |
| `/publications/opinions` | 9 opinions |
| `/research/grants` | **Empty** (programme shell only) |
| `/gallery` | **Empty** (legacy “coming soon”; 0 images) |
| `/people/distinguished-fellows` | **Empty** hub |
| `/people/research-team` | **Empty** hub |
| `/people/administrative-team` | **Empty** hub |
| `/people/executive-director` | Lists Bezon Kumar |

---

## page.tsx file count

**81** `page.tsx` files under `src/app` (= route modules, not expanded URL count).
