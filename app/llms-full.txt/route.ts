import { generateLlmsFullTxt } from '@/lib/wiki'

export const dynamic = 'force-static'

export async function GET() {
  return new Response(await generateLlmsFullTxt(), {
    headers: { 'content-type': 'text/plain; charset=utf-8' }
  })
}
