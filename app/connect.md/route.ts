import { generateConnectSnippet } from '@/lib/wiki'

export const dynamic = 'force-static'

export async function GET() {
  return new Response(generateConnectSnippet(), {
    headers: { 'content-type': 'text/markdown; charset=utf-8' }
  })
}
