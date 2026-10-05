import { getBackendUrl } from '@/lib/apiConfig';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = getBackendUrl();

export async function GET(req: NextRequest) {
  const token = req.cookies.get('customer_jwt')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store'
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
