import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_jwt')?.value;
  if (!token) return NextResponse.json({ message: 'Not authorized' }, { status: 401 });

  try {
    const search = req.nextUrl.search;
    let url = `${API_BASE_URL}/api/contact`;
    url += search;

    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        
      },
      cache: 'no-store'
    };

    const response = await fetch(url, options);
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      const text = await response.text();
      return new NextResponse(text, { status: response.status });
    }
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

