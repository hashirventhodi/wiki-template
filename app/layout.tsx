import type { Metadata } from 'next'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'

import { Banner } from 'nextra/components'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { site } from '@/site.config'
import 'nextra-theme-docs/style.css'
import './global.css'

// All branding lives in site.config.ts — edit it there, not here.

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s – ${site.name}`
  },
  description: site.description,
  robots: {
    index: false,
    follow: false
  }
}

const navbar = <Navbar logo={<b>{site.org}</b>} />
const footer = <Footer>{site.org} internal wiki · {new Date().getFullYear()}</Footer>
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
          docsRepositoryBase={site.repoUrl}
          editLink={null}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
