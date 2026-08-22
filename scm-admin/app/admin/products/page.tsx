'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AlertCircle, AlertTriangle, Boxes, CheckCircle, Edit2, Flame, Loader2, PackageOpen, Plus, RefreshCw, Search, Sparkles, SquarePen, Trash2, Warehouse, X, XCircle } from 'lucide-react';

interface ProductVariant {
  weight: string;
  price: number;
  mrp: number;
  stock: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  variants: ProductVariant[];
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isActive?: boolean;
  ingredients?: string;
  fssaiNumber?: string;
  ratingAvg?: number;
  totalSold?: number;
  createdAt?: string;
}

const CATEGORIES = [
  'Chilli Powders',
  'Ground Spices',
  'Dry Fruits & Nuts',
  'Healthy Snacks',
  'Cooking Oils'
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Chilli Powders',
    images: [''],
    isFeatured: false,
    isBestseller: false,
    isNewArrival: false,
    isActive: true,
    ingredients: '',
    fssaiNumber: '',
    variants: [
      { weight: '100g', price: 60, mrp: 75, stock: 100 },
      { weight: '250g', price: 140, mrp: 175, stock: 50 },
      { weight: '500g', price: 260, mrp: 320, stock: 30 },
    ],
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/products', { cache: 'no-store' });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to fetch products');
      }
      const data = await res.json();
      const productList: Product[] = Array.isArray(data) ? data : data.products || [];
      setProducts(productList);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: 'Chilli Powders',
      images: [''],
      isFeatured: false,
      isBestseller: false,
      isNewArrival: false,
      isActive: true,
      ingredients: '',
      fssaiNumber: '',
      variants: [
        { weight: '100g', price: 60, mrp: 75, stock: 100 },
        { weight: '250g', price: 140, mrp: 175, stock: 50 },
      ],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      category: product?.category || 'Chilli Powders',
      images: product.images?.length ? [...product.images] : [''],
      isFeatured: !!product.isFeatured,
      isBestseller: !!product.isBestseller,
      isNewArrival: !!product.isNewArrival,
      isActive: product.isActive !== undefined ? product.isActive : true,
      ingredients: product.ingredients || '',
      fssaiNumber: product.fssaiNumber || '',
      variants: product.variants?.length
        ? product.variants.map((v) => ({ ...v }))
        : [{ weight: '100g', price: 0, mrp: 0, stock: 0 }],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: any) => {
    const newVariants = [...formData.variants];
    newVariants[index] = {
      ...newVariants[index],
      [field]: field === 'weight' ? value : Number(value) || 0,
    };
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { weight: '500g', price: 200, mrp: 250, stock: 50 }],
    });
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length <= 1) {
      showToast('A product must have at least one variant', 'error');
      return;
    }
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    });
  };

  const handleImageChange = (index: number, val: string) => {
    const newImages = [...formData.images];
    newImages[index] = val;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages.length ? newImages : [''] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Product name is required', 'error');
      return;
    }
    if (!formData.description.trim()) {
      showToast('Product description is required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const cleanImages = formData.images.map((img) => img.trim()).filter(Boolean);
      const payload = {
        ...formData,
        images: cleanImages,
      };

      if (editingProduct) {
        // Update product
        const res = await fetch(`/api/admin/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to update product');
        }
        const updated = await res.json();
        setProducts((prev) => prev.map((p) => (p._id === editingProduct._id ? updated : p)));
        showToast('Product updated successfully!', 'success');
      } else {
        // Create product
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to create product');
        }
        const created = await res.json();
        setProducts((prev) => [created, ...prev]);
        showToast('Product created successfully!', 'success');
      }

      closeModal();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleProductActive = async (product: Product) => {
    const newStatus = !product.isActive;
    try {
      const res = await fetch(`/api/admin/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update product status');
      setProducts((prev) =>
        prev.map((p) => (p._id === product._id ? { ...p, isActive: newStatus } : p))
      );
      showToast(`Product ${newStatus ? 'activated' : 'deactivated'} successfully`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  const openDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/products/${productToDelete._id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to delete product');
      }
      setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
      showToast('Product removed from catalog', 'success');
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to delete product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper functions for displaying price & stock
  const getProductPriceDisplay = (product: Product) => {
    if (!product.variants || product.variants.length === 0) return '₹0';
    const prices = product.variants.map((v) => v.price).filter((p) => typeof p === 'number');
    if (prices.length === 0) return '₹0';
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `₹${min}` : `₹${min} - ₹${max}`;
  };

  const getProductTotalStock = (product: Product) => {
    if (!product.variants || product.variants.length === 0) return 0;
    return product.variants.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0);
  };

  // Statistics Calculations
  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.isActive !== false).length;
    const totalStock = products.reduce((acc, p) => acc + getProductTotalStock(p), 0);
    const lowStock = products.filter((p) => {
      const st = getProductTotalStock(p);
      return st > 0 && st < 20;
    }).length;
    const outOfStock = products.filter((p) => getProductTotalStock(p) === 0).length;

    return { total, active, totalStock, lowStock, outOfStock };
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        (product.description && product.description.toLowerCase().includes(q));

      const matchesCategory =
        categoryFilter === 'All' || product.category === categoryFilter;

      const totalStock = getProductTotalStock(product);
      let matchesStock = true;
      if (stockFilter === 'In Stock') matchesStock = totalStock >= 20;
      else if (stockFilter === 'Low Stock') matchesStock = totalStock > 0 && totalStock < 20;
      else if (stockFilter === 'Out of Stock') matchesStock = totalStock === 0;

      let matchesStatus = true;
      if (statusFilter === 'Active') matchesStatus = product.isActive !== false;
      else if (statusFilter === 'Inactive') matchesStatus = product.isActive === false;

      return matchesSearch && matchesCategory && matchesStock && matchesStatus;
    });
  }, [products, searchQuery, categoryFilter, stockFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-2xl text-white font-medium flex items-center gap-3 transition-all duration-300 transform translate-y-0 ${
            toast.type === 'success' ? 'bg-brand-green' : 'bg-brand-red'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-brand-red/10 text-brand-red rounded-lg">
              <Boxes size={18} />
            </span>
            <h1 className="text-2xl font-bold text-charcoal font-display">Products Inventory</h1>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            Manage your authentic spice catalog, variants, pricing, and stock levels
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-charcoal transition-colors text-sm flex items-center gap-2"
            title="Refresh list"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span className="hidden md:inline">Refresh</span>
          </button>

          <button
            onClick={openCreateModal}
            className="btn-primary !py-2.5 !px-5 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-md bg-gradient-to-r from-brand-red to-saffron hover:opacity-95 transition-all"
          >
            <Plus size={16} />
            <span>Create Product</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200/70 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-saffron/10 text-saffron flex items-center justify-center text-xl shrink-0">
            <Flame size={16} />
          </div>
          <div>
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Products</div>
            <div className="text-2xl font-bold text-charcoal">{stats.total}</div>
            <div className="text-xs text-stone-400 mt-0.5">{stats.active} Active in store</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200/70 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center text-xl shrink-0">
            <Warehouse size={16} />
          </div>
          <div>
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Stock Units</div>
            <div className="text-2xl font-bold text-charcoal">{stats.totalStock.toLocaleString('en-IN')}</div>
            <div className="text-xs text-emerald-600 font-medium mt-0.5">Across all sizes</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200/70 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl shrink-0">
            <AlertTriangle size={16} />
          </div>
          <div>
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Low Stock (&lt;20)</div>
            <div className="text-2xl font-bold text-amber-600">{stats.lowStock}</div>
            <div className="text-xs text-stone-400 mt-0.5">Reorder recommended</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200/70 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center text-xl shrink-0">
            <XCircle size={16} />
          </div>
          <div>
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Out of Stock</div>
            <div className="text-2xl font-bold text-brand-red">{stats.outOfStock}</div>
            <div className="text-xs text-stone-400 mt-0.5">Need immediate restock</div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search products by title, category, or spices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40 focus:border-saffron transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
            >
              <XCircle size={16} />
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 focus:outline-none focus:border-saffron cursor-pointer"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Stock filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 focus:outline-none focus:border-saffron cursor-pointer"
          >
            <option value="All">All Stock Levels</option>
            <option value="In Stock">In Stock (20+)</option>
            <option value="Low Stock">Low Stock (&lt;20)</option>
            <option value="Out of Stock">Out of Stock (0)</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 focus:outline-none focus:border-saffron cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-red"></div>
            <p className="text-sm text-stone-500 font-medium">Loading masala catalog...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 text-brand-red mx-auto flex items-center justify-center text-xl mb-3">
              <AlertTriangle size={16} />
            </div>
            <h3 className="text-lg font-bold text-charcoal mb-1">Failed to load products</h3>
            <p className="text-sm text-stone-500 mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-4 py-2 bg-brand-red text-white text-sm rounded-lg hover:bg-brand-red/90 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-saffron/10 text-saffron mx-auto flex items-center justify-center text-2xl mb-4">
              <PackageOpen size={16} />
            </div>
            <h3 className="text-lg font-bold text-charcoal mb-1">No products found</h3>
            <p className="text-sm text-stone-500 max-w-md mx-auto mb-6">
              {searchQuery || categoryFilter !== 'All' || stockFilter !== 'All'
                ? 'Try adjusting your filters or search keywords to find products.'
                : 'Get started by creating your first Sunil Choudhary Masala product.'}
            </p>
            <button
              onClick={openCreateModal}
              className="btn-primary !py-2.5 !px-6 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Add First Product</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-[12px] uppercase tracking-wider text-stone-500 font-semibold">
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price Range</th>
                  <th className="py-4 px-4">Stock Status</th>
                  <th className="py-4 px-4 text-center">Badges</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {filteredProducts.map((product) => {
                  const totalStock = getProductTotalStock(product);
                  const firstImage = product.images?.[0];
                  const isOut = totalStock === 0;
                  const isLow = totalStock > 0 && totalStock < 20;

                  return (
                    <tr
                      key={product._id}
                      className="hover:bg-amber-50/30 transition-colors duration-150 group"
                    >
                      {/* Image & Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-cream border border-stone-200 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                            {firstImage ? (
                              <img
                                src={firstImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // fallback on broken image
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <Sparkles size={18} className="text-saffron" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-charcoal group-hover:text-brand-red transition-colors truncate max-w-[220px]">
                              {product.name}
                            </div>
                            <div className="text-xs text-stone-500 truncate max-w-[220px]">
                              {product.variants?.length
                                ? `${product.variants.length} size variant${
                                    product.variants.length > 1 ? 's' : ''
                                  } (${product.variants.map((v) => v.weight).join(', ')})`
                                : 'No variants set'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200/80">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-charcoal">
                          {getProductPriceDisplay(product)}
                        </div>
                        {product.variants?.[0]?.mrp > product.variants?.[0]?.price && (
                          <div className="text-xs text-stone-400 line-through">
                            MRP: ₹{product.variants[0].mrp}
                          </div>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              isOut
                                ? 'bg-red-100 text-red-700 border border-red-200'
                                : isLow
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isOut ? 'bg-red-600' : isLow ? 'bg-amber-600' : 'bg-emerald-600'
                              }`}
                            ></span>
                            {isOut
                              ? 'Out of Stock'
                              : isLow
                              ? `Low (${totalStock})`
                              : `${totalStock} in stock`}
                          </span>
                        </div>
                      </td>

                      {/* Badges */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {product.isBestseller && (
                            <span
                              className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300"
                              title="Bestseller"
                            >
                              Best
                            </span>
                          )}
                          {product.isFeatured && (
                            <span
                              className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-300"
                              title="Featured"
                            >
                              Feat
                            </span>
                          )}
                          {!product.isBestseller && !product.isFeatured && (
                            <span className="text-stone-300 text-xs">—</span>
                          )}
                        </div>
                      </td>

                      {/* Active Status */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => toggleProductActive(product)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            product.isActive !== false ? 'bg-brand-green' : 'bg-stone-300'
                          }`}
                          title={`Click to ${product.isActive !== false ? 'Deactivate' : 'Activate'}`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              product.isActive !== false ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 rounded-lg text-stone-600 hover:text-brand-red hover:bg-brand-red/10 transition-colors"
                            title="Edit product"
                          >
                            <SquarePen size={16} />
                          </button>

                          <button
                            onClick={() => openDeleteModal(product)}
                            className="p-2 rounded-lg text-stone-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-red flex items-center justify-center text-white text-sm">
                  {editingProduct ? <Edit2 size={14} /> : <Plus size={14} />}
                </div>
                <div>
                  <h3 className="font-bold text-lg font-display">
                    {editingProduct ? 'Edit Masala Product' : 'Add New Masala Product'}
                  </h3>
                  <p className="text-xs text-stone-400">
                    Fill in the details below to update your inventory catalog
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Product Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider">
                    Product Title <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pure Rajasthani Mathania Lal Mirch"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider">
                    Category <span className="text-brand-red">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red outline-none bg-white cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider">
                  Description <span className="text-brand-red">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed description of aroma, processing, pungency and authenticity..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red outline-none"
                />
              </div>

              {/* Ingredients & FSSAI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
                    Ingredients (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Handpicked Sun-Dried Red Chillies"
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
                    FSSAI License No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12224026000189"
                    value={formData.fssaiNumber}
                    onChange={(e) => setFormData({ ...formData, fssaiNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red outline-none"
                  />
                </div>
              </div>

              {/* Variants Section */}
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-charcoal uppercase tracking-wider">
                      Size &amp; Pricing Variants
                    </h4>
                    <p className="text-xs text-stone-500">
                      Add different package sizes (e.g. 100g, 250g, 500g, 1kg)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="px-3 py-1.5 bg-saffron text-white rounded-lg text-xs font-bold hover:bg-saffron/90 transition-colors flex items-center gap-1.5"
                  >
                    <Plus size={16} /> Add Size
                  </button>
                </div>

                <div className="space-y-2.5">
                  {formData.variants.map((variant, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 bg-white p-3 rounded-lg border border-stone-200 items-center"
                    >
                      <div className="col-span-3">
                        <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                          Weight / Pack
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 250g"
                          value={variant.weight}
                          onChange={(e) => handleVariantChange(idx, 'weight', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-stone-300 rounded text-xs focus:ring-1 focus:ring-brand-red outline-none"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                          Selling Price (₹)
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={variant.price}
                          onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-stone-300 rounded text-xs focus:ring-1 focus:ring-brand-red outline-none"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                          MRP (₹)
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={variant.mrp}
                          onChange={(e) => handleVariantChange(idx, 'mrp', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-stone-300 rounded text-xs focus:ring-1 focus:ring-brand-red outline-none"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                          Stock Qty
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={variant.stock}
                          onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-stone-300 rounded text-xs focus:ring-1 focus:ring-brand-red outline-none"
                        />
                      </div>

                      <div className="col-span-1 text-right pt-4">
                        <button
                          type="button"
                          onClick={() => removeVariant(idx)}
                          className="text-stone-400 hover:text-red-600 transition-colors p-1"
                          title="Remove variant"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Images */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider">
                    Product Image URLs
                  </label>
                  <button
                    type="button"
                    onClick={addImageField}
                    className="text-xs font-semibold text-saffron hover:underline"
                  >
                    + Add another image URL
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.images.map((imgUrl, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="https://example.com/masala-image.jpg or /images/..."
                        value={imgUrl}
                        onChange={(e) => handleImageChange(idx, e.target.value)}
                        className="flex-1 px-3.5 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red outline-none"
                      />
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(idx)}
                          className="p-2 text-stone-400 hover:text-red-500"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Flags / Checkboxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <label className="flex items-center gap-2 p-3 bg-stone-50 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-brand-green rounded focus:ring-brand-green"
                  />
                  <span className="text-xs font-semibold text-charcoal">Active in Store</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-stone-50 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                  />
                  <span className="text-xs font-semibold text-charcoal">Bestseller</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-stone-50 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-xs font-semibold text-charcoal">Featured</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-stone-50 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-charcoal">New Arrival</span>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="px-5 py-2.5 border border-stone-300 text-stone-600 hover:bg-stone-50 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary !py-2.5 !px-6 rounded-xl text-sm font-semibold shadow-md bg-gradient-to-r from-brand-red to-saffron flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-stone-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-100 text-brand-red mx-auto flex items-center justify-center text-2xl">
              <Trash2 size={16} />
            </div>
            <h3 className="text-lg font-bold text-charcoal font-display">Delete Product?</h3>
            <p className="text-sm text-stone-500">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-charcoal">"{productToDelete.name}"</span>? This
              action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={submitting}
                className="px-5 py-2.5 border border-stone-300 rounded-xl text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={submitting}
                className="px-5 py-2.5 bg-brand-red hover:bg-brand-red-dark text-white rounded-xl text-sm font-semibold shadow-md transition-colors flex items-center gap-2"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                <span>Delete Product</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
