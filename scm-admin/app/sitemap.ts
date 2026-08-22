import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sunilchoudharymasala.com';
  
  const staticPages = [
    '', '/shop', '/about', '/heritage', '/quality-standards', '/manufacturing',
    '/gallery', '/distributor', '/retail-partner', '/creator-program', '/catalogue',
    '/faq', '/contact', '/privacy', '/terms', '/shipping', '/returns', '/cancellation', '/cookies'
  ];

  const sitemapData: MetadataRoute.Sitemap = staticPages.map(page => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === '' || page === '/shop' ? 'weekly' : 'monthly',
    priority: page === '' ? 1 : page === '/shop' ? 0.9 : 0.5,
  }));

  try {
    // In a real scenario, you'd fetch all active products from DB to build URLs
    // For now we'll rely on static pages
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return sitemapData;
}
