# Repository Guidelines

## Project Structure & Module Organization

This repository is an internal product wiki built with Next.js, Nextra, and MDX. Core content lives under `content/` and is grouped by domain: `vision/`, `product/`, `architecture/`, `decisions/`, `business/`, `roadmap/`, and `operations/`. App-shell code lives in `app/`, with shared UI in `components/`.

## Build, Test, and Development Commands

- `pnpm install`: install dependencies; use Node.js 20+.
- `pnpm dev`: start the local docs site at `http://localhost:3000`.
- `pnpm build`: create a production build and catch MDX or route errors.
- `pnpm start`: serve the production build locally.

Run `pnpm build` before opening a PR, especially after editing Mermaid diagrams or frontmatter.

## Coding Style & Naming Conventions

TypeScript and React code uses concise functional components, `PascalCase` component names, and 2-space indentation. Content files are lowercase kebab-case MDX, for example `content/product/overview.mdx`. Internal links should use absolute paths such as `/product/overview`.

For MDX pages, follow `content/operations/style-guide.mdx`: one `#` heading per page, frontmatter with `title`, `description`, and preferably `status`, plus `<StatusBadge>` on the H1. ADRs belong in `content/decisions/` with zero-padded names like `0001-example-decision.mdx`.

## Testing Guidelines

There is no formal automated test suite. Validation is build-based: run `pnpm build` and manually reload edited pages in `pnpm dev` to catch MDX and Mermaid rendering issues. When adding project-specific terms, update `cspell.json` instead of disabling spell-checking inline.

## Commit & Pull Request Guidelines

Use imperative, prefix-style commit messages (`docs(scope): <change>`) and keep each commit focused on one content or code change. PRs should include a brief summary, affected sections or pages, and screenshots only for `app/` or `components/` UI changes.

## Security & Content Boundaries

This repo is internal-only. Do not add secrets, customer data, or publish-ready marketing copy. Do not deploy publicly without auth gating.
