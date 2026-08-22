import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
    
    const response = await fetch(`${API_BASE_URL}/api/settings/public`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Settings are global and rarely change, but we might want them fresh for checkout
      cache: 'no-store'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ message: errorData.message || 'Failed to fetch settings' }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
