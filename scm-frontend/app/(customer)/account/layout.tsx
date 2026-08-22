'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, MapPin, Settings, LogOut, Heart } from 'lucide-react';

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Read cached user
    const cachedUser = localStorage.getItem('scm_user');

    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch (e) {
        // ignore parse error
      }
    }

    fetch('/api/auth/profile')
      .then((res) => {
        if (res.status === 401) {
          handleLogout();
          return null;
        }
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data) {
          setUser(data);
          localStorage.setItem('scm_user', JSON.stringify(data));
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout failed', e);
    }
    localStorage.removeItem('scm_user');
    localStorage.removeItem('scm_cart_count');
    router.push('/login');
  };

  const getInitials = () => {
    if (!user) return 'JD';
    const first = (user.firstName || 'U')[0] || '';
    const last = (user.lastName || '')[0] || '';
    return (first + last).toUpperCase() || 'JD';
  };

  const fullName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Customer'
    : 'Customer';

  return (
    <div className="bg-cream min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-cream-dark shadow-sm overflow-hidden mb-6">
            <div className="p-6 bg-red-50/50 flex flex-col items-center text-center border-b border-cream-dark">
              <div className="w-20 h-20 bg-brand-red text-white rounded-full flex items-center justify-center text-2xl font-playfair font-bold shadow-md mb-3">
                {getInitials()}
              </div>
              <div className="font-bold text-charcoal text-lg mb-1">{fullName}</div>
              <div className="text-sm text-brown">{user?.email || 'my-account'}</div>
            </div>

            <nav className="p-4 flex flex-col gap-1">
              <Link
                href="/account"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === '/account' ? 'bg-red-50 text-brand-red' : 'text-charcoal hover:bg-cream hover:text-brand-red'}`}
              >
                <LayoutDashboard size={18} /> My Profile
              </Link>
              <Link
                href="/account/orders"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname.startsWith('/account/orders') ? 'bg-red-50 text-brand-red' : 'text-charcoal hover:bg-cream hover:text-brand-red'}`}
              >
                <Package size={18} /> My Orders
              </Link>
              <Link
                href="/wishlist"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === '/wishlist' ? 'bg-red-50 text-brand-red' : 'text-charcoal hover:bg-cream hover:text-brand-red'}`}
              >
                <Heart size={18} /> Wishlist
              </Link>
              <Link
                href="/account/address"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === '/account/address' ? 'bg-red-50 text-brand-red' : 'text-charcoal hover:bg-cream hover:text-brand-red'}`}
              >
                <MapPin size={18} /> Addresses
              </Link>
              <Link
                href="/account/settings"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === '/account/settings' ? 'bg-red-50 text-brand-red' : 'text-charcoal hover:bg-cream hover:text-brand-red'}`}
              >
                <Settings size={18} /> Account Settings
              </Link>
            </nav>
            
            <div className="p-4 border-t border-cream-dark">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
                onClick={handleLogout}
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-grow min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
