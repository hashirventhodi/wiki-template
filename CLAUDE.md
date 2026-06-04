# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

An internal product/team wiki — Nextra 4 on Next.js 16 (App Router), React 19, MDX content. Not customer-facing; do not deploy publicly without auth gating.

## Commands

- `pnpm install` — Node 20+ required.
- `pnpm dev` — local site at http://localhost:3000.
- `pnpm build` — the de facto test: catches MDX, frontmatter, route, and Mermaid errors. Run before opening a PR. There is no automated test suite.
- `pnpm start` — serve production build.

## Git hygiene

Stage explicit file paths. Avoid `git add -A` / `git add .` if this repo ever contains embedded git trees or generated artifacts.

## Architecture

- `app/[[...mdxPath]]/page.tsx` is a Nextra catch-all that renders any `content/**/*.mdx` page. New pages appear by adding MDX files; routing is path-based.
- `app/layout.tsx` wires the `nextra-theme-docs` shell and holds the branding constants (`SITE_NAME`, `ORG_NAME`, `REPO_URL`). Global CSS in `app/global.css`.
- `mdx-components.tsx` exposes shared MDX components — `<StatusBadge>` and `<Decision>` from `components/`. Usable in any MDX without import.
- `next.config.mjs` configures Nextra. Mermaid renders in fenced ` ```mermaid ` blocks.
- `content/_meta.ts` and per-directory `_meta.ts` files control sidebar order and titles. When adding a page, check whether its parent `_meta.ts` needs an entry.
- Domain folders under `content/`: `vision/`, `product/`, `architecture/`, `decisions/` (ADRs), `business/`, `roadmap/`, `operations/`. Cross-link with absolute paths (`/product/overview`).

## Content conventions (from `content/operations/style-guide.mdx`)

- One `#` H1 per page; frontmatter requires `title` + `description`, strongly prefers `status` (`stable` | `draft` | `stub` | `deprecated`), with `<StatusBadge status="..." />` inline next to the H1.
- File names are kebab-case `.mdx`. ADRs in `content/decisions/` use zero-padded prefixes: `0001-example-decision.mdx`.
- Internal links are absolute paths, never relative.
- Mermaid for any flow ≥3 steps. Code blocks always carry a language tag.
- Voice is terse, decision-oriented, internal "we". No marketing adjectives.
- Open questions go at the bottom of the page **and** in `/operations/open-questions` — cross-reference both ways.
- Project-specific terms go in `cspell.json`, not inline spell-check disables.

## Commits

Imperative, scoped subjects: `type(scope): <change>`. One content/code concern per commit.
