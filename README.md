# Wiki Template

A starter for an **internal product wiki** — vision, product spec, architecture, decisions (ADRs), business, and roadmap. Built with [Nextra 4](https://nextra.site/) on Next.js 16 (App Router), React 19, and MDX content.

> **Internal-only by default.** This template ships with `robots: noindex` and an "Internal — do not share" banner. Do not deploy publicly without auth gating.

## Use this template

Click **"Use this template"** on GitHub, then:

1. `pnpm install` (Node.js 20+).
2. Edit `site.config.ts` — the single source of branding (name, org, description, url, repo).
3. `pnpm dev` → http://localhost:3000.
4. Replace the stub pages under `content/` (copy skeletons from `templates/`). Read `content/operations/style-guide.mdx` and `content/operations/authoring.mdx` first.

## Built for AI agents

This template is designed so coding agents can both **read** the wiki as project context and **edit** it correctly.

- **`AGENTS.md`** is the canonical agent instruction file (the cross-tool standard read by Codex, Copilot, Cursor, Claude Code, and others). `CLAUDE.md`, `.github/copilot-instructions.md`, and `.cursor/rules/wiki.mdc` are thin pointers to it — one source of truth, no drift.
- **`/llms.txt`** (curated index) and **`/llms-full.txt`** (full corpus) are generated from `content/` at build time via route handlers (`app/llms.txt/route.ts`, `lib/wiki.ts`), following the [llms.txt](https://llmstxt.org/) convention. They never go stale and need no manual upkeep.
- **`templates/`** holds copy-paste skeletons (`page.mdx`, `adr.mdx`) so agents generate conformant pages.

## Commands

```bash
pnpm install   # install deps (Node 20+)
pnpm dev       # local site at http://localhost:3000
pnpm build     # production build — the de facto test (catches MDX, frontmatter, route, Mermaid errors)
pnpm start     # serve production build
```

There is no automated test suite. Run `pnpm build` before opening a PR.

## Structure

| Path | Purpose |
|------|---------|
| `content/vision/` | What this is, who it's for, why it exists |
| `content/product/` | Product spec — features, surfaces, tiers |
| `content/architecture/` | System design, data model, flows |
| `content/decisions/` | Architecture Decision Records (ADRs) |
| `content/business/` | Pricing, validation, GTM, risks |
| `content/roadmap/` | Near-term and post-launch plans |
| `content/operations/` | Open questions, glossary, style guide, authoring |
| `site.config.ts` | Branding — the only file to edit when rebranding |
| `app/`, `components/`, `lib/` | App Router shell, shared MDX UI, llms.txt generation |
| `templates/` | Copy-paste skeletons for new pages and ADRs |

## How it works

- `app/[[...mdxPath]]/page.tsx` is a Nextra catch-all that renders any `content/**/*.mdx` page. Add an MDX file and it routes automatically.
- `mdx-components.tsx` exposes `<StatusBadge>` and `<Decision>` to every MDX file without import.
- `content/_meta.ts` and per-directory `_meta.ts` files control sidebar order and titles.
- Mermaid diagrams render in fenced ` ```mermaid ` blocks.
- `lib/wiki.ts` builds `/llms.txt` and `/llms-full.txt` from the Nextra page map.
- Spell-check uses `cspell.json` — add project terms there.

## Running locally vs deploying

The only environment-specific value is the **public URL**, used for page metadata and the
absolute links in `/llms.txt` and `/llms-full.txt`. It's resolved in `site.config.ts` in
this order: `NEXT_PUBLIC_SITE_URL` → Vercel's `VERCEL_PROJECT_PRODUCTION_URL` → `http://localhost:3000`.

**Local** — nothing to configure:

```bash
pnpm dev      # http://localhost:3000
```

**Deploy** — set the canonical URL so links resolve correctly:

```bash
# Any host (Docker, a VPS, CI): set it in the build/runtime environment
NEXT_PUBLIC_SITE_URL=https://wiki.yourcompany.com pnpm build && pnpm start
```

- **Vercel**: no config needed — `VERCEL_PROJECT_PRODUCTION_URL` is auto-detected. Set
  `NEXT_PUBLIC_SITE_URL` only if you serve from a custom domain you want as canonical.
- The URL is read at **build time** (the llms routes are statically generated), so set it
  before `pnpm build` and rebuild after changing it.
- See `.env.example`. For local overrides, copy it to `.env.local` (gitignored).

> **Internal-only.** This wiki ships with `robots: noindex` and an "Internal — do not share"
> banner, but that does not restrict access. **Put it behind auth before exposing it**
> (Vercel password protection / SSO, a reverse-proxy auth layer, or a private network).

## License

[MIT](LICENSE) — use it for anything, including the wikis you generate from it.
