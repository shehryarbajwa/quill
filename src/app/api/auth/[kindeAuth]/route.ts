import { NextRequest } from 'next/server';
import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server';

export async function GET(req: NextRequest, { params }: { params: { kindeAuth: string } }): Promise<Response> {
  const kindeAuth = params.kindeAuth;

  console.log('kindeAuth:The params going on here are:', kindeAuth);

}
