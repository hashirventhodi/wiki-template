# AGENTS.md

Guidance for coding agents working in this repository. This is the canonical
instruction file; `CLAUDE.md`, `.github/copilot-instructions.md`, and
`.cursor/rules/` all defer to it. Keep it short and current.

This repo is an **internal product wiki**: Nextra 4 on Next.js 16 (App Router),
React 19, MDX content under `content/`. Not customer-facing.

## Commands

```bash
pnpm install        # Node 20+
pnpm dev            # local site at http://localhost:3000
pnpm build          # the de facto test — catches MDX, frontmatter, route, and Mermaid errors
pnpm start          # serve the production build
```

There is no unit-test suite. **`pnpm build` is the validation gate** — run it before
committing any content or code change.

## Project structure

```
site.config.ts            Branding (name, org, description, url, repoUrl) — single source of truth
app/                       Next.js App Router shell
  layout.tsx               Nextra theme shell; reads site.config.ts
  [[...mdxPath]]/page.tsx  Catch-all that renders any content/**/*.mdx page
  llms.txt/route.ts        Generates /llms.txt   (index)        — do not hand-edit output
  llms-full.txt/route.ts   Generates /llms-full.txt (full text) — do not hand-edit output
lib/wiki.ts                Builds the llms.txt views from the Nextra page map
components/                StatusBadge, Decision — auto-injected into MDX (no import needed)
content/                   The wiki. Domain folders, each with an _meta.ts:
  vision/ product/ architecture/ decisions/ business/ roadmap/ operations/
  _meta.ts                 Top-level sidebar order
templates/                 Copy-paste skeletons for new pages and ADRs
```

## Conventions

Full rules: `content/operations/style-guide.mdx`. The essentials:

- One `#` H1 per page. Frontmatter requires `title` + `description`; strongly prefer
  `status` (`stable` | `draft` | `stub` | `deprecated`) plus `<StatusBadge status="…" />`
  next to the H1.
- File names are kebab-case `.mdx`. ADRs are zero-padded: `0001-…`, `0002-…`.
- Internal links are **absolute** paths (`/product/overview`), never relative.
- Mermaid for any flow ≥3 steps. Code blocks always carry a language tag.
- Voice is terse, decision-oriented, internal "we". No marketing adjectives.
- Watch the MDX/Mermaid gotchas table in the style guide (raw `<`, `;` in Mermaid
  labels, colons in frontmatter, etc.) — these fail at render, not always at build.

## Authoring a page

1. Copy `templates/page.mdx` (or `templates/adr.mdx` for a decision) into the right
   `content/<domain>/` folder; name it kebab-case.
2. Fill in frontmatter (`title`, `description`, `status`) and the H1 `<StatusBadge>`.
3. Add the page to that folder's `_meta.ts` so it appears in the sidebar in the
   intended order.
4. Use absolute internal links; end concept pages with a `→` follow-up links list.
5. Run `pnpm build` and reload the page in `pnpm dev` to confirm it renders.

`/llms.txt` and `/llms-full.txt` update automatically — never edit them by hand.

## Using the wiki as context

This wiki is meant to ground other agents working on the actual product. To load it:

- In-repo: read `content/**/*.mdx`. Each page's frontmatter gives `title`,
  `description`, `status`.
- Over HTTP: fetch `/llms.txt` for the index, `/llms-full.txt` for the full corpus.

Suggested read order: `vision/` → `product/` → `architecture/` → `decisions/`.

## Boundaries

- **Always**: run `pnpm build` before committing; keep `site.config.ts` as the only
  place branding lives; update `_meta.ts` when adding/removing/renaming pages.
- **Ask first**: deleting a folder or many pages; changing dependencies; editing an
  `accepted` ADR (supersede it with a new one instead).
- **Never**: add secrets, customer data, or marketing copy; deploy publicly without
  auth gating; hand-edit generated `llms*.txt`; use `git add -A`/`git add .` — stage
  explicit paths.

## Commits

Imperative, scoped subjects: `type(scope): <change>` (e.g. `docs(architecture): add data model`).
One content/code concern per commit.
