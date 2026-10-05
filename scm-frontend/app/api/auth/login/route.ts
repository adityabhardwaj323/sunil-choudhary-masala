import { getBackendUrl, isSecureCookie } from '@/lib/apiConfig';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const backendUrl = getBackendUrl();
    
    const backendRes = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await backendRes.json();
    
    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }
    
    // Omit token from client response
    const { token, ...user } = data;
    
    const response = NextResponse.json(user, { status: 200 });
    
    response.cookies.set('customer_jwt', token, {
      httpOnly: true,
      secure: isSecureCookie(req),
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });
    
    return response;
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
