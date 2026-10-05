import { ProductsResponse, Product, BlogPost } from '@/types';
import { getBackendUrl } from '@/lib/apiConfig';

const getBaseUrl = getBackendUrl;

/**
 * Controlled helper for read-only GET requests:
 * Attempts the fetch, and if it fails due to network error or 503/504 server sleep,
 * waits 2.5 seconds and retries ONCE (maximum 2 attempts).
 * Strictly for idempotent, read-only operations.
 */
async function fetchWithControlledRetry(
  url: string,
  options: RequestInit = {},
  retries = 1,
  delayMs = 2500
): Promise<Response> {
  let attempt = 0;
  while (true) {
    try {
      const res = await fetch(url, options);
      // If response is successful or a normal client error (400, 404), return it immediately
      if (res.ok || (res.status !== 502 && res.status !== 503 && res.status !== 504)) {
        return res;
      }
      
      // If server returned 502/503/504 (wake-up / transient) and we have retries left
      if (attempt < retries) {
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }
      return res;
    } catch (err) {
      if (attempt < retries) {
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }
      throw err;
    }
  }
}

export async function fetchProducts(searchParams?: { [key: string]: string | string[] | undefined }): Promise<ProductsResponse> {
  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}/api/products`);
  
  if (searchParams) {
    Object.keys(searchParams).forEach(key => {
      const value = searchParams[key];
      if (typeof value === 'string') {
        url.searchParams.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v));
      }
    });
  }

  const res = await fetchWithControlledRetry(url.toString(), { cache: 'no-store' });
  
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  return res.json();
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const baseUrl = getBaseUrl();
  const res = await fetchWithControlledRetry(`${baseUrl}/api/products/${id}`, { cache: 'no-store' });
  
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch product');
  }

  return res.json();
}

export async function fetchBlogs(): Promise<BlogPost[]> {
  const baseUrl = getBaseUrl();
  try {
    const res = await fetchWithControlledRetry(`${baseUrl}/api/blog`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Failed to fetch blogs:', err);
    return [];
  }
}

export async function fetchCategoriesMetadata(): Promise<any[]> {
  const baseUrl = getBaseUrl();
  try {
    const res = await fetchWithControlledRetry(`${baseUrl}/api/categories`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error('Failed to fetch category metadata:', err);
    return [];
  }
}
