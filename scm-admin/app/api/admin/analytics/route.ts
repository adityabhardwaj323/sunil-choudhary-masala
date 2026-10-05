import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const token = cookies().get('admin_jwt')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authorized, no token' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || 'all';

    const baseUrl = process.env.API_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://scm-backend-ork4.onrender.com' : 'http://localhost:5000');
    const response = await fetch(`${baseUrl}/api/analytics?range=${range}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
