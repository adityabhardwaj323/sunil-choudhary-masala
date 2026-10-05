import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/motion/FadeIn';
import { StaggerChildren } from '@/components/motion/StaggerChildren';
import { MotionItem } from '@/components/motion/MotionItem';
import { fetchBlogs } from '@/lib/api';
import { BlogPost } from '@/types';

function stripHtml(html?: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

export default async function BlogPreview() {
  let blogs: BlogPost[] = [];

  try {
    const data = await fetchBlogs();
    // Filter for published posts and take maximum of 3
    blogs = (data || [])
      .filter((post) => post.status === 'published' || !post.status)
      .slice(0, 3);
  } catch (err) {
    console.error('Failed to load blogs for homepage preview:', err);
  }

  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-32 px-6 md:px-12 bg-white">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <FadeIn className="text-center mb-16 flex flex-col items-center">
          <span className="font-body text-brand-red uppercase tracking-[0.2em] text-xs font-semibold mb-3 block">
            From Our Kitchen
          </span>
          <h2 className="font-display text-3xl md:text-[44px] font-bold text-charcoal mb-4">
            Recipes &amp; Stories
          </h2>
        </FadeIn>

        {/* Horizontal Mobile Scroll / Desktop Grid */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 overflow-x-auto snap-x snap-mandatory gap-6 md:gap-8 pb-8 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 hide-scrollbar">
          {blogs.map((post) => {
            const excerpt = post.excerpt?.trim() || stripHtml(post.content);
            const postDate = post.publishedAt || post.createdAt;
            const formattedDate = postDate
              ? new Date(postDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : null;

            return (
              <div key={post._id} className="min-w-[280px] w-[80vw] md:w-auto shrink-0 snap-start h-full">
                <Link
                  href={`/blog/${post.slug || post._id}`}
                  className="group flex flex-col h-full focus:outline-none"
                  aria-label={`Read article: ${post.title}`}
                >
                  {/* Featured Image */}
                  <div className="relative aspect-[4/3] w-full bg-[#FAF7F1] overflow-hidden mb-5">
                    {post.featuredImageUrl ? (
                      <Image
                        src={post.featuredImageUrl}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        unoptimized={post.featuredImageUrl.includes('cloudinary')}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-charcoal/20">
                        <BookOpen size={48} strokeWidth={1} />
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="flex-1 flex flex-col px-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-red">
                        {post.category || 'Recipes'}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-xl md:text-2xl text-charcoal mb-3 line-clamp-2 group-hover:text-brand-red transition-colors leading-[1.3]">
                      {post.title}
                    </h3>

                    <p className="font-body text-charcoal/70 text-[15px] leading-relaxed line-clamp-2 mb-5 flex-1">
                      {excerpt}
                    </p>

                    <div className="mt-auto pt-2">
                      <span className="font-body text-charcoal font-semibold text-sm uppercase tracking-wide flex items-center gap-1.5 group-hover:text-brand-red transition-colors">
                        Read Story <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* View All Blogs CTA Button */}
        <div className="mt-16 text-center">
          <Link
            href="/blog"
            className="text-brand-red font-semibold font-body tracking-wide hover:text-charcoal transition-colors inline-flex items-center gap-2"
          >
            VIEW ALL STORIES &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
