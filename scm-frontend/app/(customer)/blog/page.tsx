'use client';

import { useState, useEffect } from 'react';
import { Loader2, FileText, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  featuredImageUrl?: string;
  publishedAt: string;
  createdAt: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog')
      .then(res => res.json())
      .then(data => setBlogs(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-cream min-h-screen pb-20">
      <div className="bg-gradient-to-r from-charcoal to-[#2a2420] py-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-8 -translate-y-1/2 opacity-5 select-none pointer-events-none">
          <FileText size={180} />
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="text-saffron font-bold tracking-wider uppercase text-sm mb-3 block">Insights & Updates</span>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Our Blog</h1>
          <p className="text-cream-mid max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Latest news, recipes, and spice insights from Sunil Choudhary Masala
          </p>
        </div>
      </div>

      <div className="container-custom relative z-20 mt-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-saffron" size={40} />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-stone-500">
            <p>No blog posts available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((post) => (
              <Link href={`/blog/`} key={post._id} className="bg-white rounded-2xl shadow-sm border border-cream-dark/50 overflow-hidden group hover:shadow-md hover:border-brand-red/30 transition-all flex flex-col">
                {post.featuredImageUrl && (
                  <div className="relative h-64 w-full bg-cream-dark/10 overflow-hidden">
                    <Image 
                      src={post.featuredImageUrl} 
                      alt={post.title} 
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </div>
                )}
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-saffron bg-saffron/10 px-2 py-1 rounded">{post.category}</span>
                    <div className="flex items-center gap-1 text-stone-500 text-sm">
                      <Calendar size={14} />
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <h2 className="font-playfair font-bold text-xl text-charcoal mb-4 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-stone-600 line-clamp-3 mb-4 flex-1">
                    {post.excerpt || post.content}
                  </p>
                  <div className="pt-4 border-t border-cream-dark/30">
                    <span className="text-brand-red font-bold text-sm uppercase tracking-wider group-hover:text-charcoal transition-colors">
                      Read More &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
