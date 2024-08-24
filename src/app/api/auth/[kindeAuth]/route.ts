import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { kindeAuth: string } }
) {
  const endpoint = params.kindeAuth
  console.log('Kinde Auth Endpoint:', endpoint)

  try {
    const response = await handleAuth(request, endpoint)
    if (response instanceof Response) {
      console.log('Kinde Auth Response Status:', response.status)

      if (response.status === 307) {
        const location = response.headers.get('Location')
        console.log('Redirect Location:', location)
        if (location) {
          return NextResponse.redirect(location)
        } else {
          console.error('Redirect location is null')
          return NextResponse.json({ error: 'Invalid redirect' }, { status: 400 })
        }
      }
    } else {
      console.log('Kinde Auth Response:', response)
    }

    return response
  } catch (error) {
    console.error('Kinde Auth Error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}