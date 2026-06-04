/**
 * Generates the /llms.txt and /llms-full.txt views of the wiki.
 *
 * Both are derived from Nextra's page map at build time, so they stay in sync
 * with `content/` automatically — adding or removing a page updates them with
 * no manual step. See https://llmstxt.org for the convention.
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { getPageMap } from 'nextra/page-map'
import { normalizePages } from 'nextra/normalize-pages'
import { site } from '@/site.config'
import { mdxToMarkdown, stripLeadingH1 } from './content-utils.mjs'

const CONTENT_DIR = path.join(process.cwd(), 'content')

type DocItem = {
  name: string
  route?: string
  title?: unknown
  frontMatter?: Record<string, unknown>
  children?: DocItem[]
}

/** Resolve a page's display title from its meta title, then frontmatter, then slug. */
function titleOf(item: DocItem): string {
  if (typeof item.title === 'string' && item.title.trim()) return item.title
  const fmTitle = item.frontMatter?.title
  if (typeof fmTitle === 'string' && fmTitle.trim()) return fmTitle
  return item.name
}

function descriptionOf(item: DocItem): string | undefined {
  const d = item.frontMatter?.description
  return typeof d === 'string' && d.trim() ? d : undefined
}

function absoluteUrl(route: string): string {
  return new URL(route, site.url).href
}

async function getNormalized() {
  const list = await getPageMap()
  return normalizePages({ list, route: '/' }) as unknown as {
    docsDirectories: DocItem[]
    flatDocsDirectories: DocItem[]
  }
}

/** Map a page route to its source `.mdx` file, handling both `foo.mdx` and `foo/index.mdx`. */
async function resolveContentPath(route: string): Promise<string | null> {
  const rel = route === '/' ? 'index' : route.replace(/^\//, '')
  const candidates = [path.join(CONTENT_DIR, `${rel}.mdx`), path.join(CONTENT_DIR, rel, 'index.mdx')]
  for (const candidate of candidates) {
    try {
      await fs.access(candidate)
      return candidate
    } catch {
      // try next candidate
    }
  }
  return null
}

const header = (note: string): string[] => [
  `# ${site.name}`,
  '',
  `> ${site.description}`,
  '',
  note,
  ''
]

/** Curated index: H1 + summary + one section per top-level folder, with page links. */
export async function generateLlmsTxt(): Promise<string> {
  const { docsDirectories, flatDocsDirectories } = await getNormalized()

  const sectionTitles = new Map<string, string>()
  for (const top of docsDirectories) sectionTitles.set(top.name, titleOf(top))

  // Group the flat, meta-ordered page list by its top-level route segment,
  // preserving first-seen order so sections follow sidebar order.
  const groups = new Map<string, { title: string; pages: DocItem[] }>()
  for (const page of flatDocsDirectories) {
    if (!page.route) continue
    const segment = page.route === '/' ? '' : page.route.split('/')[1]
    const title = segment === '' ? 'Overview' : sectionTitles.get(segment) ?? segment
    if (!groups.has(segment)) groups.set(segment, { title, pages: [] })
    groups.get(segment)!.pages.push(page)
  }

  const lines = header(
    'Machine-readable index of this wiki (llms.txt convention). Full text of every ' +
      'page is at /llms-full.txt. Working in the source repo? Read content/**/*.mdx directly.'
  )

  for (const { title, pages } of groups.values()) {
    lines.push(`## ${title}`, '')
    for (const page of pages) {
      const description = descriptionOf(page)
      lines.push(`- [${titleOf(page)}](${absoluteUrl(page.route!)})${description ? `: ${description}` : ''}`)
    }
    lines.push('')
  }

  return lines.join('\n').trimEnd() + '\n'
}

/** Full corpus: every page's body concatenated, frontmatter stripped, in sidebar order. */
export async function generateLlmsFullTxt(): Promise<string> {
  const { flatDocsDirectories } = await getNormalized()

  const lines = header('Full text of every wiki page, concatenated in sidebar order. Generated from content/.')

  for (const page of flatDocsDirectories) {
    if (!page.route) continue
    const filePath = await resolveContentPath(page.route)
    if (!filePath) continue
    const raw = await fs.readFile(filePath, 'utf8')
    const body = stripLeadingH1(mdxToMarkdown(raw)).trim()
    lines.push(`# ${titleOf(page)}`, `Source: ${absoluteUrl(page.route)}`, '', body, '', '---', '')
  }

  return lines.join('\n').trimEnd() + '\n'
}
