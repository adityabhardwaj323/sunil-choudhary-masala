import { Product } from '@/types';

// Authoritative base categories supported in SCM (from Product model enum and Shop CategoryTabs)
export const BASE_CATEGORIES: string[] = [
  'Chilli Powders',
  'Ground Spices',
  'Dry Fruits & Nuts',
  'Healthy Snacks',
  'Cooking Oils',
  'Combos',
];

export interface CategoryItem {
  name: string;
  slug: string;
  link: string;
  image?: string;
  desc: string;
  iconName: string;
  gradient: string;
  productCount: number;
}

export const CATEGORY_METADATA: Record<string, { desc: string; gradient: string; iconName: string }> = {
  'Chilli Powders': {
    desc: 'Vibrant color, authentic heat',
    gradient: 'from-[#4a1a08] to-[#8B3000]',
    iconName: 'Flame',
  },
  'Ground Spices': {
    desc: 'Essential everyday spices',
    gradient: 'from-[#4a3508] to-[#8B6500]',
    iconName: 'Sparkles',
  },
  'Dry Fruits & Nuts': {
    desc: 'Premium quality selection',
    gradient: 'from-[#1a0a4a] to-[#3d1a8B]',
    iconName: 'Nut',
  },
  'Healthy Snacks': {
    desc: 'Delicious and nutritious',
    gradient: 'from-[#1a4a08] to-[#2d7a14]',
    iconName: 'Cookie',
  },
  'Cooking Oils': {
    desc: 'Pure and traditional',
    gradient: 'from-[#4a0a0a] to-[#8B1414]',
    iconName: 'Droplets',
  },
  'Combos': {
    desc: 'Curated value bundles',
    gradient: 'from-[#381a4a] to-[#6b2168]',
    iconName: 'Package',
  },
};

/**
 * Returns all valid customer-facing categories dynamically merged from
 * baseline configuration and any active products in the system.
 */
export function getCategoriesFromProducts(products: Product[] = [], categoryMetadata: any[] = []): CategoryItem[] {
  // Deduplicate and combine base categories with any newly added product categories
  const categoryNamesSet = new Set<string>(BASE_CATEGORIES);

  // Add categories from products
  if (Array.isArray(products)) {
    products.forEach((p) => {
      if (p.category && typeof p.category === 'string' && p.category.trim()) {
        categoryNamesSet.add(p.category.trim());
      }
    });
  }

  // Add active categories from metadata
  if (Array.isArray(categoryMetadata)) {
    categoryMetadata.forEach((meta) => {
      if (meta.name && meta.isActive) {
        categoryNamesSet.add(meta.name.trim());
      }
    });
  }

  const allCategoryNames = Array.from(categoryNamesSet);

  const categories = allCategoryNames.map((name) => {
    const matchingProducts = Array.isArray(products)
      ? products.filter((p) => p.category?.toLowerCase() === name.toLowerCase())
      : [];

    const fallbackMeta = CATEGORY_METADATA[name] || {
      desc: 'Explore authentic collection',
      gradient: 'from-[#3a2010] to-[#703010]',
      iconName: 'Sparkles',
    };
    
    // Find metadata
    const modelMeta = categoryMetadata.find((c) => c.name.toLowerCase() === name.toLowerCase());
    
    // If metadata says inactive, we filter it out later
    const isActive = modelMeta ? (modelMeta.isActive !== false) : true;
    const displayOrder = modelMeta ? (modelMeta.displayOrder || 0) : 0;
    
    let finalImage = undefined;
    if (modelMeta && modelMeta.image && modelMeta.image.url) {
      finalImage = modelMeta.image.url;
    } else {
      // Fallback to the old method: grabbing the first product image
      const productWithImage = matchingProducts.find((p) => p.images && p.images.length > 0 && p.images[0]);
      if (productWithImage) {
        finalImage = productWithImage.images[0];
      }
    }

    return {
      name,
      slug: modelMeta && modelMeta.slug ? modelMeta.slug : encodeURIComponent(name),
      link: `/shop?category=${encodeURIComponent(name)}`,
      image: finalImage,
      desc: modelMeta && modelMeta.description ? modelMeta.description : fallbackMeta.desc,
      iconName: fallbackMeta.iconName,
      gradient: fallbackMeta.gradient,
      productCount: matchingProducts.length,
      isActive,
      displayOrder,
    };
  });

  // Filter out inactive categories and sort by display order
  return categories
    .filter((c) => c.isActive)
    .sort((a, b) => {
      if (a.displayOrder !== b.displayOrder) {
        return a.displayOrder - b.displayOrder;
      }
      return a.name.localeCompare(b.name);
    });
}
