
'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, Edit2, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface GalleryImage {
  _id: string;
  title: string;
  description: string;
  category: string;
  isActive: boolean;
  imageUrl: string;
  createdAt: string;
}

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [isActive, setIsActive] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/admin/gallery');
      if (res.ok) {
        setImages(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGallery(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    if (!editingId && !file) return;

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('isActive', isActive.toString());
    if (file) formData.append('image', file);

    try {
      const url = editingId ? `/api/admin/gallery/${editingId}` : '/api/admin/gallery';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Action failed');

      resetForm();
      await fetchGallery();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setImages(images.filter(img => img._id !== id));
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleEdit = (img: GalleryImage) => {
    setEditingId(img._id);
    setTitle(img.title);
    setDescription(img.description || '');
    setCategory(img.category || 'General');
    setIsActive(img.isActive !== false);
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setCategory('General');
    setIsActive(true);
    setFile(null);
    setError('');
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-saffron" size={32} /></div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{editingId ? 'Edit Image' : 'Upload New Image'}</h2>
          {editingId && (
            <button onClick={resetForm} className="text-stone-500 hover:text-charcoal flex items-center gap-1 text-sm">
              <X size={16} /> Cancel Edit
            </button>
          )}
        </div>
        {error && <div className="bg-red-50 text-brand-red p-3 rounded-lg text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description (optional)</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image File {editingId ? '(Optional to replace)' : '(Max 5MB)'}</label>
              <input type="file" accept="image/jpeg, image/png, image/webp" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full" required={!editingId} />
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 text-brand-red rounded border-stone-300 focus:ring-brand-red" />
                <span className="text-sm font-medium">Active (visible on site)</span>
              </label>
            </div>
          </div>
          <button type="submit" disabled={isUploading || !title || (!editingId && !file)} className="bg-charcoal text-white px-6 py-2 rounded-lg font-medium hover:bg-stone-800 disabled:opacity-50 flex items-center gap-2 mt-4">
            {isUploading ? <Loader2 className="animate-spin" size={18} /> : (editingId ? <Edit2 size={18} /> : <Plus size={18} />)}
            {editingId ? 'Save Changes' : 'Upload'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map(img => (
          <div key={img._id} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden flex flex-col group">
            <div className="relative aspect-square">
              <Image src={img.imageUrl} alt={img.title} fill className="object-cover" unoptimized />
              {!img.isActive && (
                <div className="absolute top-2 right-2 bg-stone-800/80 text-white text-xs px-2 py-1 rounded">Hidden</div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-sm truncate pr-2">{img.title}</h3>
                <span className="text-xs bg-stone-100 px-2 py-0.5 rounded text-stone-600">{img.category}</span>
              </div>
              <p className="text-xs text-stone-500 line-clamp-2 mb-3 flex-1">{img.description}</p>
              <div className="flex justify-between items-center pt-3 border-t border-stone-100">
                <button onClick={() => handleEdit(img)} className="text-stone-500 hover:text-charcoal p-1"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(img._id)} className="text-stone-400 hover:text-brand-red p-1"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
