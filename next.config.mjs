import nextra from 'nextra'

// Note: remarkPlugins (e.g. @theguild/remark-mermaid) are intentionally omitted.
// Next 16 uses Turbopack for `next build` and only accepts JSON-serializable
// options to the nextra() loader. Function plugins are unsupported here.
// See https://nextra.site/docs/guide/turbopack
const withNextra = nextra({
  defaultShowCopyCode: true,
  search: {
    codeblocks: true
  },
  staticImage: true,
  readingTime: true
})

export default withNextra({
  reactStrictMode: true,
  turbopack: {
    resolveAlias: {
      'next-mdx-import-source-file': './mdx-components.tsx'
    }
  }
})
