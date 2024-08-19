import { NextRequest } from 'next/server';
import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server';

export async function GET(req: NextRequest, { params }: { params: { kindeAuth: string } }): Promise<Response> {
  try {
    // Log environment variables and params
    console.log('kindeAuth:', params.kindeAuth);
    console.log('Environment Variables:');
    console.log('KINDE_CLIENT_ID:', process.env.KINDE_CLIENT_ID);
    console.log('KINDE_CLIENT_SECRET:', process.env.KINDE_CLIENT_SECRET);
    console.log('KINDE_ISSUER_URL:', process.env.KINDE_ISSUER_URL);
    console.log('KINDE_SITE_URL:', process.env.KINDE_SITE_URL);
    console.log('KINDE_POST_LOGOUT_REDIRECT_URL:', process.env.KINDE_POST_LOGOUT_REDIRECT_URL);
    console.log('KINDE_POST_LOGIN_REDIRECT_URL:', process.env.KINDE_POST_LOGIN_REDIRECT_URL);

    // Log the incoming request
    console.log('Request Headers:', req.headers);
    console.log('Request Method:', req.method);
    console.log('Request URL:', req.url);

    // Make sure to await handleAuth since it is likely a promise
    const result = await handleAuth(req, params.kindeAuth);

    // Log the result of handleAuth
    console.log('Authentication Result:', result);

    // Return the result as a proper Response object
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    // Log any errors that occur
    console.error('Error occurred:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
