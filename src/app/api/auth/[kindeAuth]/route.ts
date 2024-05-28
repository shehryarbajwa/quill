import { NextRequest, NextResponse } from 'next/server';
import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server';

export async function GET(req: NextRequest, { params }: { params: { kindeAuth: string } }) {
  const kindeAuth = params.kindeAuth;
  const result = await handleAuth(req, kindeAuth);

  try {
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error handling auth:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
