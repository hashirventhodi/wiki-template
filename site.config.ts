/**
 * Single source of truth for this wiki's branding.
 *
 * When you generate a project from this template, edit the values here — they
 * flow into the page metadata, the navbar/footer, and the generated
 * /llms.txt and /llms-full.txt files. This is the only file you must change
 * to rebrand the wiki.
 */
export const site = {
  /** Display name — browser title and the llms.txt H1. */
  name: 'Project Wiki',
  /** Short brand label shown in the navbar and footer. */
  org: 'Project',
  /** One-sentence summary. Used in page metadata and the llms.txt summary. */
  description:
    'Internal product wiki — vision, product spec, architecture, decisions, business, and roadmap.',
  /** Public base URL of the deployed wiki. Used for metadata and absolute llms.txt links. */
  url: 'http://localhost:3000',
  /** Source repository base, for Nextra "edit on GitHub" links (disabled by default). */
  repoUrl: 'https://github.com/OWNER/REPO/tree/main'
} as const
