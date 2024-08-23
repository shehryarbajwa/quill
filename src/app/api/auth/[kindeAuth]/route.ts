import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { kindeAuth: string } }
): Promise<NextResponse> {
  const endpoint = params.kindeAuth
  console.log('Endpoint:', endpoint)
  console.log('Request URL:', request.url)

  try {
    const authResponse = await handleAuth(request, endpoint)
    console.log('Auth Response:', authResponse)
    return NextResponse.json(authResponse)
  } catch (error) {
    console.error('Auth Error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}