# Vyayam app - rebuild guide (QA/testing only)

A concise map for any agent to recreate the current app from scratch. This snapshot is for QA/testing; hardcoded users (e.g., `qa@qa.com`) and OTP shortcuts must not ship to production.

## Stack
- Next.js 14 (App Router, TypeScript), React 18, Zod.
- Tailwind base available; styling is custom in `src/styles/globals.css` (global font set to sans-serif).
- In-memory mock DB in `src/lib/db.ts` (no real database).

## Setup
1) `npx create-next-app@latest vyayam --ts --eslint`
2) Replace `package.json` with the dependency set in this repo (Next 14.2.5, React 18.3.1, Zod 3.23.8, Tailwind/PostCSS/TS dev deps).
3) Keep the default config files (`tsconfig.json`, `next.config.js`, `postcss.config.js`, `tailwind.config.js`). Delete `.next`, `node_modules`, Prisma artifacts.
4) Run `npm install`.

## Key files / structure
```
public/vyayam_app_logo.png
public/logos/vyayam_rest_of_the_app.png
public/Carousel/carousel-feed-1.png
public/Carousel/carousel-feed-2.png
src/app/layout.tsx              # global layout
src/app/page.tsx                # Coming Soon placeholder
src/app/login/page.tsx          # entry login UI (qa@qa.com + OTP flow)
src/app/dashboard/page.tsx      # Dashboard UI per Figma spec (carousel + goals)
src/app/api/auth/login/route.ts # QA auth handler
src/app/api/*                   # other legacy QA APIs (profile, calories, guidance, logout, register disabled)
src/components/*                # Legacy components; not used in current dashboard
src/lib/auth.ts, db.ts, date.ts, guidance.ts
src/styles/globals.css          # styling including login + dashboard tweaks
middleware.ts                   # redirects based on session
```

## Auth (current QA behavior)
- Legacy QA credentials: `qa` / `qa` accepted; sets static session `qa-static`.
- QA bypass user (for dev only): `qa@qa.com` with OTP `111111` accepted in `src/app/api/auth/login/route.ts`; UI flow in `src/app/login/page.tsx`.
- All data/session/calorie logs live in-memory; restarts reset state.

## Styling notes
- Login page matches `src/styles/Vyayam Login.png`; background tiles `src/styles/Background_scaled down.png`.
- Dashboard UI follows `specs/figma/vyayam-dashboard-goal-selection.json`; carousel feeds from `public/Carousel/*.png`; logo `public/logos/vyayam_rest_of_the_app.png`; goal card images from `public/app_elements/`.
- Other styling is hand-authored CSS in `src/styles/globals.css`; Tailwind utilities are available but not primary.

## Dangerous items to remove before live
- QA bypass user: `qa@qa.com` + OTP `111111` (API + UI as noted above).
- Hard-coded QA credentials (`qa`/`qa`) and static session cookie.
- In-memory data only; no real auth/logging/hardening.

## How to run
```bash
npm install
npm run dev
# open http://localhost:3000/login and use qa@qa.com + 111111 (or qa/qa)
```
