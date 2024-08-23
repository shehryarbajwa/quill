import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { kindeAuth: string } }
): Promise<NextResponse> {
  const endpoint = params.kindeAuth
  const authResponse = await handleAuth(request, endpoint)
  return NextResponse.json(authResponse)
}