// src/lib/designSpecLoader.ts
import type { DesignSpec } from "./designSpec";

// Import JSON directly (works in Next.js with TS; keep it outside src to avoid accidental bundling if you want)
// If your TS config complains, enable "resolveJsonModule": true in tsconfig.json.
import spec from "../../specs/figma/vyayam-dashboard-goal-selection.json";

export function getVyayamDashboardSpec(): DesignSpec {
  return spec as DesignSpec;
}
