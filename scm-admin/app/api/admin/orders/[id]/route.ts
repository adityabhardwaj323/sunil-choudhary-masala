import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

// Express only exposes GET /api/orders (list, admin-only) and
// PUT /api/orders/:id/status — there is no single-order-by-id admin
// endpoint on the backend. This route fetches the admin order list
// server-side and returns the matching order, so the frontend can still
// treat it as a single-order lookup without any backend changes.
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get('admin_jwt')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(errorData, { status: response.status });
    }

    const orders = await response.json();
    const list = Array.isArray(orders) ? orders : orders.orders || [];
    const order = list.find(
      (o: any) => o._id === params.id || o.orderId === params.id
    );

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
