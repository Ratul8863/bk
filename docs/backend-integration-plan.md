# Backend Integration Plan — BKSR CMS

This document maps the frontend `contentRepository` abstraction to a future production stack (MongoDB, auth/RBAC, APIs, media storage, forms, search, analytics). The admin UI and public site should continue calling repository methods; only the repository implementation changes.

## Current state

| Layer | Today |
|-------|--------|
| Persistence | Browser `localStorage` key `bksr-cms-v1` |
| Seed | `src/content/seed/*` compiled into the app |
| Abstraction | `src/lib/cms/repository.ts` → `contentRepository` |
| Admin | Client-only CRUD under `/admin` |
| Auth | None (demo layout only) |

**Rule:** Never scatter storage or HTTP details in React components. Swap the repository body (or inject an API-backed adapter) and keep component contracts stable.

---

## 1. MongoDB data model

Mirror `ContentDatabase` / `src/types/content.ts`:

| Collection | Documents | Notes |
|------------|-----------|--------|
| `site_settings` | singleton | Org identity, contact, social, default SEO |
| `navigation` | singleton or keyed docs (`main`, `footer`, `knowledgeHub`) | Ordered trees; support `visible` + nested `children` |
| `homepage` | singleton | Hero, featured IDs, sections, stats |
| `pages` | one per page | Soft delete optional |
| `people` | one per person | Index `category`, `status`, `slug` |
| `research_areas` | one per area | |
| `research_projects` | one per project | Index `researchStatus`, `areaIds` |
| `publications` | one per pub | Index `type`, `year`, `status` |
| `activities` | | |
| `news` | | |
| `events` | Index `eventStatus`, `startAt` | |
| `notices` | | |
| `resources` | | |
| `gallery_albums` / `gallery_images` | | |
| `media` | assets metadata | Binary in Blob/S3/Cloudinary |

**IDs:** Keep string UUIDs (or migrate to ObjectId with a stable `legacyId` / `slug` field). Public routes rely on `slug`.

**Timestamps:** Preserve `createdAt`, `updatedAt`, `publishedAt`. Set `publishedAt` on first publish in the API layer (admin already hints this client-side).

**Versioning (optional later):** `content_revisions` collection storing patches per entity for audit/rollback.

---

## 2. Repository → API mapping

Replace localStorage methods with fetch to Route Handlers or a separate API:

| `contentRepository` method | Suggested API |
|----------------------------|---------------|
| `getDatabase()` / `getAll(key)` | `GET /api/cms/:collection` (+ filters) |
| `getById` / `getBySlug` | `GET /api/cms/:collection/:id` or `?slug=` |
| `create` | `POST /api/cms/:collection` |
| `update` | `PATCH /api/cms/:collection/:id` |
| `remove` / `delete` | `DELETE /api/cms/:collection/:id` |
| `duplicate` | `POST /api/cms/:collection/:id/duplicate` |
| `updateSiteSettings` | `PATCH /api/cms/site-settings` |
| `updateHomepage` | `PATCH /api/cms/homepage` |
| `updateNavigation` | `PATCH /api/cms/navigation` |
| `resetDatabase` | Admin-only `POST /api/cms/reset` (staging only) |
| `saveDatabase` | Remove from public surface; use granular writes |

**Public site reads:** Prefer server components calling a server-side repository (Mongo direct or cached `GET`) so unpublished drafts never leak. Admin keeps a client repository that talks to authenticated APIs.

**Suggested adapter shape:**

```ts
// src/lib/cms/repository.ts (future)
export const contentRepository = createRepository(
  process.env.CMS_DRIVER === 'mongo' ? mongoAdapter : localStorageAdapter
);
```

---

## 3. Auth & RBAC

Introduce real auth before exposing write APIs.

| Role | Capabilities |
|------|----------------|
| `viewer` | Read published + drafts in admin (optional) |
| `editor` | Create/edit drafts; cannot publish or delete |
| `publisher` | Publish/unpublish; delete with confirmation |
| `admin` | Settings, navigation, homepage, media, user invite, reset |

**Integration options:** Clerk / Auth0 / NextAuth — protect `/admin` via middleware and all `/api/cms/*` mutations.

**Demo note:** Current UI shows a non-functional “Editor (demo)” chip. Replace with real session user; do not treat layout chrome as security.

---

## 4. Media storage (Cloudinary / S3)

Admin Media Library already stores `MediaAsset` metadata (`url`, `alt`, `title`, `kind`) and mocks upload via URL/placeholder.

| Step | Work |
|------|------|
| Upload endpoint | `POST /api/media/upload` → Cloudinary/S3 → return CDN URL |
| Persist metadata | `contentRepository.create('media', …)` with returned URL |
| Delete | Remove blob + Mongo doc; optional orphan scan |
| Transformations | Store `width`/`height`; use provider transforms for thumbnails |

Keep the Media Library UI; only swap the “Add media” dialog’s create path to multipart upload.

---

## 5. Contact forms

Public contact form should **not** write through the content CMS collections.

| Piece | Plan |
|-------|------|
| API | `POST /api/contact` with Zod validation + honeypot/rate limit |
| Delivery | Email (Resend/SES) to `siteSettings.emails.*` |
| Storage (optional) | `contact_submissions` Mongo collection for CRM |
| Admin | Future “Inbox” under Communication — separate from publishing CMS |

---

## 6. Newsletter

| Piece | Plan |
|-------|------|
| Provider | Buttondown / Mailchimp / Listmonk |
| API | `POST /api/newsletter/subscribe` |
| CMS link | Site settings may store list ID / embed URL; not content documents |

---

## 7. Search

Today: `src/lib/cms/search.ts` builds an in-memory index from the database.

| Phase | Approach |
|-------|----------|
| Near-term | Keep client/server index over Mongo published docs |
| Scale | Meilisearch / Typesense / Atlas Search synced on publish |
| Admin | Reuse same index fields; filter by `status` |

Hook publish/unpublish webhooks (or repository `update`) to reindex.

---

## 8. Analytics

Dashboard intentionally shows **content metrics only** (counts, drafts, upcoming events, recently edited).

| Analytics type | Where it lives |
|----------------|----------------|
| Content ops | Keep on `/admin` dashboard from repository aggregates |
| Visitors | Plausible / GA4 / Vercel Analytics on the **public** site only |
| Admin | Optional “Traffic” section later — never mix fake visitor numbers into content cards |

---

## 9. Migration path from localStorage demo

1. Export seed + any local overrides via a “Export JSON” admin action (add when needed).
2. Import into Mongo with a one-shot script (`scripts/migrate-cms-to-mongo.mjs`).
3. Flip `CMS_DRIVER=mongo` and deploy API routes.
4. Lock down `/admin` with auth middleware.
5. Point Media “upload” at Cloudinary/S3.
6. Retire `resetDatabase` in production (or restrict to staging).

---

## 10. Integration checklist (by admin surface)

| Admin route | Repository touchpoint | Backend successor |
|-------------|----------------------|-------------------|
| `/admin` dashboard | `getDatabase()` aggregates | Aggregation queries / cached counts |
| Collection CRUD | `getAll` / `create` / `update` / `remove` / `duplicate` | REST/GraphQL + RBAC |
| `/admin/homepage` | `updateHomepage` | Singleton document API |
| `/admin/navigation` | `updateNavigation` | Navigation document API |
| `/admin/settings` (+ contact/social/seo) | `updateSiteSettings` | Settings API |
| `/admin/media` | `media` collection | Upload service + metadata API |
| `/admin/system` | `resetDatabase` / `STORAGE_KEY` | Staging-only ops; health checks |

---

## 11. Non-goals for v1 backend

- Real-time collaborative editing
- Full revision UI
- Multilingual workflow beyond existing `language` fields
- Fabricating visitor analytics in the CMS dashboard
