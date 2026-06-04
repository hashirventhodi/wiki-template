/**
 * Validate wiki content before build. Catches the mistakes humans and agents make:
 * missing/invalid frontmatter, a missing H1, non-kebab-case filenames, and broken
 * internal links. Internal links are checked deterministically against the set of
 * real page routes — no network, no flakiness.
 *
 * Errors fail the build (exit 1); warnings are advisory. Runs in `prebuild` and CI.
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { parseFrontmatter, splitFrontmatter } from '../lib/content-utils.mjs'

const ROOT = process.cwd()
const CONTENT_DIR = path.join(ROOT, 'content')
const VALID_STATUS = new Set(['stable', 'draft', 'stub', 'deprecated'])
const DESCRIPTION_MIN = 50
const DESCRIPTION_MAX = 160

// Routes that exist but aren't content pages (generated route handlers / assets).
const EXTRA_ROUTES = new Set(['/llms.txt', '/llms-full.txt'])

/** @type {string[]} */
const errors = []
/** @type {string[]} */
const warnings = []

async function listMdx(dir) {
  /** @type {string[]} */
  const files = []
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await listMdx(full)))
    else if (entry.name.endsWith('.mdx')) files.push(full)
  }
  return files
}

/** Page route for a content file (`foo/index.mdx` → `/foo`, `index.mdx` → `/`). */
function routeFor(file) {
  const rel = path.relative(CONTENT_DIR, file).replace(/\.mdx$/, '')
  const trimmed = path.basename(rel) === 'index' ? path.dirname(rel) : rel
  return trimmed === '.' ? '/' : `/${trimmed.split(path.sep).join('/')}`
}

function isKebabCase(name) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)
}

async function main() {
  const files = await listMdx(CONTENT_DIR)
  const validRoutes = new Set([...files.map(routeFor), ...EXTRA_ROUTES])

  for (const file of files) {
    const rel = path.relative(ROOT, file)
    const raw = await fs.readFile(file, 'utf8')
    const data = parseFrontmatter(raw)
    const { body } = splitFrontmatter(raw)

    // Frontmatter.
    if (!data.title) errors.push(`${rel}: missing frontmatter "title"`)
    if (!data.description) {
      errors.push(`${rel}: missing frontmatter "description"`)
    } else if (data.description.length < DESCRIPTION_MIN || data.description.length > DESCRIPTION_MAX) {
      warnings.push(
        `${rel}: description is ${data.description.length} chars (aim for ${DESCRIPTION_MIN}–${DESCRIPTION_MAX})`
      )
    }
    if (!data.status) warnings.push(`${rel}: no "status" — prefer one of ${[...VALID_STATUS].join(', ')}`)
    else if (!VALID_STATUS.has(data.status)) errors.push(`${rel}: invalid status "${data.status}"`)

    // Structure.
    if (!/^#\s+\S/m.test(body)) errors.push(`${rel}: no H1 (a line starting with "# ")`)

    // Filename.
    const base = path.basename(file, '.mdx')
    if (!isKebabCase(base)) errors.push(`${rel}: filename is not kebab-case`)

    // Internal links: every ](/path) must resolve to a real route.
    for (const match of body.matchAll(/]\((\/[^)\s#]*)(?:#[^)\s]*)?\)/g)) {
      const target = match[1].replace(/\/$/, '') || '/'
      if (!validRoutes.has(target)) errors.push(`${rel}: broken internal link "${match[1]}"`)
    }
  }

  for (const warning of warnings) console.warn(`⚠ ${warning}`)
  if (errors.length) {
    for (const error of errors) console.error(`✗ ${error}`)
    console.error(`\nvalidate-content: ${errors.length} error(s), ${warnings.length} warning(s)`)
    process.exit(1)
  }
  console.log(`validate-content: ${files.length} page(s) OK, ${warnings.length} warning(s)`)
}

main().catch((error) => {
  console.error('validate-content failed:', error)
  process.exit(1)
})
