const fs = require('fs');

const sidebarCode = \'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PieChart, PackageOpen, ShoppingBag, Users, LineChart, Tag, Images, Star, Mail, Edit, Settings, LogOut, ExternalLink, FolderTree } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout failed', e);
    }
    localStorage.removeItem('scm_admin_user');
    localStorage.removeItem('scm_admin_user_data');
    window.location.href = '/admin/login';
  };

  const navItems = [
    { page: '/admin/dashboard', icon: PieChart, label: 'Dashboard', section: 'MAIN' },
    { page: '/admin/products', icon: PackageOpen, label: 'Products', section: null },
    { page: '/admin/categories', icon: FolderTree, label: 'Categories', section: null },
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
                className={\lex items-center gap-3 px-3.5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 \\}
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
  );
}\

fs.writeFileSync('d:/sunil-choudhary-masala/scm-admin-frontend/components/admin/Sidebar.tsx', sidebarCode);
console.log('Sidebar generated!');
