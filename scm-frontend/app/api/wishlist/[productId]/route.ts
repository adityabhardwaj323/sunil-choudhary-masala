import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

export async function POST(req: NextRequest, { params }: { params: { productId: string } }) {
  const token = req.cookies.get('customer_jwt')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/wishlist/${params.productId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { productId: string } }) {
  const token = req.cookies.get('customer_jwt')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/wishlist/${params.productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
