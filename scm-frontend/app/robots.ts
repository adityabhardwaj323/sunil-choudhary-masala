import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sunilchoudharymasala.com';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/shop', '/product/*', '/about', '/contact'],
      disallow: [
        '/login',
        '/register',
        '/account/',
        '/checkout',
        '/admin/',
        '/forgot-password',
        '/api/'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
