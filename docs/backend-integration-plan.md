# Backend Integration Plan — BKSR CMS

This document maps the frontend `contentRepository` abstraction to the production stack
(**Next.js Route Handlers**, **MongoDB**, **Cloudinary**). The admin UI and public site
keep calling repository / query helpers; only the driver changes.

## Current state (2026-09)

| Layer | Demo (`CMS_DRIVER=fs`) | Production (`CMS_DRIVER=mongo`) |
|-------|---------------------------|----------------------------------|
| Persistence | Local `.data/cms-database.json` | MongoDB collections |
| Media binaries | URL / placeholder, or Cloudinary when env set | Cloudinary → public CDN URL stored on `media` docs |
| Seed | `src/content/seed/*` | `POST /api/cms/seed` (admin) |
| Abstraction | `src/lib/cms/repository.ts` | `src/lib/cms/mongo-repository.ts` + `/api/cms/*` |
| Admin client | Sync via CMS API | `cmsApi` + httpOnly session cookie |
| Public reads | Seed via `getContentDatabase()` | Cached Mongo snapshot (`unstable_cache` + tag `cms`, 60s) |
| Auth | None / demo | `CMS_ADMIN_SECRET` → `/api/cms/session` (JWT/OTP Phase 2 later) |

**Rule:** Never scatter storage or HTTP details in React components. Swap the repository /
API adapter; keep component contracts stable.

---

## Env (see `.env.example`)

```
CMS_DRIVER=mongo
NEXT_PUBLIC_CMS_MODE=mongo
MONGODB_URI=...
MONGODB_DB=bksr
CMS_ADMIN_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_FOLDER=bksr/media
```

---

## 1. MongoDB data model (lean)

Singletons (one doc each): `site_settings`, `homepage`, `navigation`.

List collections mirror `ContentDatabase` keys (snake_case in Mongo) — no extra
“junk” collections. Junction / inbox stay separate so relations stay queryable:

| Collection | Purpose |
|------------|---------|
| `pages`, `people`, `research_areas`, `research_projects`, `publications`, `activities`, `news`, `events`, `notices`, `resources` | Primary content |
| `gallery_albums`, `gallery_images`, `media` | Media; `media.url` = Cloudinary public URL |
| `person_content_links` | Person ↔ event/research/publication/activity |
| `registration_forms`, `registration_entries` | Event registration |
| `role_assignments`, `join_applications`, `achievements`, `achievement_assignments`, `member_achievements` | People ops |
| `accounts` | Auth Phase 2 only |
| `cms_meta` | Seed version marker |

Indexes: see `src/lib/db/indexes.ts` (`slug` unique, status, date, FK fields).

**IDs:** string UUIDs (`id` field; `_id` mirrored for Mongo). Public routes use `slug`.

---

## 2. API map

| Concern | Route |
|---------|--------|
| Health | `GET/POST /api/cms/health` |
| Unlock admin | `POST/GET/DELETE /api/cms/session` |
| Full snapshot | `GET /api/cms` (admin cookie) |
| Seed | `POST /api/cms/seed` `{ wipe?: boolean }` |
| Collection list/create | `GET/POST /api/cms/:collection` |
| Item | `GET/PATCH/DELETE /api/cms/:collection/:id` |
| Duplicate | `POST /api/cms/:collection/:id/duplicate` |
| Singletons | `PATCH /api/cms/site-settings` · `homepage` · `navigation` |
| Upload | `POST /api/media/upload` (multipart → Cloudinary → `media` doc) |

Public pages should prefer Server Components + `getContentDatabase()` / `src/lib/content/queries.ts`
(async, cached) — not the admin API — so drafts never leak.

---

## 3. Caching & serverless performance

- `getContentDatabase()` uses React `cache` (per-request dedupe) + `unstable_cache`
  tagged `cms` with `revalidate: 60`.
- Mutations call `revalidateTag('cms', 'max')` (and collection tags) so publishes appear quickly.
- Keep payloads lean: list views project needed fields later if documents grow.

---

## 4. Auth & RBAC

### People claim (chosen path)

Custom JWT + OTP (not Clerk). Phase 1 demo remains `localStorage` auth until Phase 2 APIs land.

### CMS admin (now)

`CMS_ADMIN_SECRET` → httpOnly cookie via `/api/cms/session`. Header `x-cms-admin-secret`
works for scripts. Full JWT/RBAC (`viewer` / `editor` / `publisher` / `admin`) overlays later.

---

## 5. Media (Cloudinary)

1. `POST /api/media/upload` streams file to Cloudinary.
2. Creates `media` document with `url` = Cloudinary `secure_url` and
   `source` = `cloudinary:<public_id>`.
3. Content fields (`featuredImageUrl`, `photoUrl`, …) store that URL string.

---

## 6–8. Contact / newsletter / search / analytics

Unchanged intent from prior plan: contact inbox separate from CMS content; search starts
in-memory over published Mongo docs; dashboard stays content metrics only.

---

## 9. Go-live checklist

1. Fill `.env.local` from `.env.example`.
2. `npm run seed:mongo` (connectivity) then unlock `/admin/system` and **Re-seed MongoDB**.
3. Set `CMS_DRIVER=mongo` + `NEXT_PUBLIC_CMS_MODE=mongo`.
4. Confirm `GET /api/cms/health` → `apiEnabled: true`, `cloudinaryConfigured: true`.
5. Edit homepage in admin → public home reflects after tag revalidation.
6. Upload an image via Media Library (Cloudinary) → URL visible on the media record.

---

## 10. Admin UX notes

Labels are plain language (“Welcome banner”, not “Hero”). Overview dashboard explains
content counts vs visitor analytics. System page unlocks Mongo and re-seeds.
