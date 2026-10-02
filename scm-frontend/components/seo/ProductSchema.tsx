import React from 'react';

export default function ProductSchema({ product }: { product: any }) {
  const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
  const price = firstVariant ? firstVariant.price : 0;
  
  // Conditionally include reviews if they genuinely exist
  const aggregateRating = product.ratingCount > 0 ? {
    "@type": "AggregateRating",
    "ratingValue": product.ratingAvg,
    "reviewCount": product.ratingCount
  } : undefined;

  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images || [],
    "description": product.description,
    "sku": product._id,
    "offers": {
      "@type": "Offer",
      "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sunilchoudharymasala.com'}/product/${product._id}`,
      "priceCurrency": "INR",
      "price": price,
      "availability": firstVariant && firstVariant.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    ...(aggregateRating && { aggregateRating })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
