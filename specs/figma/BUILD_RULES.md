# Build Rules (Non-negotiable)

- Source of truth: specs/figma/vyayam-dashboard-goal-selection.json
- Do not add, remove, or rename UI elements.
- Match spacing, sizes, radii, shadows, and colors exactly.
- Use placeholders for IMAGE_PLACEHOLDER and VECTOR_PLACEHOLDER nodes.
- Implementation target: Next.js 14 App Router, React 18, TypeScript.
- Styling: Tailwind utilities allowed, but exact values must match JSON.
- Custom styling may be placed in src/styles/globals.css if it improves fidelity.
