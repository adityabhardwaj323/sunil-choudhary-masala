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
    <section className="py-20 px-4 md:px-8 bg-cream/70">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <FadeIn className="text-center mb-12 flex flex-col items-center">
          <span className="font-kalam text-saffron text-base md:text-lg mb-2 block tracking-wide">
            ✦ From Our Kitchen
          </span>
          <h2 className="font-playfair text-[28px] md:text-[44px] font-bold text-charcoal mb-3">
            Latest From SCM
          </h2>
          <SectionDivider />
          <p className="text-brown max-w-2xl text-sm md:text-base mt-4 leading-relaxed">
            Recipes, culinary traditions, and spice stories.
          </p>
        </FadeIn>

        {/* 3 Blog Cards Grid */}
        <StaggerChildren className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:gap-8 sm:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
              
            const imageUrl = post.featuredImageUrl?.trim();
            const hasValidImage = imageUrl && imageUrl.length > 5;

            return (
              <MotionItem key={post._id} whileHover={{ y: -4 }} className="h-full w-[85vw] min-w-[280px] max-w-[320px] shrink-0 snap-center sm:w-auto sm:min-w-0 sm:max-w-none">
                <Link
                  href={`/blog/${post.slug || post._id}`}
                  className="group bg-white rounded-2xl border border-cream-mid/70 shadow-sm hover:shadow-md hover:border-brand-red/30 transition-all duration-300 overflow-hidden flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-brand-red"
                  aria-label={`Read article: ${post.title}`}
                >
                  {/* Featured Image */}
                  <div className="relative h-40 sm:h-48 lg:h-52 w-full bg-cream-dark/30 overflow-hidden">
                    {hasValidImage ? (
                      <Image
                        src={imageUrl}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 85vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized={true}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#4a2010] to-[#7a3518] text-white/50">
                        <BookOpen size={48} className="opacity-40" />
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 md:p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-saffron bg-saffron/10 px-2.5 py-0.5 rounded-full">
                        {post.category || 'Spices'}
                      </span>
                      {formattedDate && (
                        <div className="flex items-center gap-1.5 text-stone-500 text-xs">
                          <Calendar size={13} />
                          <span>{formattedDate}</span>
                        </div>
                      )}
                    </div>

                    <h3 className="font-playfair font-bold text-lg md:text-xl text-charcoal mb-2 line-clamp-2 group-hover:text-brand-red transition-colors leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-stone-600 text-[13px] md:text-sm leading-relaxed line-clamp-2 md:line-clamp-3 mb-4 flex-1">
                      {excerpt}
                    </p>

                    <div className="pt-3 md:pt-4 border-t border-cream-mid/40 flex items-center justify-between">
                      <span className="text-brand-red font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                        Read More <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </MotionItem>
            );
          })}
        </StaggerChildren>

        {/* View All Blogs CTA Button */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-xs hover:shadow-md inline-flex items-center gap-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-brand-red"
          >
            View All Blogs <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
