# AGENTS.md

This file provides guidance to AI coding agents (and humans) when working with this repository.

## Project Overview

LayerCalc is a standalone, installable PWA for quick 3D print cost estimates. Runs entirely client-side — no backend, no database. Calculation logic is shared from LayerTrack. Settings persist via `localStorage`. Optimized for mobile with SEO (Portuguese) and AdSense monetization.

## Stack

- **Bundler:** Vite 6
- **UI:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Forms & Validation:** React Hook Form + Zod
- **PWA:** vite-plugin-pwa (Workbox, generateSW mode)
- **Testing:** Vitest + jsdom + @testing-library/react
- **Package manager:** pnpm

## Common Commands

```bash
pnpm install
pnpm dev          # start dev server
pnpm build        # production build → dist/
pnpm preview      # preview production build
pnpm test         # run all tests
pnpm tsc --noEmit # type check
```

## Architecture

### Project Layout

```
src/
  lib/            # Pure functions (cost.ts, time.ts) — copied from LayerTrack
  hooks/          # Generic hooks (use-local-storage.ts)
  schemas/        # Zod schemas
  components/     # UI components (calculator-form.tsx, ad-banner.tsx)
  App.tsx         # Root layout
  main.tsx        # React entry point
  index.css       # Tailwind v4 import
tests/
  lib/            # Unit tests for pure functions
  hooks/          # Unit tests for hooks
public/
  icons/          # PWA icons (192x192, 512x512) — fixed filenames, never hashed
  robots.txt
  sitemap.xml
```

### Data Flow

```
User input → React Hook Form (Zod validation) → pure calc functions → live preview
                  ↕
            useLocalStorage ↔ localStorage
```

No API calls. No server. Everything runs in the browser.

### PWA

Manifest is configured inline in `vite.config.ts` via `VitePWA({ manifest: { ... } })`. Do not add a `public/manifest.webmanifest` — the plugin generates it.

### AdSense

The AdSense loader `<script>` tag is in `index.html` using Vite's `%VITE_ADSENSE_PUBLISHER_ID%` substitution. `<AdBanner />` renders the `<ins>` element and calls `adsbygoogle.push({})` after mount.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_ADSENSE_PUBLISHER_ID` | Production only | AdSense publisher ID (`ca-pub-...`) |
| `VITE_ADSENSE_SLOT_ID` | Production only | AdSense ad slot ID |

Copy `.env.example` → `.env.local` and fill in after deploying.

## Rules

### Do

- Always use Tailwind variables for colors
- Always use shadcn/ui components; add new ones via `pnpm dlx shadcn@latest add <name>`
- Always use pnpm
- Always use TypeScript
- Always use Zod for validation
- Add tests for new pure functions and hooks
- Run `pnpm test` and `pnpm tsc --noEmit` before committing

### Don't

- Don't add a backend, API, or database — this is intentionally client-only
- Don't use classes — functions only
- Don't read `import.meta.env` outside of component/hook files
- Don't hardcode the domain (`layercalc.app`) anywhere except `index.html` and `public/sitemap.xml`
- Don't rename the icon files in `public/icons/` — they are referenced by the PWA manifest and `og:image`
