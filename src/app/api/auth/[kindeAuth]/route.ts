import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  // Log the entire URL for debugging
  console.log('Callback URL:', url.toString());

  // Extract the 'code' parameter
  const code = url.searchParams.get('code');

  // Log the extracted code
  console.log('Authorization Code:', code);

  if (!code) {
    return new Response('No code provided', { status: 400 });
  }

  try {
    const response = await fetch('https://barfi.kinde.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://quill-five-ashen.vercel.app/api/auth/kinde_callback',
        client_id: process.env.KINDE_CLIENT_ID as string,
        client_secret: process.env.KINDE_CLIENT_SECRE as string,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error fetching token:', data);
      return new Response('Authentication failed', { status: 400 });
    }

    // Handle the token (e.g., save it to session or cookies)
    console.log('Authentication successful, token data:', data);

    // Redirect the user or return a success response
    return new Response('Authentication successful', { status: 200 });
  } catch (error) {
    console.error('Error during token exchange:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
