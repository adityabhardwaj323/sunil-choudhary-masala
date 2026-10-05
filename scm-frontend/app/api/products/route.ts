import { getBackendUrl } from '@/lib/apiConfig';
import { NextResponse } from 'next/server';

const API_BASE_URL = getBackendUrl();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    
    // Forward the GET request to the Express backend
    const res = await fetch(`${API_BASE_URL}/api/products?search=${encodeURIComponent(search)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Error fetching products' },
      { status: 500 }
    );
  }
}
