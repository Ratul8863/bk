# BK School of Research (BKSR)

Premium institutional website and frontend CMS for BK School of Research — an interdisciplinary research and publication organization based in Bangladesh.

**Positioning:** Shaping Evidence-Based Policy for a Changing Global Landscape

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Motion (Framer Motion)
- Lucide icons
- Frontend CMS with localStorage persistence (no backend yet)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the Content Studio (demo CMS).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run migrate` | Regenerate migration report from legacy imports |

## Architecture

```
src/
  app/(public)/     Public site routes
  app/admin/        Frontend CMS
  components/       UI, layout, editorial, admin, search
  content/seed/     Canonical seed content (legacy-derived)
  content/imported/ Raw Blogger JSON imports
  lib/cms/          Repository + search abstractions
  lib/content/      Server query helpers
  types/            CMS-ready TypeScript schemas
docs/               IA, design system, migration, backend plan
```

## Content & CMS

- Public pages read from seed data via `getSeedDatabase()` / query helpers.
- Admin edits persist in `localStorage` under key `bksr-cms-v1` through `contentRepository`.
- Reset demo data from **Admin → System**.
- No authentication in this phase — Content Studio is a frontend demo.

## Legacy migration

Primary source: [bkschoolofresearch.blogspot.com](https://bkschoolofresearch.blogspot.com/)

See:

- `docs/content-migration-report.md`
- `docs/phase-audit.md`
- `src/content/imported/`

## Documentation

- `docs/information-architecture.md`
- `docs/design-system.md`
- `docs/backend-integration-plan.md`
- `docs/phase-audit.md`

## Contact (verified)

BK School of Research  
Shahjadpur, Sirajganj-6770, Bangladesh  
Phone: +8801747256047  

- info@bkschoolofresearch.org  
- exe_dir@bkschoolofresearch.org  
- dir_res@bkschoolofresearch.org  

## Next phase

MongoDB, authentication/RBAC, media storage, and API persistence — see `docs/backend-integration-plan.md`.
