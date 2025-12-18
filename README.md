# Vyayam Coach (MVP)

A local-first Next.js fitness guidance app that helps users gain muscle or lose fat with a transparent calorie algorithm. Data is stored in SQLite via Prisma and authenticated with simple email/password + session cookies.

## Tech stack
- Next.js (App Router, TypeScript)
- Tailwind CSS
- Prisma ORM with SQLite
- Vitest for tests

## Getting started
1. **Install Node.js LTS** (18+ recommended).
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set environment variables**
   ```bash
   cp .env.example .env
   # Update SESSION_SECRET if desired
   ```
4. **Run Prisma migrations** (creates `dev.db`)
   ```bash
   npm run db:migrate
   ```
5. **Start the development server**
   ```bash
   npm run dev
   ```
6. **Open the app** at [http://localhost:3000](http://localhost:3000)

## NPM scripts
- `npm run dev` – start Next.js in dev mode
- `npm run build` – production build
- `npm start` – start the built app
- `npm run db:migrate` – run Prisma migrations
- `npm run db:studio` – open Prisma Studio
- `npm test` – run Vitest suite

## Key features
- Email/password auth with secure httpOnly session cookie stored in SQLite
- Profile management (age, weight, goal)
- Calorie logging with last 14 days table and 7-day rolling average
- Guidance engine: maintenance estimate, target calories, on/off track status, weekly recommendation, projection, and science notes
- Clean Tailwind UI across landing, auth, dashboard, profile, and calorie pages

## File structure
- `src/app` – App Router pages and API route handlers
- `src/components` – shared UI components
- `src/lib` – Prisma client, auth/session helpers, date utils, guidance algorithm, validation schemas
- `src/tests` – Vitest suites for guidance logic and guidance API
- `prisma/schema.prisma` – database schema (SQLite)

## Expected URLs
- `/` – landing page
- `/auth/login` – login
- `/auth/register` – register
- `/dashboard` – guidance dashboard
- `/dashboard/profile` – edit profile
- `/dashboard/calories` – log calories

## Notes
- Sessions expire after 7 days; logout clears the session cookie.
- Guidance algorithm counts missing days as zero calories in the 7-day average for transparency.
- No external paid APIs are used; everything runs locally.
