'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, Check, CheckCircle, Clock, Copy, Info, Plus, RotateCw, Search, Tag, Ticket, Trash2, Users, X } from 'lucide-react';

interface Coupon {
  _id: string;
  code: string;
  discountPercent: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  expiryDate: string;
  isActive: boolean;
  usageLimit?: number | null;
  usedCount?: number;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number | ''>(10);
  const [minOrderValue, setMinOrderValue] = useState<number | ''>(0);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number | ''>('');
  const [expiryDate, setExpiryDate] = useState('');
  const [usageLimit, setUsageLimit] = useState<number | ''>('');
  const [isActive, setIsActive] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Expired' | 'Inactive'>('All');

  // Deletion state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/coupons', { cache: 'no-store' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to fetch coupons');
      }
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unable to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();

    // Default expiry date: 30 days from now
    const d = new Date();
    d.setDate(d.getDate() + 30);
    setExpiryDate(d.toISOString().split('T')[0]);
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setFormError('Please provide a coupon code');
      return;
    }
    if (!discountPercent || Number(discountPercent) <= 0 || Number(discountPercent) > 100) {
      setFormError('Discount percentage must be between 1 and 100%');
      return;
    }
    if (!expiryDate) {
      setFormError('Please specify an expiry date');
      return;
    }

    setCreating(true);
    setFormError(null);

    try {
      const payload: any = {
        code: code.trim().toUpperCase(),
        discountPercent: Number(discountPercent),
        minOrderValue: minOrderValue === '' ? 0 : Number(minOrderValue),
        expiryDate: new Date(expiryDate).toISOString(),
        isActive,
      };

      if (maxDiscountAmount !== '') {
        payload.maxDiscountAmount = Number(maxDiscountAmount);
      }
      if (usageLimit !== '') {
        payload.usageLimit = Number(usageLimit);
      }

      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || 'Failed to create coupon');
      }

      showToast(`Coupon "${payload.code}" created successfully!`, 'success');
      // Reset form
      setCode('');
      setDiscountPercent(10);
      setMinOrderValue(0);
      setMaxDiscountAmount('');
      setUsageLimit('');
      setIsActive(true);
      setShowCreateModal(false);
      fetchCoupons();
    } catch (err: any) {
      setFormError(err.message || 'Could not save coupon');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCoupon = async (id: string, codeName: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete coupon');
      }
      setCoupons(prev => prev.filter(c => c._id !== id));
      showToast(`Coupon "${codeName}" deleted successfully`, 'success');
      setDeleteConfirmId(null);
    } catch (err: any) {
      showToast(err.message || 'Error deleting coupon', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied "${text}" to clipboard!`, 'info');
  };

  // Filter calculations
  const now = new Date();
  const filteredCoupons = coupons.filter(c => {
    const isExpired = new Date(c.expiryDate) < now;
    
    // Status match
    if (statusFilter === 'Active' && (!c.isActive || isExpired)) return false;
    if (statusFilter === 'Expired' && !isExpired) return false;
    if (statusFilter === 'Inactive' && (c.isActive && !isExpired)) return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return c.code.toLowerCase().includes(q);
    }
    return true;
  });

  const activeCount = coupons.filter(c => c.isActive && new Date(c.expiryDate) >= now).length;
  const expiredCount = coupons.filter(c => new Date(c.expiryDate) < now).length;
  const totalUsed = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl font-medium text-white shadow-2xl flex items-center gap-3 transition-all ${
            toast.type === 'success' ? 'bg-brand-green' : toast.type === 'error' ? 'bg-brand-red' : 'bg-saffron'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle size={18} />
          ) : toast.type === 'error' ? (
            <AlertCircle size={18} />
          ) : (
            <Info size={18} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-saffron/10 text-saffron flex items-center justify-center">
              <Tag size={16} />
            </span>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal">
              Coupons &amp; Discounts
            </h1>
          </div>
          <p className="text-sm text-brown mt-1">
            Create promotional discount vouchers, set minimum order values, and limit usage.
          </p>
        </div>

        <button
          onClick={() => {
            setFormError(null);
            setShowCreateModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md active:scale-95 shrink-0"
        >
          <Plus size={16} /> Create New Coupon
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-cream-mid/60 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-brown uppercase tracking-wider">Total Coupons</div>
            <div className="text-2xl font-bold text-charcoal mt-1">{coupons.length}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-cream-dark flex items-center justify-center text-charcoal">
            <Ticket size={16} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-cream-mid/60 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-brown uppercase tracking-wider">Active Coupons</div>
            <div className="text-2xl font-bold text-brand-green mt-1">{activeCount}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
            <Check size={16} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-cream-mid/60 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-brown uppercase tracking-wider">Expired</div>
            <div className="text-2xl font-bold text-brand-red mt-1">{expiredCount}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red">
            <Clock size={16} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-cream-mid/60 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-brown uppercase tracking-wider">Total Redemptions</div>
            <div className="text-2xl font-bold text-saffron mt-1">{totalUsed}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center text-saffron">
            <Users size={16} />
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Status Filters */}
      <div className="bg-white p-4 rounded-xl border border-cream-mid/60 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {(['All', 'Active', 'Expired', 'Inactive'] as const).map(tab => {
            const isActiveTab = statusFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActiveTab
                    ? 'bg-charcoal text-white shadow-sm'
                    : 'bg-cream-dark/60 text-charcoal hover:bg-cream-mid/50'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Search Box */}
        <div className="relative min-w-[240px]">
          <Search size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown" />
          <input
            type="text"
            placeholder="Search coupon code..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-sm bg-gray-50 border border-cream-mid rounded-lg focus:outline-none focus:border-saffron focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Main Coupons Table Card */}
      <div className="bg-white rounded-xl border border-cream-mid/60 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-brown">
            <div className="w-10 h-10 border-4 border-cream-mid border-t-saffron rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm font-medium">Loading promotional coupons...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-brand-red">
            <AlertCircle size={30} className="mb-2" />
            <p className="font-semibold">{error}</p>
            <button
              onClick={fetchCoupons}
              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-saffron hover:underline"
            >
              <RotateCw size={16} /> Try Again
            </button>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-cream-dark flex items-center justify-center text-brown text-2xl mx-auto mb-3">
              <Tag size={16} />
            </div>
            <h3 className="font-display font-semibold text-lg text-charcoal">No Coupons Found</h3>
            <p className="text-sm text-brown mt-1 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'All'
                ? 'No coupons match your filter criteria. Try resetting the filters.'
                : 'Create your first promotional discount coupon to boost customer orders.'}
            </p>
            {!searchQuery && statusFilter === 'All' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 bg-brand-red text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-brand-red-dark transition-colors"
              >
                + Create Coupon
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream/70 border-b border-cream-mid/60 text-xs font-bold text-brown uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Code</th>
                  <th className="px-5 py-3.5">Discount</th>
                  <th className="px-5 py-3.5">Min Order</th>
                  <th className="px-5 py-3.5">Usage</th>
                  <th className="px-5 py-3.5">Expiry Date</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark/60">
                {filteredCoupons.map(coupon => {
                  const isExpired = new Date(coupon.expiryDate) < now;
                  const formattedExpiry = new Date(coupon.expiryDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <tr key={coupon._id} className="hover:bg-cream/30 transition-colors">
                      {/* Code */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm bg-cream-dark px-2.5 py-1 rounded-md text-charcoal border border-cream-mid">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => copyToClipboard(coupon.code)}
                            title="Copy code"
                            className="text-gray-400 hover:text-saffron transition-colors p-1"
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                      </td>

                      {/* Discount */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-brand-red text-base">
                          {coupon.discountPercent}% OFF
                        </div>
                        {coupon.maxDiscountAmount ? (
                          <div className="text-[11px] text-brown font-medium">
                            Up to ₹{coupon.maxDiscountAmount}
                          </div>
                        ) : (
                          <div className="text-[11px] text-gray-400">No max cap</div>
                        )}
                      </td>

                      {/* Min Order Value */}
                      <td className="px-5 py-4">
                        {coupon.minOrderValue && coupon.minOrderValue > 0 ? (
                          <span className="font-medium text-charcoal">₹{coupon.minOrderValue}</span>
                        ) : (
                          <span className="text-gray-400 text-xs italic">No minimum</span>
                        )}
                      </td>

                      {/* Usage */}
                      <td className="px-5 py-4">
                        <div className="text-xs font-semibold text-charcoal">
                          {coupon.usedCount || 0}
                          {coupon.usageLimit ? ` / ${coupon.usageLimit} uses` : ' uses'}
                        </div>
                        {coupon.usageLimit && (
                          <div className="w-24 bg-gray-200 h-1.5 rounded-full overflow-hidden mt-1.5">
                            <div
                              className="bg-saffron h-full rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  ((coupon.usedCount || 0) / coupon.usageLimit) * 100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        )}
                      </td>

                      {/* Expiry Date */}
                      <td className="px-5 py-4">
                        <div className="text-xs text-charcoal font-medium">{formattedExpiry}</div>
                        {isExpired ? (
                          <span className="text-[10px] text-brand-red font-semibold uppercase tracking-wider">
                            Expired
                          </span>
                        ) : (
                          <span className="text-[10px] text-brand-green font-medium">
                            Valid
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {isExpired ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-brand-red/10 text-brand-red">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
                            Expired
                          </span>
                        ) : coupon.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-brand-green/10 text-brand-green">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        {deleteConfirmId === coupon._id ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleDeleteCoupon(coupon._id, coupon.code)}
                              disabled={deletingId === coupon._id}
                              className="bg-brand-red hover:bg-brand-red-dark text-white px-2.5 py-1 rounded text-xs font-semibold transition-colors disabled:opacity-50"
                            >
                              {deletingId === coupon._id ? 'Deleting...' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="bg-gray-200 hover:bg-gray-300 text-charcoal px-2.5 py-1 rounded text-xs font-semibold transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(coupon._id)}
                            className="text-gray-400 hover:text-brand-red p-2 rounded-lg hover:bg-brand-red/10 transition-colors"
                            title="Delete Coupon"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-cream-mid my-8">
            <div className="flex items-center justify-between pb-4 border-b border-cream-dark">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-saffron/10 text-saffron flex items-center justify-center font-bold">
                  <Tag size={16} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-charcoal">Create New Coupon</h2>
                  <p className="text-xs text-brown">Define promo rules, discount caps, and expiry date.</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-charcoal p-1 text-lg"
              >
                <X size={16} />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 bg-brand-red/10 text-brand-red text-xs font-semibold rounded-lg flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            {/* Live Preview of Coupon Chip */}
            <div className="my-5 p-4 rounded-xl bg-gradient-to-r from-cream to-cream-dark border border-cream-mid flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-brown tracking-wider">Preview</span>
                <div className="font-mono font-bold text-lg text-charcoal tracking-wide">
                  {code.trim() ? code.trim().toUpperCase() : 'CODE_PREVIEW'}
                </div>
                <div className="text-xs text-brand-red font-bold mt-0.5">
                  {discountPercent ? `${discountPercent}% OFF` : '0% OFF'}
                  {maxDiscountAmount ? ` (Max ₹${maxDiscountAmount})` : ''}
                </div>
              </div>
              <div className="text-right text-xs text-brown">
                <div>Min: ₹{minOrderValue || 0}</div>
                <div className="text-[11px] text-gray-500">Exp: {expiryDate || 'N/A'}</div>
              </div>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              {/* Row 1: Code & Discount % */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PEHLADABBA"
                    value={code}
                    onChange={e => setCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-cream-mid rounded-lg font-mono uppercase focus:outline-none focus:border-saffron"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                    Discount Percentage (%) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={1}
                      max={100}
                      placeholder="e.g. 15"
                      value={discountPercent}
                      onChange={e => setDiscountPercent(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-cream-mid rounded-lg focus:outline-none focus:border-saffron"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-brown">%</span>
                  </div>
                </div>
              </div>

              {/* Row 2: Min Order Value & Max Discount Cap */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                    Min Order Value (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-brown">₹</span>
                    <input
                      type="number"
                      min={0}
                      placeholder="0 (No minimum)"
                      value={minOrderValue}
                      onChange={e => setMinOrderValue(e.target.value ? Number(e.target.value) : '')}
                      className="w-full pl-8 pr-3.5 py-2 text-sm bg-white border border-cream-mid rounded-lg focus:outline-none focus:border-saffron"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                    Max Discount Cap (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-brown">₹</span>
                    <input
                      type="number"
                      min={1}
                      placeholder="Optional cap (e.g. 200)"
                      value={maxDiscountAmount}
                      onChange={e => setMaxDiscountAmount(e.target.value ? Number(e.target.value) : '')}
                      className="w-full pl-8 pr-3.5 py-2 text-sm bg-white border border-cream-mid rounded-lg focus:outline-none focus:border-saffron"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Expiry Date & Usage Limit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-cream-mid rounded-lg focus:outline-none focus:border-saffron"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                    Usage Limit (Count)
                  </label>
                  <input
                    type="number"
                    min={1}
                    placeholder="Unlimited if left blank"
                    value={usageLimit}
                    onChange={e => setUsageLimit(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-cream-mid rounded-lg focus:outline-none focus:border-saffron"
                  />
                </div>
              </div>

              {/* Checkbox: Active status */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-red focus:ring-brand-red accent-brand-red"
                  />
                  <span className="text-sm font-medium text-charcoal">
                    Activate coupon immediately upon creation
                  </span>
                </label>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-cream-dark">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-brown hover:text-charcoal bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-brand-red hover:bg-brand-red-dark text-white rounded-lg text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
                >
                  {creating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Save &amp; Publish Coupon</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
