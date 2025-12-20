# Figma Specs (Source of Truth)

Design specs exported as JSON. Treat these files as the layout contract—do not “improve” or reinterpret the UI.

---

## Screen Specs

### 1) Vyayam Dashboard — Goal Selection
- **Spec file:** `vyayam-dashboard-goal-selection.json`
- **Route:** `/dashboard`
- **Next.js file:** `src/app/dashboard/page.tsx`
- **Purpose:** Goal selection screen with insight carousel, 2 goal cards, add-goal button, bottom nav.

---

## Build Rules (Non-negotiable)

- **Single source of truth:** Use the JSON spec for hierarchy, spacing, sizing, colors, radii, borders, shadows, and text.
- **No invention:** Do not add/remove elements or change spacing/typography.
- **Auto-layout intent:** Respect `layout` objects (AUTO_LAYOUT direction, padding, gap, alignment, justify).
- **Assets:** Carousel uses `src/styles/carousel-feed-1_large.png` and `src/styles/carousel-feed-2_large.png`; logo is `public/logos/vyayam_rest_of_the_app.png`.
- **Placeholders:** Only when no asset exists.
  - `IMAGE_PLACEHOLDER` → neutral block if no real image.
  - `VECTOR_PLACEHOLDER` → simple stroke-only SVG if no real SVG exists.
- **Exact dimensions:** Frame `390×844`. Root padding `12/16/20`. Child spacing `16`.
- **Shadows:** Use spec shadows; do not substitute Tailwind defaults if they differ.

---

## Assets

- Carousel images: `src/styles/carousel-feed-1_large.png`, `src/styles/carousel-feed-2_large.png`
- Logo: `public/logos/vyayam_rest_of_the_app.png`
- Icons/SVGs (if added later): `src/components/icons/vyayam/`

---

## Styling Conventions

- Use Tailwind utilities when they match exactly; otherwise use inline styles or CSS vars in `src/styles/globals.css`.
- Recommended CSS vars: `--vy-bg`, `--vy-surface`, `--vy-primary`, `--vy-text-dark`, `--vy-text-muted`, `--vy-border`, `--vy-border-dashed`, `--vy-inactive`, `--vy-shadow`, `--vy-dot-inactive`.

---

## Validation Checklist

- [ ] Root frame `390×844`
- [ ] Header icon `72×72` centered
- [ ] Carousel block ≥ `340×200`, radius `16`, border `#E6ECF2`, shadow `0 4 12 rgba(0,0,0,0.06)`, uses provided feed images
- [ ] Title typography: `22px / 600 / #1F2A33`
- [ ] Goal cards: `173×180`, radius `18`, correct bullets
- [ ] Add Goal button: `220×48`, **2px dashed** `#B8C7D6`, radius `14`
- [ ] Bottom nav: `72px` height, 3 tabs, active/inactive colors correct

---

## Notes

If the UI changes, update the JSON spec first. Code must follow the spec. Humans get emotional about this—don’t.***
