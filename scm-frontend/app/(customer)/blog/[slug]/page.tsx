'use client';

import { useState, useEffect } from 'react';
import { Loader2, Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  featuredImageUrl?: string;
  publishedAt: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!params.slug) return;
    
    fetch(`/api/blog/`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => setBlog(data))
      .catch(err => setError(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex justify-center py-32">
        <Loader2 className="animate-spin text-saffron" size={40} />
      </div>
    );
  }

  if (error || !blog) {
    return notFound();
  }

  return (
    <div className="bg-cream min-h-screen pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-charcoal to-[#2a2420] py-20 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <Link href="/blog" className="inline-flex items-center gap-2 text-cream-mid hover:text-white transition-colors mb-8">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          <div className="max-w-4xl">
            <span className="text-saffron font-bold tracking-wider uppercase text-sm mb-4 block">{blog.category}</span>
            <h1 className="font-playfair text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-cream-mid text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {new Date(blog.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center gap-2">
                <User size={16} />
                {blog.author}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container-custom relative z-20 -mt-10">
        <div className="bg-white rounded-2xl shadow-sm border border-cream-dark/50 overflow-hidden max-w-4xl mx-auto">
          {blog.featuredImageUrl && (
            <div className="relative h-[400px] md:h-[500px] w-full bg-cream-dark/10">
              <Image 
                src={blog.featuredImageUrl} 
                alt={blog.title} 
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          
          <div className="p-8 md:p-12">
            <div 
              className="prose prose-stone prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
            
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-cream-dark/30 flex flex-wrap items-center gap-3">
                <Tag size={18} className="text-stone-400" />
                {blog.tags.map(tag => (
                  <span key={tag} className="bg-cream-dark/20 text-stone-600 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
