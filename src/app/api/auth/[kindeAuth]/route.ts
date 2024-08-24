import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { kindeAuth: string } }
): Promise<Response> {
  const endpoint = params.kindeAuth
  console.log('Kinde Auth Endpoint:', endpoint)

  try {
    const response = await handleAuth(request, endpoint)
    console.log('Kinde Auth Response Status:', response)

    if (response instanceof Response) {
      if (response.status === 307) {
        const location = response.headers.get('Location')
        console.log('Redirect Location:', location)
        if (location) {
          return NextResponse.redirect(location)
        }
      }
      return response
    } else {
      // If it's not a Response object, wrap it in a Response
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  } catch (error) {
    console.error('Kinde Auth Error:', error)
    return new Response(JSON.stringify({ error: 'Authentication failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}