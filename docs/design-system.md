# BKSR Design System

Logo-aligned premium editorial system for BK School of Research. Navy / royal blue primary identity with a sparse red signature accent — not teal, not purple SaaS, not generic university chrome.

## Brand palette (logo)

| Token | Value | Role |
|-------|-------|------|
| `--bksr-navy` | `#173B6C` | Primary brand, CTAs, links |
| `--bksr-deep-navy` | `#0D2745` | Ink headings, dark bands, hover deepen |
| `--bksr-blue` | `#24558A` | Supporting blue |
| `--bksr-red` | `#B83A3A` | Signature accent only (~3%) |
| `--surface-blue` | `#EAF0F6` | Soft section washes |
| `--surface-blue-subtle` | `#F2F5F8` | Page hero / subtle bands |
| `--warm-white` | `#F8F7F3` | Page background |
| `--white` | `#FFFFFF` | Elevated panels / secondary buttons |
| `--text-primary` | `#17212B` | Body |
| `--text-secondary` | `#68727D` | Muted |
| `--border` | `#D9DEE5` | Hairlines |

**Mix target:** ~70% warm white · ~20% navy · ~7% soft blue · ~3% red.

### Semantic Tailwind aliases

Defined in `src/app/globals.css` via `@theme inline`:

| Utility | Maps to |
|---------|---------|
| `paper` | warm white |
| `ink` | deep navy |
| `accent` | navy (primary actions) |
| `sage` / `surface` | soft blue wash |
| `bronze` / `brand-red` | logo red accent |
| `brand-blue` | supporting blue |
| `body` / `muted` / `border` | text & lines |

Red usage (only): active nav underline, field index numbers, quote borders. Never as a full-bleed fill. No leading hairline before eyebrows. Filters use navy selected text — not red underlines.

## Typography

| Role | Family |
|------|--------|
| Display / editorial | **Newsreader** (`font-display`) |
| UI / body | **Manrope** (`font-sans`) |

Research-firm restraint: larger display titles, calm body, uppercase micro-labels (`Eyebrow`, `ArrowLink`). Avoid dense brochure copy in the first viewport.

## Buttons

`Button` variants in `src/components/ui/Button.tsx`:

| Variant | Use |
|---------|-----|
| `primary` | Navy fill, white text, `rounded-none` |
| `secondary` | Transparent, ink border |
| `onInk` | Paper fill on dark / ink bands |
| `onInkSecondary` | Paper outline on dark / ink bands |
| `ghost` | Transparent, soft surface hover |
| `tertiary` | Text link style |
| `ink` | Deep navy fill |
| `destructive` | Red fill (admin only) |

Arrows are **opt-in** via `withArrow`. No pill chrome.

## Panels / cards

Prefer title-led lists and hairline borders over card grids. `MediaCard` is quiet (border only). Publications: cover + type lead, then a list. Events: poster + date stamp, no heavy chrome. Utilities: `.bksr-panel`, `.bksr-panel-soft`, `.bksr-tile`. Header: always paper bar with the full colour lockup (`bksr-logo.png`).

## Hero

Lean brand-first hero: full-bleed media + navy wash. H1 **BK School of Research** on one line, one italic positioning line, motto micro-line, two CTAs. No stats / pathway cards / secondary marketing in the first viewport.

## Prototype media

Generated demo visuals live in `public/media/prototype/` and CMS media titled `[Prototype] …`. Labeled in UI via `PrototypeMediaNote`. Replace with authentic BKSR assets before production. Logo: `public/brand/bksr-logo.png`.

## Motion

Opacity / short translate only. Image hover scale restrained. Respect `prefers-reduced-motion`. Focus rings use navy.

## Layout primitives

`Container`, `Section` (`paper` \| `sage`/`surface` \| `white` \| `ink`), `SectionHeader`, `Button`, `ArrowLink`, `Eyebrow` (red marker), `Tag`, `ImageFrame`, `FilterBar` (navy + red selected underline), etc.

## Admin

Same navy primary / soft blue surfaces / red reserved for destructive or sparse accents. Demo localStorage messaging stays visible.
