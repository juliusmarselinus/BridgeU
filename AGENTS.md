<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# User & UI Conventions
1. **No Technical Database Annotations**: Never add technical labels/texts like "(Database Supabase)", "(Database Postgres)", or internal backend notes to user-facing UI elements, labels, or modals.
2. **Zero Emojis Policy**: Never use emojis in UI components, buttons, notifications, or text. Always use clean inline SVG icons.
3. **Modal Pickers & Options**:
   - For Semester selections, do NOT include a "Lainnya" option in the Modal Picker.
   - For Universitas & Program Studi selections, ensure there are no empty/blank options in the picker list, and include a "Lainnya" option at the top.

