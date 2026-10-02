'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Edit2, Trash2, Upload, Plus, Loader2, Image as ImageIcon } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    isActive: true,
    displayOrder: 0,
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmRenameProducts, setConfirmRenameProducts] = useState(false);
  const [usageCount, setUsageCount] = useState(0);

  const fetchCategories = async () => {
    try {
      const [availRes, metaRes] = await Promise.all([
        fetch('/api/admin/categories/available'),
        fetch('/api/admin/categories')
      ]);

      if (!availRes.ok || !metaRes.ok) throw new Error('Failed to fetch categories');

      const availNames: string[] = await availRes.json();
      const metadata: any[] = await metaRes.json();

      const combined = availNames.map((name) => {
        const meta = metadata.find((m) => m.name.toLowerCase() === name.toLowerCase());
        return {
          name,
          slug: meta?.slug || encodeURIComponent(name),
          metadata: meta || null,
        };
      });

      // Also add any metadata that might not be in 'available' (should be impossible since available returns all metadata names now)
      metadata.forEach(m => {
        if (!combined.find(c => c.name.toLowerCase() === m.name.toLowerCase())) {
          combined.push({
            name: m.name,
            slug: m.slug,
            metadata: m
          });
        }
      });

      // Sort by display order
      combined.sort((a, b) => {
        const orderA = a.metadata?.displayOrder || 0;
        const orderB = b.metadata?.displayOrder || 0;
        if (orderA !== orderB) return orderA - orderB;
        return a.name.localeCompare(b.name);
      });

      setCategories(combined);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData({ name: '', slug: '', description: '', isActive: true, displayOrder: 0 });
    setFile(null);
    setPreview(null);
    setConfirmRenameProducts(false);
    setUsageCount(0);
    setShowModal(true);
  };

  const handleOpenEdit = (cat: any) => {
    setEditId(cat.metadata?._id || null);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.metadata?.description || '',
      isActive: cat.metadata ? cat.metadata.isActive !== false : true,
      displayOrder: cat.metadata?.displayOrder || 0,
    });
    setFile(null);
    setPreview(cat.metadata?.image?.url || null);
    setConfirmRenameProducts(false);
    setUsageCount(0);
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const checkUsageAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if name changed for existing
    if (editId) {
      const originalCat = categories.find(c => c.metadata?._id === editId);
      if (originalCat && originalCat.name !== formData.name && !confirmRenameProducts) {
        setSubmitting(true);
        try {
          const res = await fetch(`/api/admin/categories/${editId}/usage`);
          const data = await res.json();
          if (data.productCount > 0) {
            setUsageCount(data.productCount);
            setConfirmRenameProducts(true);
            setSubmitting(false);
            return; // Wait for user confirmation
          }
        } catch (err) {
          console.error(err);
        }
        setSubmitting(false);
      }
    }
    
    await executeSubmit();
  };

  const executeSubmit = async () => {
    setSubmitting(true);
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('slug', formData.slug);
    payload.append('description', formData.description);
    payload.append('isActive', String(formData.isActive));
    payload.append('displayOrder', String(formData.displayOrder));
    
    if (confirmRenameProducts) {
      payload.append('updateProducts', 'true');
    }

    if (file) payload.append('image', file);

    const url = editId ? `/api/admin/categories/${editId}` : '/api/admin/categories';
    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, body: payload });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Submission failed');
      }
      await fetchCategories();
      setShowModal(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveImage = async (id: string) => {
    if (!confirm('Are you sure you want to remove this image?')) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}/image`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete image');
      fetchCategories();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCategories = categories.filter((cat) => {
    if (search && !cat.name.toLowerCase().includes(search.toLowerCase())) return false;
    const isActive = cat.metadata ? cat.metadata.isActive !== false : true;
    if (statusFilter === 'active' && !isActive) return false;
    if (statusFilter === 'inactive' && isActive) return false;
    return true;
  });

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-charcoal">Category Management</h2>
          <p className="text-stone-500 text-sm mt-1">Manage your store categories, descriptions, visibility and images.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-charcoal text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-sm">
              <th className="py-3 px-4 font-semibold">Image</th>
              <th className="py-3 px-4 font-semibold">Name</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Order</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((cat) => {
              const hasImage = !!cat.metadata?.image?.url;
              const isActive = cat.metadata ? cat.metadata.isActive !== false : true;
              
              return (
                <tr key={cat.name} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                  <td className="py-3 px-4">
                    {hasImage ? (
                      <div className="relative w-12 h-12 rounded bg-stone-100 border border-stone-200 overflow-hidden">
                        <Image src={cat.metadata!.image.url} alt={cat.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-charcoal">{cat.name}</div>
                    <div className="text-stone-500 text-xs">{cat.slug}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${isActive ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-700'}`}>
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-stone-600">
                    {cat.metadata?.displayOrder || 0}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="px-3 py-1.5 text-sm font-medium rounded-lg text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1 border border-blue-100"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      {hasImage && (
                        <button
                          onClick={() => handleRemoveImage(cat.metadata!._id)}
                          className="px-3 py-1.5 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1 border border-red-100"
                        >
                          <Trash2 size={14} /> Remove Image
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-stone-500">
                  No existing product categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <h3 className="font-bold text-lg text-charcoal">
                {editId ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>
            
            <form onSubmit={checkUsageAndSubmit} className="p-6 space-y-4">
              {confirmRenameProducts ? (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <h4 className="text-amber-800 font-bold mb-2">Warning: Product Usage</h4>
                  <p className="text-amber-700 text-sm mb-4">
                    {usageCount} products currently use this category.
                    Rename category and update these products?
                  </p>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setConfirmRenameProducts(false)} className="px-3 py-1.5 bg-white border border-stone-200 text-sm rounded">Cancel</button>
                    <button type="button" onClick={executeSubmit} disabled={submitting} className="px-3 py-1.5 bg-amber-600 text-white text-sm rounded hover:bg-amber-700">Yes, Update Products</button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Category Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData(prev => ({ 
                          ...prev, 
                          name: val, 
                          // Auto-slug if it's new (no editId) or if admin wants to edit
                          slug: editId ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                        }))
                      }}
                      className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Slug</label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron min-h-[80px]"
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-stone-700 mb-1">Status</label>
                      <select
                        value={formData.isActive ? 'true' : 'false'}
                        onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-stone-700 mb-1">Display Order</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.displayOrder}
                        onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value) || 0})}
                        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Category Image</label>
                    <input
                      type="file"
                      accept="image/jpeg, image/png, image/webp"
                      onChange={handleFileChange}
                      className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-saffron/10 file:text-saffron hover:file:bg-saffron/20 cursor-pointer"
                    />
                  </div>

                  {preview && (
                    <div className="mt-4">
                      <p className="text-xs text-stone-500 mb-2">Preview:</p>
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-stone-200">
                        <Image src={preview} alt="Preview" fill className="object-cover" />
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 text-sm font-medium bg-charcoal text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-2"
                    >
                      {submitting && <Loader2 size={16} className="animate-spin" />}
                      {submitting ? 'Saving...' : (editId ? 'Save Changes' : 'Create Category')}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
