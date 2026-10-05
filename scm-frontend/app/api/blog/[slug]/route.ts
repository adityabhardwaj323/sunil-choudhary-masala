import { getBackendUrl } from '@/lib/apiConfig';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const API_BASE_URL = getBackendUrl();

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blog/slug/${params.slug}`, { cache: 'no-store' });
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ message: 'Blog not found' }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
