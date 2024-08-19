import { NextRequest } from 'next/server';
import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server';

export async function GET(req: NextRequest, { params }: { params: { kindeAuth: string } }): Promise<Response> {
  const kindeAuth = params.kindeAuth;

  console.log('kindeAuth:The params going on here are:', process.env.KINDE_AUTH_SECRET, process.env.KINDE_CLIENT_ID, process.env.KINDE_CLIENT_SECRET, process.env.KINDE_ISSUER_URL, process.env.KINDE_SITE_URL, process.env.KINDE_POST_LOGOUT_REDIRECT_URL, process.env.KINDE_POST_LOGIN_REDIRECT_URL);

  // Make sure to await handleAuth since it is likely a promise
  const result = await handleAuth(req, kindeAuth);

  // Return the result as a proper Response object
  return new Response(JSON.stringify(result), { status: 200 });
}