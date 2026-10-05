import { NextRequest } from 'next/server';

/**
 * Centralized API & Backend URL Resolution for SCM Customer Frontend
 * 
 * Provides consistent URL resolution across both local development (Node 18+ IPv4/IPv6)
 * and production (Netlify serverless functions communicating with Render backend).
 */

/**
 * Returns the base backend API URL.
 * 
 * Priority:
 * 1. API_BASE_URL (server-side explicit override, e.g. from Netlify environment)
 * 2. NEXT_PUBLIC_API_URL (publicly configured API URL, e.g. Render backend)
 * 3. Fallback to IPv4 loopback 'http://127.0.0.1:5000' (strictly avoiding 'localhost'
 *    which resolves to IPv6 '::1' on Node 18+ causing ECONNREFUSED when backend listens on IPv4).
 */
export function getBackendUrl(): string {
  const url = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
  // Strip trailing slash if present to ensure clean path concatenation
  return url.replace(/\/+$/, '');
}

/**
 * Determine whether cookies should have the Secure attribute.
 * 
 * In HTTPS environments (production on Netlify, Render, or any HTTPS request),
 * Secure must be true.
 * 
 * When running a local production build (`npm run build && npm run start`) on plain HTTP,
 * setting Secure: true causes browsers to reject/drop the cookie or fail to transmit it over HTTP.
 * 
 * This helper dynamically checks:
 * 1. Is request protocol HTTPS (via req.nextUrl.protocol, x-forwarded-proto, or req.headers)?
 * 2. If no request object is provided, falls back to checking NODE_ENV === 'production'
 *    while ensuring localhost/127.0.0.1 HTTP hostnames don't force Secure.
 */
export function isSecureCookie(req?: NextRequest): boolean {
  if (req) {
    // Check forwarded proto header (common behind Netlify/Vercel/reverse proxies)
    const proto = req.headers.get('x-forwarded-proto') || req.nextUrl.protocol;
    if (proto.startsWith('https')) return true;

    // Check host header - if request is hitting localhost/127.0.0.1 without HTTPS, don't set secure
    const host = req.headers.get('host') || req.nextUrl.host;
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      return false;
    }
  }

  // If in production on a real domain (not local), default to true
  return process.env.NODE_ENV === 'production';
}
