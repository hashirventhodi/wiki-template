/**
 * Dependency-free helpers for parsing wiki content and converting MDX to plain
 * Markdown. Imported by both the Next build (`lib/wiki.ts`) and the standalone
 * Node scripts in `scripts/`, so this is plain ESM JavaScript with JSDoc types.
 */

/** @typedef {{ frontmatter: string, body: string }} SplitResult */

/**
 * Split a leading YAML frontmatter block from the body.
 * @param {string} raw
 * @returns {SplitResult}
 */
export function splitFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) return { frontmatter: '', body: raw }
  return { frontmatter: match[1], body: raw.slice(match[0].length) }
}

/**
 * Parse the single-line `key: value` pairs used in this wiki's frontmatter.
 * Values may be wrapped in single or double quotes. This is intentionally small:
 * Nextra already validates YAML at build time, so this only needs to read the
 * handful of scalar fields the tooling checks (title, description, status).
 * @param {string} raw
 * @returns {Record<string, string>}
 */
export function parseFrontmatter(raw) {
  const { frontmatter } = splitFrontmatter(raw)
  /** @type {Record<string, string>} */
  const data = {}
  for (const line of frontmatter.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!match) continue
    let value = match[2].trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    data[match[1]] = value
  }
  return data
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
  const { body } = splitFrontmatter(raw)
  return tidyMarkdown(stripJsx(body))
}
