import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_jwt')?.value || req.headers.get('authorization');
    // Admin GET should fetch all blogs including drafts.
    const response = await fetch(`/api/blog`, {
      headers: { ...(token ? { 'Authorization': token } : {}) }
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_jwt')?.value || req.headers.get('authorization');
    const formData = await req.formData();
    const response = await fetch(`/api/blog`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': token } : {})
      },
      body: formData
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
