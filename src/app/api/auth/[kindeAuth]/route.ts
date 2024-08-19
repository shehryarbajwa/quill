import { NextRequest } from 'next/server';

export async function GET(req: NextRequest): Promise<Response> {
  const url = new URL(req.url);

  // Log the entire callback URL for debugging
  console.log('Callback URL:', url.toString());

  // Extract the 'code' parameter from the URL
  const code = url.searchParams.get('code');

  // Log the extracted code or lack thereof
  console.log('Authorization Code:', code);

  if (!code) {
    console.error('Error: No authorization code provided');
    return new Response('No code provided', { status: 400 });
  }

  try {
    // Log the request details before making the fetch call
    console.log('Making request to token endpoint');

    const response = await fetch('https://barfi.kinde.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.KINDE_CLIENT_ID}:${process.env.KINDE_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://quill-five-ashen.vercel.app/api/auth/kinde_callback'
      })
    });

    // Log the response status and body
    const data = await response.json();
    console.log('Token response status:', response.status);
    console.log('Token response body:', data);

    if (!response.ok) {
      console.error('Error fetching token:', data);
      return new Response(`Authentication failed: ${data.error_description}`, { status: 400 });
    }

    // Log successful authentication
    console.log('Authentication successful, token data:', data);

    return new Response('Authentication successful', { status: 200 });
  } catch (error) {
    // Log any errors encountered during the token exchange
    console.error('Error during token exchange:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
