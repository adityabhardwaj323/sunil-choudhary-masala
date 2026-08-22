
'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, Edit2, X } from 'lucide-react';
import Image from 'next/image';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  status: string;
  featuredImageUrl?: string;
  publishedAt: string;
  createdAt: string;
}

export default function AdminBlog() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Uncategorized');
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('Admin');
  const [status, setStatus] = useState('published');
  const [publishedAt, setPublishedAt] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/admin/blog');
      if (res.ok) {
        setBlogs(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content) return;

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('excerpt', excerpt);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('tags', JSON.stringify(tags.split(',').map(t => t.trim()).filter(Boolean)));
    formData.append('author', author);
    formData.append('status', status);
    formData.append('publishedAt', publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString());
    if (file) formData.append('featuredImage', file);

    try {
      const url = editingId ? `/api/admin/blog/${editingId}` : '/api/admin/blog';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Action failed');

      resetForm();
      await fetchBlogs();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    try {
      const res = await fetch(`/api/admin/blog/${editingId}`, { method: 'DELETE' });
      if (res.ok) {
        setBlogs(blogs.filter(b => b._id !== id));
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingId(blog._id);
    setTitle(blog.title);
    setSlug(blog.slug);
    setExcerpt(blog.excerpt || '');
    setContent(blog.content);
    setCategory(blog.category || 'Uncategorized');
    setTags((blog.tags || []).join(', '));
    setAuthor(blog.author || 'Admin');
    setStatus(blog.status || 'published');
    if (blog.publishedAt) {
      const d = new Date(blog.publishedAt);
      // local datetime format: YYYY-MM-DDThh:mm
      setPublishedAt(d.toISOString().slice(0, 16));
    }
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setCategory('Uncategorized');
    setTags('');
    setAuthor('Admin');
    setStatus('published');
    setPublishedAt('');
    setFile(null);
    setError('');
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-saffron" size={32} /></div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{editingId ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
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
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug (URL) *</label>
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Excerpt</label>
              <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Content * (HTML supported)</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Publish Date</label>
              <input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Featured Image {editingId && '(Optional to replace)'}</label>
              <input type="file" accept="image/jpeg, image/png, image/webp" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full" />
            </div>
          </div>
          <button type="submit" disabled={isUploading || !title || !content || !slug} className="bg-charcoal text-white px-6 py-2 rounded-lg font-medium hover:bg-stone-800 disabled:opacity-50 flex items-center gap-2 mt-4">
            {isUploading ? <Loader2 className="animate-spin" size={18} /> : (editingId ? <Edit2 size={18} /> : <Plus size={18} />)}
            {editingId ? 'Save Changes' : (status === 'draft' ? 'Save Draft' : 'Publish Post')}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map(blog => (
          <div key={blog._id} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden flex flex-col">
            {blog.featuredImageUrl && (
              <div className="relative h-48 w-full">
                <Image src={blog.featuredImageUrl} alt={blog.title} fill className="object-cover" unoptimized />
                {blog.status === 'draft' && (
                  <div className="absolute top-2 right-2 bg-stone-800/80 text-white text-xs px-2 py-1 rounded">Draft</div>
                )}
              </div>
            )}
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg line-clamp-2 pr-2">{blog.title}</h3>
                {!blog.featuredImageUrl && blog.status === 'draft' && (
                  <span className="bg-stone-800 text-white text-xs px-2 py-1 rounded">Draft</span>
                )}
              </div>
              <div className="text-xs text-stone-500 mb-2">/{blog.slug} • {blog.category}</div>
              <div className="mt-auto flex justify-between items-center pt-4 border-t border-stone-100">
                <span className="text-xs text-stone-500">
                  {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : new Date(blog.createdAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(blog)} className="text-stone-500 hover:text-charcoal p-1"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(blog._id)} className="text-stone-400 hover:text-brand-red p-1"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
