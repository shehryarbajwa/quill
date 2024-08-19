import { NextRequest } from 'next/server';
import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server';

export async function GET(req: NextRequest, { params }: { params: { kindeAuth: string } }): Promise<Response> {
  const kindeAuth = params.kindeAuth;

  console.log('kindeAuth:The params going on here are:', kindeAuth);

  // Make sure to await handleAuth since it is likely a promise
  const result = await handleAuth(req, kindeAuth);

  // Return the result as a proper Response object
  return new Response(JSON.stringify(result), { status: 200 });
}
