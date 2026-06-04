# CLAUDE.md

The canonical guidance for this repo lives in [AGENTS.md](./AGENTS.md). Read it first —
it covers commands, structure, conventions, the authoring workflow, and boundaries.

Quick reminders specific to Claude Code:

- **`pnpm build` is the validation gate.** There is no unit-test suite; the build catches
  MDX, frontmatter, route, and Mermaid errors. Run it before committing.
- **Branding lives only in `site.config.ts`.** Don't scatter the project name elsewhere.
- **Stage explicit paths** (`git add path/to/file`), never `git add -A` / `git add .`.
- **Never hand-edit `/llms.txt` or `/llms-full.txt`** — they're generated in `lib/wiki.ts`.
