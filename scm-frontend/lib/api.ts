import { ProductsResponse, Product, BlogPost } from '@/types';
import { getBackendUrl } from '@/lib/apiConfig';

const getBaseUrl = getBackendUrl;

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

export async function fetchBlogs(): Promise<BlogPost[]> {
  const baseUrl = getBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/blog`, { next: { revalidate: 60 } });
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
    const res = await fetch(`${baseUrl}/api/categories`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error('Failed to fetch category metadata:', err);
    return [];
  }
}
