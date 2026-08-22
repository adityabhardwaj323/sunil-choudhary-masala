import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_jwt')?.value;
  const path = request.nextUrl.pathname;

  const isProtectedPath = path.startsWith('/account') || 
                          path.startsWith('/checkout') || 
                          path.startsWith('/orders') ||
                          path.startsWith('/order-detail') ||
                          path.startsWith('/cart') ||
                          path.startsWith('/wishlist');
                          
  const isAdminPath = path.startsWith('/admin') && path !== '/admin/login';
  const isAuthPath = path === '/login' || path === '/register';
  const isAdminAuthPath = path === '/admin/login';

  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url);
    const redirectPath = request.nextUrl.pathname + request.nextUrl.search;
    loginUrl.searchParams.set('redirect', redirectPath);
    return NextResponse.redirect(loginUrl);
  }
  
  if (isAdminPath && !token) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/account', request.url));
  }
  
  if (isAdminAuthPath && token) {
    // Note: presence of a valid session cookie only proves the user is
    // logged in, not that they're an admin — AdminLayout verifies the
    // actual role via /api/auth/profile and redirects non-admins back here.
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/account/:path*',
    '/checkout/:path*',
    '/orders/:path*',
    '/order-detail/:path*',
    '/cart/:path*',
    '/wishlist/:path*',
    '/login',
    '/register',
    '/admin/:path*'
  ],
};
