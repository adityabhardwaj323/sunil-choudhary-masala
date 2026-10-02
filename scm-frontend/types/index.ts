export interface ProductVariant {
  _id?: string;
  weight: string;
  price: number;
  mrp: number;
  stock: number;
}

export interface NutritionInfo {
  energy?: string;
  protein?: string;
  fat?: string;
  carbs?: string;
  fibre?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: 'Chilli Powders' | 'Ground Spices' | 'Dry Fruits & Nuts' | 'Healthy Snacks' | 'Cooking Oils' | string;
  images: string[];
  variants: ProductVariant[];
  batchDate?: string;
  bestBefore?: string;
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  ratingAvg: number;
  ratingCount: number;
  totalSold: number;
  ingredients?: string;
  nutritionInfo?: NutritionInfo;
  fssaiNumber?: string;
  highlights?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  count: number;
  products: Product[];
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category?: string;
  featuredImageUrl?: string;
  publishedAt?: string;
  createdAt?: string;
  status?: string;
}
