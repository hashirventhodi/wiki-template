import type { Metadata } from 'next'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'

import { Banner } from 'nextra/components'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import './global.css'

// ─── Branding ──────────────────────────────────────────────────────────────
// Replace these with your project's name when you generate from this template.
const SITE_NAME = 'Project Wiki'
const ORG_NAME = 'Project'
const REPO_URL = 'https://github.com/OWNER/REPO/tree/main'
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: SITE_NAME,
    template: `%s – ${SITE_NAME}`
  },
  description: `${ORG_NAME} internal wiki`,
  robots: {
    index: false,
    follow: false
  }
}

const navbar = <Navbar logo={<b>{ORG_NAME}</b>} />
const footer = <Footer>{ORG_NAME} internal wiki · {new Date().getFullYear()}</Footer>
const banner = <Banner storageKey="internal-banner">Internal — do not share.</Banner>

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          footer={footer}
          pageMap={await getPageMap()}
          docsRepositoryBase={REPO_URL}
          editLink={null}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
