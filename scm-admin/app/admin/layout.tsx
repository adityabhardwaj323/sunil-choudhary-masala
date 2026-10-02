'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checkingRole, setCheckingRole] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/admin/login') {
      setCheckingRole(false);
      return;
    }

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
          fetch('/api/auth/logout', { method: 'POST' })
            .catch(() => {})
            .finally(() => {
              localStorage.removeItem('scm_admin_user');
              localStorage.removeItem('scm_admin_user_data');
              setCheckingRole(false);
              router.push('/admin/login');
            });
          return;
        }
        setAdminUser(data);
        localStorage.setItem('scm_admin_user', JSON.stringify(data));
        setCheckingRole(false);
      })
      .catch(() => {
        fetch('/api/auth/logout', { method: 'POST' })
          .catch(() => {})
          .finally(() => {
            setCheckingRole(false);
            router.push('/admin/login');
          });
      });
  }, [pathname, router]);

  if (checkingRole) {
    return (
      <div className="flex h-screen items-center justify-center bg-cream">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-charcoal font-medium font-display animate-pulse">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // If we are exactly on the login page, render it standalone
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-display font-bold text-charcoal">SCM Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-stone-500 font-medium">
              {adminUser ? `Welcome, ${adminUser.name || 'Admin'}` : 'Admin'}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-stone-50 p-6">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
