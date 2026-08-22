'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { Search, Loader2, AlertTriangle, ArrowRight, Heart, ShoppingBag, Star, ChevronRight } from 'lucide-react';

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(q);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (q) {
      fetchResults(q);
    }
  }, [q]);

  const fetchResults = async (keyword: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(keyword)}`);
      if (!res.ok) throw new Error('Failed to fetch results');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err: any) {
      setError(err.message || 'Error fetching results');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="bg-cream min-h-screen pb-16">
      {/* Interior Page Hero */}
      <div className="bg-gradient-to-r from-charcoal to-[#2a2420] py-16 relative overflow-hidden">
        {/* Subtle background watermarks */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">🌶️</div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">🌶️</div>
        
        <div className="container-custom relative z-10 text-center">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">Search Results</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-cream-dark/80">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Search</span>
          </div>
        </div>
      </div>

      <div className="container-custom mt-8 md:mt-12">
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <form 
            onSubmit={handleSearch}
            className="flex items-center bg-white rounded-full border-2 border-cream-dark p-1.5 focus-within:border-saffron focus-within:ring-4 focus-within:ring-saffron/10 transition-all shadow-sm"
          >
            <div className="pl-5 text-gray-400">
              <Search size={22} />
            </div>
            <input 
              type="text" 
              placeholder="Search for spices, blends, etc..." 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 bg-transparent px-4 py-3 outline-none text-charcoal font-medium text-lg w-full"
            />
            <button 
              type="submit"
              className="bg-brand-red text-white px-8 py-3.5 rounded-full font-bold shadow-md hover:bg-red-800 transition-all"
            >
              Search
            </button>
          </form>

          {q && (
            <div className="text-center mt-6 text-brown">
              Showing results for: <strong className="text-charcoal font-bold text-lg">"{q}"</strong>
            </div>
          )}
        </div>

        {/* Results Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-cream-dark shadow-sm">
            <Loader2 className="animate-spin text-brand-red mb-4" size={48} />
            <p className="text-brown font-medium text-lg">Searching our spices...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-6 rounded-2xl flex items-center justify-center gap-3 border border-red-200 shadow-sm max-w-2xl mx-auto">
            <AlertTriangle size={24} />
            <p className="font-medium">{error}</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {products.map((product) => (
              <Link href={`/product/${product._id}`} key={product._id} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-cream-dark shadow-sm hover:shadow-xl hover:border-brand-red/30 transition-all duration-300 transform hover:-translate-y-1">
                {/* Image Box */}
                <div className="relative aspect-square bg-cream-dark/30 overflow-hidden flex items-center justify-center">
                  {product.images && product.images[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                  ) : (
                    <span className="text-6xl opacity-50">🌶️</span>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isBestseller && (
                      <span className="bg-brand-red text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full shadow-md">
                        Bestseller
                      </span>
                    )}
                  </div>
                  
                  {/* Wishlist Button */}
                  <button 
                    className="absolute top-3 right-3 w-8 h-8 md:w-9 md:h-9 bg-white/90 backdrop-blur text-gray-400 rounded-full flex items-center justify-center shadow-sm hover:text-brand-red hover:bg-white transition-colors" 
                    onClick={(e) => e.preventDefault()}
                  >
                    <Heart size={18} />
                  </button>
                </div>
                
                {/* Content Box */}
                <div className="p-4 md:p-5 flex flex-col flex-grow">
                  <div className="text-[10px] md:text-xs font-bold text-saffron uppercase tracking-wider mb-1 md:mb-1.5">
                    {product.category || 'Spices'}
                  </div>
                  <h3 className="font-playfair font-bold text-charcoal text-base md:text-lg leading-tight mb-2 line-clamp-2 flex-grow group-hover:text-brand-red transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3 md:mb-4">
                    <div className="flex text-gold text-xs md:text-sm">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < Math.round(product.ratingAvg || 0) ? "fill-gold text-gold" : "text-gray-300"} />
                      ))}
                    </div>
                    <span className="text-gray-400 text-xs font-medium">({product.numReviews || 0})</span>
                  </div>
                  
                  {/* Price & Action */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-cream-dark">
                    <div className="flex flex-col">
                      <span className="font-bold text-brand-red text-lg md:text-xl">
                        ₹{product.variants && product.variants[0] ? product.variants[0].price : 0}
                      </span>
                    </div>
                    <button 
                      className="w-8 h-8 md:w-10 md:h-10 bg-cream text-charcoal rounded-full flex items-center justify-center hover:bg-brand-red hover:text-white transition-colors group/btn"
                      onClick={(e) => e.preventDefault()}
                    >
                      <ShoppingBag size={18} className="group-active/btn:scale-90 transition-transform" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : q ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white border border-cream-dark rounded-3xl shadow-sm max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center text-brand-red mb-6">
              <Search size={32} />
            </div>
            <h3 className="font-playfair text-3xl font-bold text-charcoal mb-3">No results found</h3>
            <p className="text-brown text-lg max-w-lg mb-10">We couldn't find any matches for <strong className="text-charcoal">"{q}"</strong>. Try checking your spelling or use different keywords.</p>
            
            <div className="w-full max-w-2xl">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Popular Searches</h4>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/search?q=Mirchi" className="px-5 py-2.5 bg-cream/50 border border-cream-dark rounded-full text-charcoal font-medium hover:border-saffron hover:bg-cream transition-colors">Chilli Powders</Link>
                <Link href="/search?q=Haldi" className="px-5 py-2.5 bg-cream/50 border border-cream-dark rounded-full text-charcoal font-medium hover:border-saffron hover:bg-cream transition-colors">Dry Fruits & Nuts</Link>
                <Link href="/search?q=Dhaniya" className="px-5 py-2.5 bg-cream/50 border border-cream-dark rounded-full text-charcoal font-medium hover:border-saffron hover:bg-cream transition-colors">Healthy Snacks</Link>
                <Link href="/search?q=Garam+Masala" className="px-5 py-2.5 bg-cream/50 border border-cream-dark rounded-full text-charcoal font-medium hover:border-saffron hover:bg-cream transition-colors">Garam Masala</Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white border border-cream-dark rounded-3xl shadow-sm max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center text-saffron mb-6">
              <Search size={32} />
            </div>
            <h3 className="font-playfair text-3xl font-bold text-charcoal mb-3">Search our store</h3>
            <p className="text-brown text-lg mb-10">Enter a keyword above to search for your favourite spices.</p>
            
            <div className="w-full max-w-2xl">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Suggested Categories</h4>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/search?q=Whole" className="px-5 py-2.5 bg-cream/50 border border-cream-dark rounded-full text-charcoal font-medium hover:border-saffron hover:bg-cream transition-colors flex items-center gap-2">
                  <span>Chilli Powders</span> <ArrowRight size={14} className="text-gray-400" />
                </Link>
                <Link href="/search?q=Ground" className="px-5 py-2.5 bg-cream/50 border border-cream-dark rounded-full text-charcoal font-medium hover:border-saffron hover:bg-cream transition-colors flex items-center gap-2">
                  <span>Ground Spices</span> <ArrowRight size={14} className="text-gray-400" />
                </Link>
                <Link href="/search?q=Blended" className="px-5 py-2.5 bg-cream/50 border border-cream-dark rounded-full text-charcoal font-medium hover:border-saffron hover:bg-cream transition-colors flex items-center gap-2">
                  <span>Healthy Snacks</span> <ArrowRight size={14} className="text-gray-400" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
