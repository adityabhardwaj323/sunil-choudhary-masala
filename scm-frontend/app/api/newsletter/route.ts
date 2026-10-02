import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ message: 'A valid email address is required.' }, { status: 400 });
    }

    // Forward to backend
    const res = await fetch(`${API_BASE_URL}/api/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: data.message || 'Subscription failed. Please try again.' },
        { status: res.status }
      );
    }

    return NextResponse.json({ message: 'Subscribed successfully!' }, { status: 200 });
  } catch (error: any) {
    // Backend may not yet support newsletter — treat gracefully
    return NextResponse.json(
      { message: 'Unable to subscribe at this time. Please try again later.' },
      { status: 503 }
    );
  }
}
