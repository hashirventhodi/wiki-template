/**
 * Generate per-page Markdown mirrors of every wiki page into `public/`, so that
 * appending `.md` to any page URL (e.g. /vision/overview.md) serves clean
 * Markdown to AI agents — the llms.txt ".md" convention used by Mintlify, the
 * Next.js docs, and others.
 *
 * Runs in `prebuild` and `predev`. Output is gitignored. A manifest tracks the
 * files we generate so stale mirrors are removed without touching other assets.
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { mdxToMarkdown } from '../lib/content-utils.mjs'

const ROOT = process.cwd()
const CONTENT_DIR = path.join(ROOT, 'content')
const PUBLIC_DIR = path.join(ROOT, 'public')
const MANIFEST = path.join(PUBLIC_DIR, '.generated-md.json')

/** Recursively list every `.mdx` file under a directory. */
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

/** Map a content file to its public `.md` output path (mirrors the page route). */
function outputPathFor(file) {
  const rel = path.relative(CONTENT_DIR, file).replace(/\.mdx$/, '')
  const route = path.basename(rel) === 'index' ? path.dirname(rel) : rel
  const slug = route === '.' ? 'index' : route
  return path.join(PUBLIC_DIR, `${slug}.md`)
}

async function readManifest() {
  try {
    return JSON.parse(await fs.readFile(MANIFEST, 'utf8'))
  } catch {
    return []
  }
}

async function main() {
  // Remove the files we generated last time (only those — never other assets).
  for (const rel of await readManifest()) {
    await fs.rm(path.join(PUBLIC_DIR, rel), { force: true })
  }

  const files = await listMdx(CONTENT_DIR)
  /** @type {string[]} */
  const written = []

  for (const file of files) {
    const outPath = outputPathFor(file)
    const markdown = mdxToMarkdown(await fs.readFile(file, 'utf8'))
    await fs.mkdir(path.dirname(outPath), { recursive: true })
    await fs.writeFile(outPath, markdown)
    written.push(path.relative(PUBLIC_DIR, outPath))
  }

  await fs.mkdir(PUBLIC_DIR, { recursive: true })
  await fs.writeFile(MANIFEST, JSON.stringify(written.sort(), null, 2) + '\n')
  console.log(`generate-md: wrote ${written.length} per-page Markdown file(s) to public/`)
}

main().catch((error) => {
  console.error('generate-md failed:', error)
  process.exit(1)
})
