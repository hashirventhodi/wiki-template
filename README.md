# Wiki Template

A starter for an **internal product wiki** — vision, product spec, architecture, decisions (ADRs), business, and roadmap. Built with [Nextra 4](https://nextra.site/) on Next.js 16 (App Router), React 19, and MDX content.

> **Internal-only by default.** This template ships with `robots: noindex` and an "Internal — do not share" banner. Do not deploy publicly without auth gating.

## Use this template

Click **"Use this template"** on GitHub, then:

1. `pnpm install` (Node.js 20+).
2. Search-replace branding: `SITE_NAME`, `ORG_NAME`, `REPO_URL` in `app/layout.tsx`, and `{{PROJECT}}` / `Project` in `content/`.
3. `pnpm dev` → http://localhost:3000.
4. Replace the stub pages under `content/`. Read `content/operations/style-guide.mdx` first.

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
| `content/operations/` | Open questions, glossary, style guide |
| `app/`, `components/` | Next.js App Router shell and shared MDX UI |

## How it works

- `app/[[...mdxPath]]/page.tsx` is a Nextra catch-all that renders any `content/**/*.mdx` page. Add an MDX file and it routes automatically.
- `mdx-components.tsx` exposes `<StatusBadge>` and `<Decision>` to every MDX file without import.
- `content/_meta.ts` and per-directory `_meta.ts` files control sidebar order and titles.
- Mermaid diagrams render in fenced ` ```mermaid ` blocks via `@theguild/remark-mermaid`.
- Spell-check uses `cspell.json` — add project terms there.

## License

[MIT](LICENSE) — use it for anything, including the wikis you generate from it.
