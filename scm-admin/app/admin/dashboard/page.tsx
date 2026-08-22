'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Boxes, IndianRupee, PackageCheck, PackageOpen, PieChart, ShoppingBag, Truck, Users, UsersRound } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [analyticsRes, ordersRes, productsRes, usersRes] = await Promise.allSettled([
          fetch('/api/admin/analytics?range=all'),
          fetch('/api/admin/orders'),
          fetch('/api/admin/products'),
          fetch('/api/admin/users'),
        ]);

        let analyticsData = null;
        let ordersData: any[] = [];
        let productsData: any[] = [];
        let usersData: any[] = [];

        if (analyticsRes.status === 'fulfilled' && analyticsRes.value.ok) {
          analyticsData = await analyticsRes.value.json().catch(() => null);
        }
        if (ordersRes.status === 'fulfilled' && ordersRes.value.ok) {
          const d = await ordersRes.value.json().catch(() => []);
          ordersData = Array.isArray(d) ? d : d.orders || [];
        }
        if (productsRes.status === 'fulfilled' && productsRes.value.ok) {
          const d = await productsRes.value.json().catch(() => []);
          productsData = Array.isArray(d) ? d : d.products || [];
        }
        if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
          const d = await usersRes.value.json().catch(() => []);
          usersData = Array.isArray(d) ? d : d.users || [];
        }

        const totalRevenue = analyticsData?.totalRevenue ?? ordersData
          .filter((o: any) => o.paymentStatus === 'Paid')
          .reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);

        setStats({
          totalRevenue,
          totalOrders: ordersData.length,
          processingOrders: ordersData.filter((o: any) => o.orderStatus === 'Processing').length,
          totalProducts: productsData.length,
          totalCustomers: usersData.length,
          recentOrders: ordersData.slice(0, 5),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const formatPrice = (n: number = 0) => '₹' + Number(n).toLocaleString('en-IN');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-charcoal via-stone-900 to-brand-red text-white p-8 rounded-3xl shadow-lg border border-stone-800 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 bg-saffron/20 text-saffron font-bold text-xs rounded-full border border-saffron/30 uppercase tracking-wider">
            SCM Operations Hub
          </span>
          <h2 className="text-3xl font-display font-bold mt-3 text-white">
            Welcome to Admin Command Center
          </h2>
          <p className="text-stone-300 text-sm mt-2 leading-relaxed">
            Monitor real-time sales, manage Rajasthani spice catalog, fulfill customer orders, and supervise account privileges from one centralized dashboard.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link
              href="/admin/products"
              className="px-4 py-2.5 bg-brand-red hover:bg-brand-red-dark text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-2"
            >
              <Boxes size={16} />
              <span>Manage Products</span>
            </Link>
            <Link
              href="/admin/customers"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Users size={16} />
              <span>View Customers</span>
            </Link>
            <Link
              href="/admin/orders"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-2"
            >
              <ShoppingBag size={16} />
              <span>Order Dispatch</span>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-saffron/10 to-transparent pointer-events-none"></div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center text-xl shrink-0">
            <IndianRupee size={16} />
          </div>
          <div>
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Sales</div>
            <div className="text-2xl font-bold text-charcoal">
              {loading ? '—' : formatPrice(stats?.totalRevenue)}
            </div>
            <div className="text-xs text-emerald-600 font-medium mt-0.5">Paid transactions</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-saffron/10 text-saffron flex items-center justify-center text-xl shrink-0">
            <PackageOpen size={16} />
          </div>
          <div>
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Catalog Items</div>
            <div className="text-2xl font-bold text-charcoal">
              {loading ? '—' : stats?.totalProducts ?? 0}
            </div>
            <Link href="/admin/products" className="text-xs text-saffron hover:underline font-medium mt-0.5 block">
              Manage inventory →
            </Link>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-xl shrink-0">
            <Users size={16} />
          </div>
          <div>
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Registered Clients</div>
            <div className="text-2xl font-bold text-charcoal">
              {loading ? '—' : stats?.totalCustomers ?? 0}
            </div>
            <Link href="/admin/customers" className="text-xs text-blue-600 hover:underline font-medium mt-0.5 block">
              View customer list →
            </Link>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl shrink-0">
            <Truck size={16} />
          </div>
          <div>
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Pending Dispatch</div>
            <div className="text-2xl font-bold text-amber-600">
              {loading ? '—' : stats?.processingOrders ?? 0}
            </div>
            <Link href="/admin/orders" className="text-xs text-amber-600 hover:underline font-medium mt-0.5 block">
              Process orders →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center text-lg">
            <PackageCheck size={16} />
          </div>
          <h3 className="font-bold text-charcoal text-base font-display">Products &amp; Inventory</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Create spice blends, configure gram weights, update MRPs, and manage stock quantities.
          </p>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-red hover:underline pt-2"
          >
            <span>Open Products Management</span>
            <ArrowRight size={16} className="text-[10px]" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-saffron/10 text-saffron flex items-center justify-center text-lg">
            <UsersRound size={16} />
          </div>
          <h3 className="font-bold text-charcoal text-base font-display">Customer Accounts</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            View customer details, analyze customer spending patterns, and manage block/unblock access.
          </p>
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron hover:underline pt-2"
          >
            <span>Open Customer Directory</span>
            <ArrowRight size={16} className="text-[10px]" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-stone-100 text-charcoal flex items-center justify-center text-lg">
            <PieChart size={16} />
          </div>
          <h3 className="font-bold text-charcoal text-base font-display">Revenue Analytics</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Track daily sales velocity, top performing masalas, category trends, and buyer retention.
          </p>
          <Link
            href="/admin/analytics"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal hover:underline pt-2"
          >
            <span>Open Analytics Dashboard</span>
            <ArrowRight size={16} className="text-[10px]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
