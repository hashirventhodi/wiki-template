# Copilot instructions

This repository's agent guidance is maintained in [`AGENTS.md`](../AGENTS.md) at the repo
root — treat it as the source of truth. GitHub Copilot reads this file; everything below
is a summary of `AGENTS.md`.

- Internal Nextra 4 / Next.js 16 wiki. Content is MDX under `content/`.
- `pnpm build` is the validation gate — run it before committing (no unit-test suite).
- Branding lives only in `site.config.ts`.
- Page conventions are in `content/operations/style-guide.mdx`: one H1, required
  `title`/`description` frontmatter, `<StatusBadge>` on the H1, absolute internal links,
  Mermaid for flows ≥3 steps.
- New pages: copy from `templates/`, then add them to the folder's `_meta.ts`.
- Never hand-edit `/llms.txt` or `/llms-full.txt` (generated in `lib/wiki.ts`); never use
  `git add -A`.
