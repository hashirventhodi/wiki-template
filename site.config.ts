/**
 * Single source of truth for this wiki's branding and public URL.
 *
 * When you generate a project from this template, edit the static values here —
 * they flow into the page metadata, the navbar/footer, and the generated
 * /llms.txt and /llms-full.txt files. This is the only file you must change
 * to rebrand the wiki.
 */

/**
 * Resolve the canonical public URL, build-time first, with a local fallback.
 *
 *   1. NEXT_PUBLIC_SITE_URL          — set this in your deploy environment.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — auto-detected on Vercel, no config needed.
 *   3. http://localhost:3000         — local dev fallback.
 *
 * Evaluated server-side at build time (metadata + the force-static llms routes),
 * so the value is baked into the generated output for the target environment.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, '')

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  if (vercel) return `https://${vercel}`

  return 'http://localhost:3000'
}

export const site = {
  /** Display name — browser title and the llms.txt H1. */
  name: 'Project Wiki',
  /** Short brand label shown in the navbar and footer. */
  org: 'Project',
  /** One-sentence summary. Used in page metadata and the llms.txt summary. */
  description:
    'Internal product wiki — vision, product spec, architecture, decisions, business, and roadmap.',
  /** Canonical public URL. Set via NEXT_PUBLIC_SITE_URL in deployment; falls back to localhost. */
  url: resolveSiteUrl(),
  /** Source repository base, for Nextra "edit on GitHub" links (disabled by default). */
  repoUrl: 'https://github.com/OWNER/REPO/tree/main'
} as const
