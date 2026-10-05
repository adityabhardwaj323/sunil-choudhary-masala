import { getBackendUrl, isSecureCookie } from '@/lib/apiConfig';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const backendUrl = getBackendUrl();
    
    // Create an AbortController with a 25-second timeout to bound wait times before Netlify's execution limit
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    let backendRes: Response;
    try {
      backendRes = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (networkErr: any) {
      clearTimeout(timeoutId);
      const isTimeout = networkErr?.name === 'AbortError';
      return NextResponse.json(
        {
          message: isTimeout
            ? 'Authentication service timed out. The server may be starting up, please try again in a moment.'
            : 'Server is starting up. Please wait a moment and try again.'
        },
        { status: isTimeout ? 504 : 503 }
      );
    } finally {
      clearTimeout(timeoutId);
    }
    
    let data;
    try {
      data = await backendRes.json();
    } catch (parseErr) {
      return NextResponse.json(
        { message: 'Authentication service returned an unexpected response. Please try again.' },
        { status: backendRes.status >= 500 ? 503 : backendRes.status }
      );
    }
    
    if (!backendRes.ok) {
      if (backendRes.status === 502 || backendRes.status === 503 || backendRes.status === 504) {
        return NextResponse.json(
          { message: 'Server is starting up. Please wait a moment and try again.' },
          { status: backendRes.status }
        );
      }
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
    return NextResponse.json(
      { message: 'An unexpected error occurred during login. Please try again.' },
      { status: 500 }
    );
  }
}
