# Vyayam (QA/Test snapshot)

Minimal Next.js App Router build with QA-only auth and a Figma-driven dashboard. Data is in-memory; no database or Prisma is used.

> Agent note: mandatory pre/post-condition gate lives in `AGENTS.md`.

## Tech stack
- Next.js 14 (App Router, TypeScript), React 18
- Tailwind base available; custom styles live in `src/styles/globals.css` (global font set to sans-serif)
- Zod for request validation
- In-memory mock DB (`src/lib/db.ts`)

## Getting started
1. Install Node.js LTS (18+ recommended).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```
4. Open the app at http://localhost:3000/login
5. QA login:
   - Email: `qa@qa.com`
   - OTP: `111111`

## NPM scripts
- `npm run dev` – start Next.js in dev mode
- `npm run build` – production build
- `npm start` – start the built app
- `npm test` – placeholder

## Key features (QA-only)
- Login at `/login` with QA bypass `qa@qa.com` + `111111` (legacy `qa/qa` also accepted in API).
- After login, land on `/dashboard` (Figma-spec goal selection screen with carousel).
- Root `/` shows a simple “Coming Soon” placeholder.
- No real persistence; all data is in-memory.

## File structure (high level)
- `src/app/login/page.tsx` – QA login UI + redirect to `/dashboard`
- `src/app/dashboard/page.tsx` – Figma-spec dashboard (carousel + goal cards + add button + bottom nav)
- `src/app/page.tsx` – Coming Soon placeholder
- `src/app/api/auth/login/route.ts` – QA auth handler (`qa@qa.com` OTP + legacy `qa/qa`)
- `src/styles/globals.css` – styling for login and dashboard
- `public/logos/vyayam_rest_of_the_app.png` – dashboard logo
- `public/Carousel/carousel-feed-1.png`, `public/Carousel/carousel-feed-2.png` – carousel images
- `public/app_elements/lose_weight_image.png`, `public/app_elements/gain_muscle_image.png` – goal tile images

## Expected URLs
- `/login` – entry login
- `/dashboard` – dashboard UI per Figma spec
- `/` – Coming Soon placeholder

## Notes / warnings
- QA bypass (`qa@qa.com` + `111111`) must be removed before production.
- Legacy `qa/qa` credential path remains in the API; remove before production.
- No real auth/session hardening; in-memory data only.
