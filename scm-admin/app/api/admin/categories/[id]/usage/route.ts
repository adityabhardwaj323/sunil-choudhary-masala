import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://scm-backend-ork4.onrender.com' : 'http://localhost:5000');

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieToken = req.cookies.get('admin_jwt')?.value;
    const headerAuth = req.headers.get('authorization');
    let finalAuth = '';
    
    if (cookieToken) {
      finalAuth = `Bearer ${cookieToken}`;
    } else if (headerAuth) {
      finalAuth = headerAuth.startsWith('Bearer ') ? headerAuth : `Bearer ${headerAuth}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/categories/${params.id}/usage`, {
      method: 'GET',
      headers: {
        ...(finalAuth ? { 'Authorization': finalAuth } : {})
      }
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
