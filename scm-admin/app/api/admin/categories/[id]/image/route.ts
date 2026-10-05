import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://scm-backend-ork4.onrender.com' : 'http://localhost:5000');

const forwardRequest = async (req: NextRequest, method: string, id: string, extraPath: string = '') => {
  try {
    const cookieToken = req.cookies.get('admin_jwt')?.value;
    const headerAuth = req.headers.get('authorization');
    let finalAuth = '';
    
    if (cookieToken) {
      finalAuth = `Bearer ${cookieToken}`;
    } else if (headerAuth) {
      finalAuth = headerAuth.startsWith('Bearer ') ? headerAuth : `Bearer ${headerAuth}`;
    }

    const headers: Record<string, string> = {};
    if (finalAuth) headers['Authorization'] = finalAuth;

    const contentType = req.headers.get('content-type');
    if (contentType) headers['Content-Type'] = contentType;

    const options: any = {
      method,
      headers
    };

    if (method !== 'GET' && method !== 'HEAD') {
      options.body = await req.arrayBuffer();
    }

    const targetUrl = `${API_BASE_URL}/api/categories/${id}${extraPath}`;
    const response = await fetch(targetUrl, options);
    
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }
    
    const data = await response.json().catch(() => null);
    return NextResponse.json(data || { message: 'Success' }, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
};

export async function GET(req: NextRequest, { params }: { params: { id: string } }) { return forwardRequest(req, 'GET', params.id, '/image'); }
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) { return forwardRequest(req, 'PUT', params.id, '/image'); }
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) { return forwardRequest(req, 'PATCH', params.id, '/image'); }
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) { return forwardRequest(req, 'DELETE', params.id, '/image'); }
