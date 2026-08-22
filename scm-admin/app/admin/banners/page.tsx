'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AlertCircle, CheckCircle, Edit2, Eye, EyeOff, ImageIcon, Images, Info, Plus, RotateCw, Save, Sparkles, ToggleLeft, ToggleRight, Trash2, UploadCloud, X, ZoomIn } from 'lucide-react';

interface Banner {
  _id: string;
  title: string;
  imageUrl: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

const SAMPLE_PRESETS = [
  {
    label: 'Traditional Spice Spread',
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Pure Turmeric & Chilis',
    url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Authentic Rajasthani Masala',
    url: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Stone-Ground Spices Heritage',
    url: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create Form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [order, setOrder] = useState<number | ''>(0);
  const [isActive, setIsActive] = useState(true);

  // Edit State
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editOrder, setEditOrder] = useState<number>(0);
  const [editIsActive, setEditIsActive] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Preview Modal
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/banners', { cache: 'no-store' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to fetch banners');
      }
      const data = await res.json();
      setBanners(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Could not load banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please enter a banner title');
      return;
    }
    if (!imageUrl.trim()) {
      setFormError('Please provide an image URL');
      return;
    }

    setCreating(true);
    setFormError(null);

    try {
      const payload = {
        title: title.trim(),
        imageUrl: imageUrl.trim(),
        order: order === '' ? 0 : Number(order),
        isActive,
      };

      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || 'Failed to create banner');
      }

      showToast(`Banner "${payload.title}" created successfully!`, 'success');
      setTitle('');
      setImageUrl('');
      setOrder(0);
      setIsActive(true);
      setShowCreateModal(false);
      fetchBanners();
    } catch (err: any) {
      setFormError(err.message || 'Could not save banner');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      const updatedStatus = !banner.isActive;
      const res = await fetch(`/api/admin/banners/${banner._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: updatedStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      setBanners(prev =>
        prev.map(b => (b._id === banner._id ? { ...b, isActive: updatedStatus } : b))
      );
      showToast(`Banner is now ${updatedStatus ? 'Active' : 'Inactive'}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Error updating banner', 'error');
    }
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setEditTitle(banner.title);
    setEditImageUrl(banner.imageUrl);
    setEditOrder(banner.order || 0);
    setEditIsActive(banner.isActive);
  };

  const handleUpdateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;

    setUpdating(true);
    try {
      const payload = {
        title: editTitle.trim(),
        imageUrl: editImageUrl.trim(),
        order: Number(editOrder),
        isActive: editIsActive,
      };

      const res = await fetch(`/api/admin/banners/${editingBanner._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || 'Failed to update banner');
      }

      setBanners(prev =>
        prev.map(b => (b._id === editingBanner._id ? { ...b, ...payload } : b))
      );
      showToast('Banner updated successfully!', 'success');
      setEditingBanner(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to update banner', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteBanner = async (id: string, bannerTitle: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete banner');
      }
      setBanners(prev => prev.filter(b => b._id !== id));
      showToast(`Banner "${bannerTitle}" deleted`, 'success');
      setDeleteConfirmId(null);
    } catch (err: any) {
      showToast(err.message || 'Error deleting banner', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const activeCount = banners.filter(b => b.isActive).length;

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
              <Images size={16} />
            </span>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal">
              Promotional Banners
            </h1>
          </div>
          <p className="text-sm text-brown mt-1">
            Manage storefront hero carousel slides, festive banners, and promotional campaigns.
          </p>
        </div>

        <button
          onClick={() => {
            setFormError(null);
            setShowCreateModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md active:scale-95 shrink-0"
        >
          <Plus size={16} /> Upload New Banner
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-cream-mid/60 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-brown uppercase tracking-wider">Total Banners</div>
            <div className="text-2xl font-bold text-charcoal mt-1">{banners.length}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-cream-dark flex items-center justify-center text-charcoal">
            <ImageIcon size={16} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-cream-mid/60 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-brown uppercase tracking-wider">Live &amp; Active</div>
            <div className="text-2xl font-bold text-brand-green mt-1">{activeCount}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
            <Eye size={16} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-cream-mid/60 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-brown uppercase tracking-wider">Hidden / Inactive</div>
            <div className="text-2xl font-bold text-gray-500 mt-1">{banners.length - activeCount}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <EyeOff size={16} />
          </div>
        </div>
      </div>

      {/* Banners Grid Display */}
      {loading ? (
        <div className="bg-white p-12 rounded-xl border border-cream-mid/60 text-center text-brown shadow-sm">
          <div className="w-10 h-10 border-4 border-cream-mid border-t-saffron rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium">Loading storefront banners...</p>
        </div>
      ) : error ? (
        <div className="bg-white p-8 rounded-xl border border-brand-red/20 text-center text-brand-red shadow-sm">
          <AlertCircle size={30} className="mb-2" />
          <p className="font-semibold">{error}</p>
          <button
            onClick={fetchBanners}
            className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-saffron hover:underline"
          >
            <RotateCw size={16} /> Try Again
          </button>
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-cream-mid/60 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-cream-dark flex items-center justify-center text-brown text-2xl mx-auto mb-3">
            <Images size={16} />
          </div>
          <h3 className="font-display font-semibold text-lg text-charcoal">No Banners Configured</h3>
          <p className="text-sm text-brown mt-1 max-w-sm mx-auto">
            Upload your first hero banner to highlight seasonal discounts and pure Rajasthani spices.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 bg-brand-red text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-brand-red-dark transition-colors"
          >
            + Upload Banner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map(banner => (
            <div
              key={banner._id}
              className="bg-white rounded-xl border border-cream-mid/60 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group"
            >
              {/* Image Preview Container */}
              <div className="relative h-48 w-full bg-cream-dark overflow-hidden">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={e => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80';
                  }}
                />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-charcoal/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                    Order #{banner.order || 0}
                  </span>
                  {banner.isActive ? (
                    <span className="bg-brand-green/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      Active
                    </span>
                  ) : (
                    <span className="bg-gray-700/90 backdrop-blur-md text-gray-200 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                      Hidden
                    </span>
                  )}
                </div>

                {/* Quick zoom button */}
                <button
                  onClick={() => setPreviewImage(banner.imageUrl)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md text-charcoal hover:bg-white flex items-center justify-center text-xs shadow-sm transition-transform hover:scale-110"
                  title="View full image"
                >
                  <ZoomIn size={16} />
                </button>
              </div>

              {/* Banner Details Body */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-base text-charcoal leading-snug">
                    {banner.title}
                  </h3>
                  <div className="text-xs text-brown font-mono truncate mt-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                    {banner.imageUrl}
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center justify-between pt-3 border-t border-cream-dark">
                  {/* Status Toggle Button */}
                  <button
                    onClick={() => handleToggleActive(banner)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      banner.isActive
                        ? 'bg-brand-green/10 text-brand-green hover:bg-brand-green/20'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {banner.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    <span>{banner.isActive ? 'Active' : 'Inactive'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Edit Button */}
                    <button
                      onClick={() => openEditModal(banner)}
                      className="w-8 h-8 rounded-lg bg-cream-dark/60 hover:bg-cream-mid text-charcoal flex items-center justify-center text-xs transition-colors"
                      title="Edit Banner"
                    >
                      <Edit2 size={16} />
                    </button>

                    {/* Delete Button */}
                    {deleteConfirmId === banner._id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDeleteBanner(banner._id, banner.title)}
                          disabled={deletingId === banner._id}
                          className="bg-brand-red hover:bg-brand-red-dark text-white px-2 py-1 rounded text-xs font-semibold"
                        >
                          {deletingId === banner._id ? '...' : 'Yes'}
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="bg-gray-200 hover:bg-gray-300 text-charcoal px-2 py-1 rounded text-xs font-semibold"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(banner._id)}
                        className="w-8 h-8 rounded-lg bg-brand-red/10 hover:bg-brand-red/20 text-brand-red flex items-center justify-center text-xs transition-colors"
                        title="Delete Banner"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Banner Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-cream-mid my-8">
            <div className="flex items-center justify-between pb-4 border-b border-cream-dark">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-saffron/10 text-saffron flex items-center justify-center font-bold">
                  <Plus size={16} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-charcoal">Upload New Banner</h2>
                  <p className="text-xs text-brown">Add a promotional hero slide to the homepage.</p>
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

            {/* Live Image Preview */}
            <div className="my-5">
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                Banner Live Preview
              </label>
              <div className="relative h-44 w-full rounded-xl bg-cream-dark border border-cream-mid overflow-hidden flex items-center justify-center text-brown">
                {imageUrl.trim() ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon size={30} className="text-cream-mid mb-2 block" />
                    <span className="text-xs text-brown">Provide an image URL or choose a preset below</span>
                  </div>
                )}
                {title.trim() && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                    <div className="font-display font-bold text-sm truncate">{title}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Presets Quick Picker */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-brown uppercase tracking-wider mb-1.5">
                Quick Spice Presets (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImageUrl(preset.url);
                      if (!title) setTitle(preset.label);
                    }}
                    className="text-[11px] bg-cream font-medium text-charcoal hover:bg-cream-dark px-2.5 py-1 rounded-md border border-cream-mid transition-colors"
                  >
                    <Sparkles size={16} className="text-saffron mr-1" />
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateBanner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Banner Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pure Rajasthani Mathania Lal Mirch - Fresh Harvest"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-cream-mid rounded-lg focus:outline-none focus:border-saffron"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/banner.jpg"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-cream-mid rounded-lg focus:outline-none focus:border-saffron"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                    Display Sort Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={order}
                    onChange={e => setOrder(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-cream-mid rounded-lg focus:outline-none focus:border-saffron"
                  />
                  <span className="text-[11px] text-brown mt-0.5 block">
                    Lower number renders first (0, 1, 2...)
                  </span>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={e => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-red focus:ring-brand-red accent-brand-red"
                    />
                    <span className="text-sm font-medium text-charcoal">
                      Make Active Immediately
                    </span>
                  </label>
                </div>
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
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={16} />
                      <span>Publish Banner</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Banner Modal */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-cream-mid my-8">
            <div className="flex items-center justify-between pb-4 border-b border-cream-dark">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-saffron/10 text-saffron flex items-center justify-center font-bold">
                  <Edit2 size={16} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-charcoal">Edit Banner</h2>
                  <p className="text-xs text-brown">Update banner image, title or display sorting.</p>
                </div>
              </div>
              <button
                onClick={() => setEditingBanner(null)}
                className="text-gray-400 hover:text-charcoal p-1 text-lg"
              >
                <X size={16} />
              </button>
            </div>

            {/* Live Image Preview */}
            <div className="my-5">
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                Banner Live Preview
              </label>
              <div className="relative h-44 w-full rounded-xl bg-cream-dark border border-cream-mid overflow-hidden flex items-center justify-center">
                <img
                  src={editImageUrl}
                  alt={editTitle}
                  className="w-full h-full object-cover"
                  onError={e => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>
            </div>

            <form onSubmit={handleUpdateBanner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Banner Title *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-cream-mid rounded-lg focus:outline-none focus:border-saffron"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={editImageUrl}
                  onChange={e => setEditImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-cream-mid rounded-lg focus:outline-none focus:border-saffron"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                    Display Sort Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editOrder}
                    onChange={e => setEditOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-cream-mid rounded-lg focus:outline-none focus:border-saffron"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editIsActive}
                      onChange={e => setEditIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-red focus:ring-brand-red accent-brand-red"
                    />
                    <span className="text-sm font-medium text-charcoal">
                      Active on Storefront
                    </span>
                  </label>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-cream-dark">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="px-4 py-2 text-xs font-semibold text-brown hover:text-charcoal bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-brand-red hover:bg-brand-red-dark text-white rounded-lg text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Image Zoom Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[85vh] overflow-hidden rounded-2xl bg-charcoal flex flex-col items-center">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center"
            >
              <X size={16} />
            </button>
            <img
              src={previewImage}
              alt="Banner Full View"
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
