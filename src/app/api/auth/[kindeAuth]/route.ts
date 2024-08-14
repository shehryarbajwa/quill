import { NextRequest } from 'next/server';
import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server';

export async function GET(req: NextRequest, { params }: { params: { kindeAuth: string } }) {
  const kindeAuth = params.kindeAuth;
  return handleAuth(req, kindeAuth);
}