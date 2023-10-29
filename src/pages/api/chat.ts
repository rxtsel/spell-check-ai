import type { APIRoute } from 'astro'
import { fixOrthograpy } from '../../lib/openai'

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get('Content-Type') === 'application/json') {
    const body = await request.json()
    const { ctx } = body
    return new Response(JSON.stringify({
      message: await fixOrthograpy(ctx)
    }), {
      status: 200
    })
  }
  return new Response(null, { status: 400 })
}
