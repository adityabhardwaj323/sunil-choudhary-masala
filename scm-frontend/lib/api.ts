import { ProductsResponse, Product } from '@/types';

// Use API_BASE_URL for server-side fetching, fallback to NEXT_PUBLIC_API_URL or localhost
const getBaseUrl = () => {
  return process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
};

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

  const res = await fetch(url.toString(), { cache: 'no-store' });
  
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  return res.json();
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/products/${id}`, { cache: 'no-store' });
  
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch product');
  }

  return res.json();
}
