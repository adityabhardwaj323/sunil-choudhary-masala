import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://scm-backend-ork4.onrender.com' : 'http://localhost:5000');

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/gallery`);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get('admin_jwt')?.value;
    const headerAuth = req.headers.get('authorization');
    let finalAuth = '';
    
    if (cookieToken) {
      finalAuth = `Bearer ${cookieToken}`;
    } else if (headerAuth) {
      finalAuth = headerAuth.startsWith('Bearer ') ? headerAuth : `Bearer ${headerAuth}`;
    }

    const contentTypeReq = req.headers.get('content-type') || '';
    const bodyBuffer = await req.arrayBuffer();
    
    const response = await fetch(`${API_BASE_URL}/api/gallery`, {
      method: 'POST',
      headers: {
        ...(finalAuth ? { 'Authorization': finalAuth } : {}),
        'Content-Type': contentTypeReq
      },
      body: bodyBuffer
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
