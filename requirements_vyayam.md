# Vyayam app – rebuild guide

This document captures everything needed to recreate the current state of the Vyayam app (QA-only, mobile-first goal + plan flow) from scratch.

## Stack and constraints
- Next.js 14 (App Router, TypeScript).
- React 18.
- Zod for request validation.
- Tailwind base utilities available but styling is hand-authored in `src/styles/globals.css`.
- No real database: an in-memory mock Prisma client in `src/lib/db.ts`. Authentication is QA-only (`qa/qa`), and data lives in memory.

## Setup
1) Create a new Next.js project with the App Router (e.g., `npx create-next-app@latest vyayam --ts --eslint`).
2) Replace `package.json` with:
```json
{
  "name": "vyayam",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "echo \"No automated tests yet\""
  },
  "dependencies": {
    "next": "^14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^22.9.0",
    "@types/react": "^18.3.11",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.13",
    "typescript": "^5.6.3"
  }
}
```
3) Delete any `.next`, `node_modules`, or Prisma artifacts. Keep `tsconfig.json`, `next.config.js`, `postcss.config.js`, and `tailwind.config.js` (standard from `create-next-app`).
4) Run `npm install` to recreate `node_modules` (no `package-lock.json` is committed; npm will generate a fresh one).

## File structure (key files)
```
public/
  vyayam_app_logo.png
src/
  app/
    layout.tsx
    page.tsx
    auth/
      login/page.tsx
      logout/route.ts
      register/route.ts
    api/
      auth/login/route.ts
      auth/logout/route.ts
      auth/register/route.ts
      profile/route.ts
      calories/route.ts
      guidance/route.ts
    dashboard/
      layout.tsx
      page.tsx
      calories/page.tsx
      profile/page.tsx
  components/
    Card.tsx
    FormField.tsx
    StatusBadge.tsx
  lib/
    auth.ts
    db.ts
    date.ts
    guidance.ts
  styles/
    globals.css
middleware.ts
tailwind.config.js
postcss.config.js
tsconfig.json
```

## Core app files

**`src/app/layout.tsx`**
```tsx
import "@/styles/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Vyayam Coach",
  description: "Local fitness guidance powered by transparent calorie targets.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
```

**`src/styles/globals.css`** (mobile-first styling, app shell, cards, goal/plan UI, and login UI). Copy the full contents from the repository; it defines:
- Body centering, app shell constraints.
- Header tabs, cards, fields, segmented controls, pill styles.
- Login background pattern, card, inputs, CTA button, and helper/error text.

**`src/app/page.tsx`** (goal → plan flow with in-app header and live calculations):
```tsx
"use client";
import { useMemo, useState } from "react";
type Unit = "kg" | "lb";
type TimeMode = "duration" | "date";
type Screen = "goal" | "plan";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("goal");
  const [unit, setUnit] = useState<Unit>("kg");
  const [timeMode, setTimeMode] = useState<TimeMode>("duration");
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [durationValue, setDurationValue] = useState("");
  const [durationUnit, setDurationUnit] = useState<"weeks" | "months">("weeks");
  const [targetDate, setTargetDate] = useState("");

  const parsedCurrentWeight = useMemo(() => {
    const value = parseFloat(currentWeight);
    return Number.isFinite(value) && value > 0 ? value : null;
  }, [currentWeight]);
  const parsedTargetWeight = useMemo(() => {
    const value = parseFloat(targetWeight);
    return Number.isFinite(value) && value > 0 ? value : null;
  }, [targetWeight]);

  const weeks = useMemo(() => {
    if (timeMode === "duration") {
      const value = parseFloat(durationValue);
      if (!Number.isFinite(value) || value <= 0) return null;
      return durationUnit === "weeks" ? value : value * 4;
    }
    if (!targetDate) return null;
    const target = new Date(targetDate);
    const today = new Date();
    const diffDays = (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays <= 1) return null;
    return diffDays / 7;
  }, [durationUnit, durationValue, targetDate, timeMode]);

  const weightsValid =
    parsedCurrentWeight !== null && parsedTargetWeight !== null && parsedTargetWeight < parsedCurrentWeight;
  const hasTime = weeks !== null && weeks > 1;
  const canSave = weightsValid && hasTime;
  const totalLoss = weightsValid ? parsedCurrentWeight! - parsedTargetWeight! : null;
  const weeklyRate = canSave && totalLoss !== null && weeks ? totalLoss / weeks : null;

  const dailyCalories = useMemo(() => {
    if (!weeklyRate || weeklyRate <= 0) return null;
    const base = 2000;
    const steps = weeklyRate / 0.25;
    const deficit = Math.min(steps * 300, 900);
    return Math.max(base - deficit, 1200) | 0;
  }, [weeklyRate]);

  const paceWarning = useMemo(() => {
    if (!weeklyRate) return "";
    if (weeklyRate < 0.25) return "This is a very gentle pace; great for long-term consistency.";
    if (weeklyRate <= 1) return "This is a typical healthy rate for fat loss.";
    return "This looks aggressive. Consider a longer timeframe for safety.";
  }, [weeklyRate]);

  const pillClass = !weeklyRate ? "" : weeklyRate < 0.25 ? "pill-gentle" : weeklyRate <= 1 ? "pill-normal" : "pill-aggressive";
  const summaryText =
    canSave && weeklyRate && weeks
      ? `You want to go from ${parsedCurrentWeight} ${unit} to ${parsedTargetWeight} ${unit} in about ${weeks.toFixed(
          1
        )} weeks. That is roughly ${weeklyRate.toFixed(2)} ${unit} per week.`
      : "Fill in your weights and timeframe to see your weekly rate.";
  const helperText =
    parsedCurrentWeight && parsedTargetWeight && parsedTargetWeight >= parsedCurrentWeight
      ? "For fat loss, target weight must be less than current weight."
      : "For fat loss, target weight should be lower than current weight.";
  const summaryWarning = canSave ? paceWarning : "";

  const handleSaveGoal = () => {
    if (!canSave) return;
    setScreen("plan");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-logo">
          <img src="/vyayam_app_logo.png" alt="Vyayam logo" />
        </div>
        <nav className="app-nav">
          <button className={`nav-link ${screen === "goal" ? "active" : ""}`} onClick={() => setScreen("goal")} type="button">
            Goal
          </button>
          <button className={`nav-link ${screen === "plan" ? "active" : ""}`} onClick={() => setScreen("plan")} type="button">
            Plan
          </button>
        </nav>
      </header>

      <main className="app-main">
        <section className={`screen ${screen === "goal" ? "active" : ""}`} id="goalScreen">
          <header className="screen-header">
            <h1>Set your fat-loss goal</h1>
            <p>We will use this to guide your weekly targets and calorie plan.</p>
          </header>

          <section className="card">
            <h2>Weight</h2>
            <label className="field">
              <span className="field-label">Current weight</span>
              <div className="field-row">
                <input type="number" placeholder="82" inputMode="decimal" value={currentWeight} onChange={(e) => setCurrentWeight(e.target.value)} />
                <div className="unit-toggle">
                  <button type="button" className={`unit-btn ${unit === "kg" ? "active" : ""}`} onClick={() => setUnit("kg")}>kg</button>
                  <button type="button" className={`unit-btn ${unit === "lb" ? "active" : ""}`} onClick={() => setUnit("lb")}>lb</button>
                </div>
              </div>
            </label>
            <label className="field">
              <span className="field-label">Target weight</span>
              <div className="field-row">
                <input type="number" placeholder="72" inputMode="decimal" value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)} />
                <div className="unit-toggle">
                  <button type="button" className="unit-btn active" disabled>kg</button>
                  <button type="button" className="unit-btn" disabled>lb</button>
                </div>
              </div>
            </label>
            <p className={`helper ${!weightsValid && parsedTargetWeight && parsedCurrentWeight ? "error" : ""}`}>{helperText}</p>
          </section>

          <section className="card">
            <h2>When do you want to reach this goal?</h2>
            <div className="segmented">
              <button type="button" className={`seg-btn ${timeMode === "duration" ? "active" : ""}`} onClick={() => setTimeMode("duration")}>By duration</button>
              <button type="button" className={`seg-btn ${timeMode === "date" ? "active" : ""}`} onClick={() => setTimeMode("date")}>By date</button>
            </div>
            {timeMode === "duration" ? (
              <div id="durationBlock">
                <label className="field">
                  <span className="field-label">Duration</span>
                  <div className="field-row">
                    <input type="number" placeholder="16" inputMode="numeric" value={durationValue} onChange={(e) => setDurationValue(e.target.value)} />
                    <select value={durationUnit} onChange={(e) => setDurationUnit(e.target.value as "weeks" | "months")}>
                      <option value="weeks">weeks</option>
                      <option value="months">months</option>
                    </select>
                  </div>
                </label>
              </div>
            ) : (
              <div id="dateBlock">
                <label className="field">
                  <span className="field-label">Target date</span>
                  <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
                </label>
              </div>
            )}
          </section>

          <section className="card">
            <h2>Summary</h2>
            <p className="summary-main">{summaryText}</p>
            {summaryWarning && <p className="summary-warning">{summaryWarning}</p>}
          </section>

          <footer className="screen-footer">
            <button className="btn-primary" onClick={handleSaveGoal} disabled={!canSave} type="button">Save goal &amp; view plan</button>
            <button className="btn-ghost" type="button" onClick={() => setScreen("plan")}>Skip for now</button>
          </footer>
        </section>

        <section className={`screen ${screen === "plan" ? "active" : ""}`} id="planScreen">
          <header className="screen-header">
            <h1>Calories &amp; weekly plan</h1>
            <p>Here is a placeholder plan based on your goal. You can fine-tune it later.</p>
          </header>
          <section className="card">
            <h2>Daily calorie target</h2>
            <div className="plan-highlight">
              <div>
                <p className="plan-number">{dailyCalories ?? "— — —"}</p>
                <p className="plan-caption">calories per day</p>
              </div>
              <div className={`plan-pill ${pillClass}`}>Goal: <span>{weeklyRate ? `${weeklyRate.toFixed(2)} ${unit}/week` : "—"}</span></div>
            </div>
            <p className="helper">This is a placeholder estimation using a simple rule. In the real app, we will personalize it using your age, height, sex, and activity level.</p>
          </section>
          <section className="card">
            <h2>Weekly breakdown</h2>
            <ul className="week-list">
              <li className="week-row"><div><p className="week-title">Check-in day</p><p className="week-sub">Weigh yourself once a week, same time of day.</p></div><span className="week-tag">Every Sunday</span></li>
              <li className="week-row"><div><p className="week-title">Workout target</p><p className="week-sub">Aim for 3-4 sessions per week (strength + cardio).</p></div><span className="week-tag">3-4x / week</span></li>
              <li className="week-row"><div><p className="week-title">Flex meals</p><p className="week-sub">Keep 1-2 flexible meals per week to stay consistent.</p></div><span className="week-tag">1-2 meals</span></li>
            </ul>
          </section>
          <section className="card">
            <h2>Progress preview</h2>
            <p className="helper">A simple progress graph will live here, showing your weight trend vs. target. For now, imagine a smooth line gliding down like a polite roller coaster.</p>
            <div className="graph-placeholder"><span>Graph placeholder</span></div>
          </section>
          <footer className="screen-footer">
            <button className="btn-ghost" type="button" onClick={() => setScreen("goal")}>Back to goal</button>
            <button className="btn-primary" type="button">Looks good</button>
          </footer>
        </section>
      </main>
    </div>
  );
}
```

**`src/app/auth/login/page.tsx`** (QA-only login UI):
```tsx
"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, remember }),
    });
    if (res.ok) {
      router.push("/");
      return;
    }
    const data = await res.json().catch(() => null);
    setError(data?.message || "Invalid credentials. Use qa / qa.");
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/vyayam_app_logo.png" alt="Vyayam logo" height={80} width={80} />
          <span>VYAYAM</span>
        </div>
        <h1 className="auth-title">Log in</h1>
        <p className="auth-subtitle">Jump back into your plan.</p>
        <form onSubmit={onSubmit} className="auth-form">
          <label className="auth-label" htmlFor="email">Email / username</label>
          <input id="email" className="auth-input" type="text" placeholder="qa" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <p className="helper" style={{ marginTop: "-6px", marginBottom: "12px" }}>Use valid credentials</p>
          <label className="auth-label" htmlFor="password">Password</label>
          <input id="password" className="auth-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <label className="auth-row">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Remember me
          </label>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="auth-button" disabled={loading}>{loading ? "Signing in..." : "Log in"}</button>
          <div className="auth-links">
            <a href="#">Forgot password?</a>
            <span>Do not have an account? <a href="#">Create one</a></span>
          </div>
        </form>
      </div>
    </div>
  );
}
```

**`middleware.ts`** (route protection & redirects):
```ts
import { NextRequest, NextResponse } from "next/server";
const SESSION_COOKIE = "vyayam_session";

export function middleware(req: NextRequest) {
  const session = req.cookies.get(SESSION_COOKIE)?.value;
  const { pathname } = req.nextUrl;

  if (!session && pathname.startsWith("/dashboard")) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (session && pathname.startsWith("/auth")) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
```

## API layer (QA-only)
- **`src/app/api/auth/login/route.ts`**: Accepts only `qa/qa`; sets a static session cookie (`qa-static`); returns helpful errors otherwise.
- **`src/app/api/auth/register/route.ts`**: Disabled; returns 403 with guidance to use QA credentials.
- **`src/app/api/auth/logout/route.ts`**: Clears the session cookie.
- **`src/app/api/profile/route.ts`**: GET/PUT profile for the QA user via the in-memory store.
- **`src/app/api/calories/route.ts`**: GET/POST calorie logs for QA user (in-memory).
- **`src/app/api/guidance/route.ts`**: Builds guidance payload from profile and last 14 days of logs using `lib/guidance.ts` and date helpers.

## Libs

**`src/lib/db.ts`** – in-memory mock Prisma:
- Stores a single user (`qa`), a profile, sessions, and calorie logs in memory.
- Implements `user`, `profile`, `session`, and `calorieLog` methods used by API routes.

**`src/lib/auth.ts`** – session utilities (QA-safe):
- `createSession`, `setSessionCookie`, `destroySession`, `getSessionUser`, `requireUser`, `clearSessionCookie`.
- Special-cases `qa-static` to allow auth without a DB.

**`src/lib/date.ts`** – date helpers (`formatYMD`, `parseYMD`, `getDateRange`, `getLastNDates`).

**`src/lib/guidance.ts`** – computes guidance payload based on profile and calorie logs (maintenance estimate, target calories, recommendation, projection).

## Dashboard pages (optional but retained)
- `src/app/dashboard/page.tsx`, `calories/page.tsx`, `profile/page.tsx` render the legacy dashboard, profile editor, and calorie logger, now backed by the in-memory DB.
- Components: `Card.tsx`, `FormField.tsx`, `StatusBadge.tsx` support these screens.

## Assets
- Place `vyayam_app_logo.png` in `public/` (copied from the prototype).

## How to run
```bash
npm install
npm run dev
# open http://localhost:3000/auth/login and sign in with qa / qa
```

## Notes / assumptions
- Authentication is intentionally hard-coded to QA-only (`qa/qa`); all other credentials return a clear error.
- All data (profile, sessions, calorie logs) is ephemeral and stored in memory—restarts reset data.
- Prisma has been removed; do not run `prisma generate` or expect a real database.
- Prototype and login mock HTML files were removed; the Next app is the single source of truth.
