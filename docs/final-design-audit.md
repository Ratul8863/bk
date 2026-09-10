# Final design audit

Date: 2026-08-30 (includes final factual verification pass)

## Visual prototype pass (2026-08-30)

Homepage reworked for stakeholder presentation: large hero image, publication cover feature, research image band, leadership portrait, reduced item counts (news/events 2 each; selected pubs 3; areas 6). Generated prototype media lives in `public/media/prototype/` and CMS media entries titled `[Prototype] …`. Authentic BKSR photography still limited — replace before production.


---

## Route inventory (exact)

| Metric | Count |
|--------|------:|
| Build static pages reported | **155** |
| Prerendered HTML on disk | **153** = 29 public indexes + 2 framework (`/_not-found`, `/_global-error`) + **90** SSG + **32** admin static |
| Dynamic handlers | **13** (`/search` + 12 admin `[id]`) |
| User-facing endpoints (excl. framework errors) | **164** |

Previous “~30 + ~90 + ~44 ≈ 155” was inconsistent because admin `[id]` files were counted as if prerendered. Full math: `docs/route-audit.md`.

---

## People `/[slug]`

Category hubs intentionally share `/people/[slug]` with profiles. Reserved slugs (`executive-director`, `distinguished-fellows`, `research-team`, `administrative-team`) resolve **before** person lookup; CMS blocks those slugs. No collision with `bezon-kumar`.

---

## Content cleanup performed

- Regenerated news (14), events (5), notices (5) from legacy JSON with safe cleaners
- Removed inline styles / MSO / separator noise / photo-credit crumbs / liability boilerplate
- Re-applied category label denoise
- Did **not** rewrite factual claims

---

## Empty collections (nav retained)

- `/publications/annual-reports`, `/publications/newsletters`
- `/research/grants`
- `/gallery`
- `/people/distinguished-fellows`, `/people/research-team`, `/people/administrative-team`

---

## Architecture problems found

- None blocking freeze. Route math and people reserved-slug collision risk addressed.
- Build 155 vs HTML 153: **+2 Next accounting units**, not extra app routes.

---

## Verification

```
npm run lint      ✅
npx tsc --noEmit  ✅
npm run build     ✅  (155/155 static)
```

## Backend phase (not started)

MongoDB, auth/RBAC, media storage, server search, contact delivery, CMS visibility flags for empty nav items.
