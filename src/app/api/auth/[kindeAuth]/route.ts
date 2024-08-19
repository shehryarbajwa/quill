import { NextRequest, NextResponse } from 'next/server';
import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server';
import { sendSlackNotification } from '@/lib/slack';

export async function GET(req: NextRequest, { params }: { params: { kindeAuth: string } }) {
  // Handle the authentication as normal
  return handleAuth(req, params.kindeAuth);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.event === 'user.created') {
    const user = body.data;
    await sendSlackNotification(
      "A new user has signed up!",
      user.given_name || user.family_name ? `${user.given_name || ''} ${user.family_name || ''}`.trim() : "Unknown",
      user.email || "No email found"
    );
  }

  return NextResponse.json({ received: true });
}