import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code in callback' }, { status: 400 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const { tokens } = await oauth2Client.getToken(code);

  // You should store tokens in a secure session or Supabase for the user
  // For now, just return them (not secure for production!)
  return NextResponse.json(tokens);
}
