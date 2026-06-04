/**
 * Dependency-light helpers for parsing wiki content and converting MDX to plain
 * Markdown. Imported by both the Next build (`lib/wiki.ts`) and the standalone
 * Node scripts in `scripts/`, so this is plain ESM JavaScript with JSDoc types.
 *
 * Frontmatter is parsed with gray-matter (full YAML), the same engine Nextra and
 * most static-site tooling use — so what validates here matches what the site sees.
 */
import matter from 'gray-matter'

/** @typedef {{ data: Record<string, unknown>, body: string }} ParsedContent */

/**
 * Parse a page's frontmatter (as YAML) and return it alongside the body.
 * @param {string} raw
 * @returns {ParsedContent}
 */
export function parseContent(raw) {
  const { data, content } = matter(raw)
  return { data, body: content }
}

/**
 * Remove self-closing JSX component tags (e.g. `<StatusBadge … />`, `<Decision … />`)
 * so the result is clean Markdown.
 * @param {string} md
 */
export function stripJsx(md) {
  return md.replace(/<[A-Z][A-Za-z0-9]*\b[^>]*\/>/g, '')
}

/**
 * Strip a leading `# Heading` line (used when a title is supplied separately).
 * @param {string} md
 */
export function stripLeadingH1(md) {
  return md.replace(/^\s*#\s+.*(?:\r?\n)+/, '')
}

/**
 * Collapse trailing whitespace and runs of blank lines, ending with one newline.
 * @param {string} md
 */
export function tidyMarkdown(md) {
  return md.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').trim() + '\n'
}

/**
 * Convert page MDX source to clean Markdown: frontmatter and self-closing JSX removed.
 * @param {string} raw
 */
export function mdxToMarkdown(raw) {
  return tidyMarkdown(stripJsx(parseContent(raw).body))
}
