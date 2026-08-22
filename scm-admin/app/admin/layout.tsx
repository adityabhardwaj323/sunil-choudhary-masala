'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import {
  PieChart,
  PackageOpen,
  ShoppingBag,
  Users,
  LineChart,
  Tag,
  Images,
  Star,
  Mail,
  Settings,
  ExternalLink,
  LogOut,
  Loader2,
  Edit,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<{ firstName?: string; lastName?: string; email?: string; role?: string } | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setCheckingRole(false);
      return;
    }

    // Show cached info immediately for a snappy header, but it is not
    // trusted for access control — that's decided by the network check below.
    try {
      const stored = localStorage.getItem('scm_admin_user') || localStorage.getItem('scm_admin_user_data');
      if (stored) {
        setAdminUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }

    setCheckingRole(true);
    fetch('/api/auth/profile')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data || data.role !== 'admin') {
          localStorage.removeItem('scm_admin_user');
          localStorage.removeItem('scm_admin_user_data');
          router.push('/admin/login');
          return;
        }
        setAdminUser(data);
        localStorage.setItem('scm_admin_user', JSON.stringify(data));
        setCheckingRole(false);
      })
      .catch(() => {
        router.push('/admin/login');
      });
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout failed', e);
    }
    localStorage.removeItem('scm_admin_user');
    localStorage.removeItem('scm_admin_user_data');
    router.push('/admin/login');
    router.refresh();
  };

  // If visiting login page, render without admin sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Block rendering the admin shell until the role check against the
  // backend (via the BFF) confirms this session actually belongs to an admin.
  if (checkingRole) {
    return (
      <div className="flex h-screen items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-3 text-stone-500">
          <Loader2 size={24} className="animate-spin text-brand-red" />
          <span className="text-sm font-medium">Verifying admin access...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { page: '/admin/dashboard', icon: PieChart, label: 'Dashboard', section: 'MAIN' },
    { page: '/admin/products', icon: PackageOpen, label: 'Products', section: null },
    { page: '/admin/orders', icon: ShoppingBag, label: 'Orders', section: null },
    { page: '/admin/customers', icon: Users, label: 'Customers', section: null },
    { page: '/admin/analytics', icon: LineChart, label: 'Analytics', section: 'MANAGE' },
    { page: '/admin/coupons', icon: Tag, label: 'Coupons', section: null },
    { page: '/admin/banners', icon: Images, label: 'Banners', section: null },
    { page: '/admin/reviews', icon: Star, label: 'Reviews', section: null },
    { page: '/admin/contacts', icon: Mail, label: 'Inquiries', section: null },
    { page: '/admin/gallery', icon: Images, label: 'Gallery CMS', section: 'CONTENT' },
    { page: '/admin/blog', icon: Edit, label: 'Blog CMS', section: null },
    { page: '/admin/media-usage', icon: PieChart, label: 'CMS Media', section: null },
    { page: '/admin/settings', icon: Settings, label: 'Settings', section: 'SYSTEM' },
  ];

  return (
    <div className="flex h-screen bg-cream font-body text-charcoal">
      {/* Sidebar */}
      <aside className="w-64 bg-charcoal text-white flex flex-col h-full shrink-0 shadow-xl border-r border-stone-800">
        <div className="p-5 border-b border-stone-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-red to-saffron flex items-center justify-center font-bold text-lg text-white shadow-md">
            SCM
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm text-white tracking-wide truncate">Sunil Choudhary</div>
            <div className="text-xs text-saffron font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              Admin Portal
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1.5 custom-scrollbar">
          {navItems.map((item, idx) => {
            const isActive = pathname === item.page || (item.page !== '/admin/dashboard' && pathname?.startsWith(item.page));
            return (
              <div key={idx}>
                {item.section && (
                  <div className="text-[11px] text-stone-500 font-bold mb-1.5 mt-4 px-2 uppercase tracking-wider">
                    {item.section}
                  </div>
                )}
                <Link
                  href={item.page}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-red to-saffron text-white shadow-md font-semibold'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                  }`}
                >
                  <item.icon size={18} className={isActive ? 'text-white' : 'text-stone-400'} />
                  <span>{item.label}</span>
                  {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></span>}
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-stone-800 bg-stone-900/60 space-y-1.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <ExternalLink size={16} className="w-5 text-center text-stone-400" />
            <span>View Storefront</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-950/40 w-full text-left transition-colors font-medium"
          >
            <LogOut size={16} className="w-5 text-center" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-cream/40">
        <header className="h-16 border-b border-stone-200/80 flex items-center justify-between px-8 shrink-0 bg-white/90 backdrop-blur-md sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <h1 className="font-display font-bold text-xl text-charcoal tracking-tight">
              {navItems.find((n) => pathname === n.page || (n.page !== '/admin/dashboard' && pathname?.startsWith(n.page)))?.label || 'Admin Control'}
            </h1>
            <span className="text-xs bg-saffron/10 text-saffron border border-saffron/30 font-semibold px-2 py-0.5 rounded-full">
              SCM Official
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-charcoal">
                {adminUser?.firstName ? `${adminUser.firstName} ${adminUser.lastName || ''}` : 'Administrator'}
              </span>
              <span className="text-xs text-stone-500">{adminUser?.email || 'admin@sunilmasala.com'}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-red to-saffron text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-white ring-1 ring-stone-200">
              {adminUser?.firstName ? adminUser.firstName[0].toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-stone-50/70">
          {children}
        </div>
      </main>
    </div>
  );
}
