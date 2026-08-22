'use client';

import { useState, useEffect, useMemo } from 'react';
import { AlertCircle, AlertTriangle, Ban, CheckCircle, Eye, Loader2, Mail, MapPin, Phone, RefreshCw, Search, Unlock, UserCheck, UserX, Users, UsersRound, Wallet, X, XCircle } from 'lucide-react';

interface Address {
  _id?: string;
  label?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
  isDefault?: boolean;
}

interface Customer {
  _id: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  isBlocked?: boolean;
  orderCount?: number;
  totalSpent?: number;
  addresses?: Address[];
  createdAt?: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Active' | 'Blocked'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'orders' | 'spent' | 'name'

  // Selected customer for detail drawer/modal
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/users', { cache: 'no-store' });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to fetch customers');
      }
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : data.users || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleBlock = async (customer: Customer) => {
    const newBlockedState = !customer.isBlocked;
    setActionLoadingId(customer._id);
    try {
      const res = await fetch(`/api/admin/users/${customer._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBlocked: newBlockedState }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to update customer status');
      }

      setCustomers((prev) =>
        prev.map((c) => (c._id === customer._id ? { ...c, isBlocked: newBlockedState } : c))
      );

      if (selectedCustomer && selectedCustomer._id === customer._id) {
        setSelectedCustomer((prev) => (prev ? { ...prev, isBlocked: newBlockedState } : null));
      }

      showToast(
        `Customer ${customer.firstName} ${newBlockedState ? 'blocked' : 'unblocked'} successfully`,
        newBlockedState ? 'error' : 'success'
      );
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // KPI Stats
  const stats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => !c.isBlocked).length;
    const blocked = customers.filter((c) => c.isBlocked).length;
    const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
    const totalOrders = customers.reduce((sum, c) => sum + (c.orderCount || 0), 0);

    return { total, active, blocked, totalRevenue, totalOrders };
  }, [customers]);

  // Filtered & Sorted Customers
  const filteredCustomers = useMemo(() => {
    return customers
      .filter((customer) => {
        const q = searchQuery.toLowerCase().trim();
        const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.toLowerCase();
        const email = (customer.email || '').toLowerCase();
        const phone = customer.phone || '';

        const matchesSearch = !q || fullName.includes(q) || email.includes(q) || phone.includes(q);

        let matchesStatus = true;
        if (statusFilter === 'Active') matchesStatus = !customer.isBlocked;
        else if (statusFilter === 'Blocked') matchesStatus = !!customer.isBlocked;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'orders') return (b.orderCount || 0) - (a.orderCount || 0);
        if (sortBy === 'spent') return (b.totalSpent || 0) - (a.totalSpent || 0);
        if (sortBy === 'name') {
          const nameA = `${a.firstName} ${a.lastName || ''}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName || ''}`.toLowerCase();
          return nameA.localeCompare(nameB);
        }
        // Newest default
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [customers, searchQuery, statusFilter, sortBy]);

  const formatPrice = (amount: number = 0) => {
    return '₹' + Number(amount).toLocaleString('en-IN');
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getInitials = (first: string = '', last: string = '') => {
    const f = first.trim()[0] || 'C';
    const l = last.trim()[0] || '';
    return (f + l).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-2xl text-white font-medium flex items-center gap-3 transition-all duration-300 transform translate-y-0 ${
            toast.type === 'success' ? 'bg-brand-green' : 'bg-brand-red'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-saffron/10 text-saffron rounded-lg">
              <UsersRound size={18} />
            </span>
            <h1 className="text-2xl font-bold text-charcoal font-display">Customer Management</h1>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            Directory of registered clients, order frequency, total lifetime spend &amp; account permissions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCustomers}
            className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-charcoal transition-colors text-sm font-semibold flex items-center gap-2"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200/70 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-saffron/10 text-saffron flex items-center justify-center text-xl shrink-0">
            <Users size={16} />
          </div>
          <div>
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Total Customers
            </div>
            <div className="text-2xl font-bold text-charcoal">{stats.total}</div>
            <div className="text-xs text-stone-400 mt-0.5">{stats.totalOrders} Lifetime Orders</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200/70 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center text-xl shrink-0">
            <UserCheck size={16} />
          </div>
          <div>
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Active Accounts
            </div>
            <div className="text-2xl font-bold text-emerald-700">{stats.active}</div>
            <div className="text-xs text-emerald-600 font-medium mt-0.5">Permitted to order</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200/70 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center text-xl shrink-0">
            <UserX size={16} />
          </div>
          <div>
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Blocked Accounts
            </div>
            <div className="text-2xl font-bold text-brand-red">{stats.blocked}</div>
            <div className="text-xs text-stone-400 mt-0.5">Restricted from store</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200/70 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center text-xl shrink-0">
            <Wallet size={16} />
          </div>
          <div>
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Total Customer Value
            </div>
            <div className="text-2xl font-bold text-charcoal">{formatPrice(stats.totalRevenue)}</div>
            <div className="text-xs text-stone-400 mt-0.5">Paid order revenue</div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search customers by name, email, or mobile number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40 focus:border-saffron transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
            >
              <XCircle size={16} />
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status filter */}
          <div className="flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs">
            {['All', 'Active', 'Blocked'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  statusFilter === status
                    ? 'bg-white text-charcoal shadow-sm'
                    : 'text-stone-600 hover:text-charcoal'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 focus:outline-none focus:border-saffron cursor-pointer"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="spent">Sort: Highest Total Spent</option>
            <option value="orders">Sort: Most Orders</option>
            <option value="name">Sort: Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Main Customers Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-red"></div>
            <p className="text-sm text-stone-500 font-medium">Fetching customer directory...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 text-brand-red mx-auto flex items-center justify-center text-xl mb-3">
              <AlertTriangle size={16} />
            </div>
            <h3 className="text-lg font-bold text-charcoal mb-1">Failed to load customer list</h3>
            <p className="text-sm text-stone-500 mb-4">{error}</p>
            <button
              onClick={fetchCustomers}
              className="px-4 py-2 bg-brand-red text-white text-sm rounded-lg hover:bg-brand-red/90 transition-colors font-semibold"
            >
              Try Again
            </button>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-20 text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-saffron/10 text-saffron mx-auto flex items-center justify-center text-2xl mb-4">
              <UserX size={16} />
            </div>
            <h3 className="text-lg font-bold text-charcoal mb-1">No customers found</h3>
            <p className="text-sm text-stone-500 max-w-md mx-auto">
              {searchQuery || statusFilter !== 'All'
                ? 'Try adjusting your search criteria or filter options.'
                : 'No customer accounts registered yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-[12px] uppercase tracking-wider text-stone-500 font-semibold">
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-4">Contact Info</th>
                  <th className="py-4 px-4 text-center">Orders</th>
                  <th className="py-4 px-4">Total Spent</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4">Member Since</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {filteredCustomers.map((customer) => {
                  const isBlocked = !!customer.isBlocked;
                  const isActing = actionLoadingId === customer._id;
                  const fullName = `${customer.firstName} ${customer.lastName || ''}`.trim();
                  const initials = getInitials(customer.firstName, customer.lastName);

                  return (
                    <tr
                      key={customer._id}
                      className={`hover:bg-amber-50/30 transition-colors duration-150 group ${
                        isBlocked ? 'bg-stone-50/60 opacity-80' : ''
                      }`}
                    >
                      {/* Name & Avatar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-charcoal to-brown text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-charcoal group-hover:text-brand-red transition-colors flex items-center gap-2">
                              <span>{fullName || 'Anonymous Customer'}</span>
                              {isBlocked && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
                                  BLOCKED
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-stone-400">ID: {customer._id.slice(-6)}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          {customer.email ? (
                            <div className="text-stone-700 flex items-center gap-1.5 text-xs truncate max-w-[200px]">
                              <Mail size={16} className="text-stone-400 text-[11px]" />
                              <a
                                href={`mailto:${customer.email}`}
                                className="hover:text-saffron transition-colors"
                              >
                                {customer.email}
                              </a>
                            </div>
                          ) : (
                            <div className="text-stone-400 text-xs italic">No email linked</div>
                          )}

                          {customer.phone ? (
                            <div className="text-stone-700 flex items-center gap-1.5 text-xs">
                              <Phone size={16} className="text-stone-400 text-[11px]" />
                              <span>{customer.phone}</span>
                            </div>
                          ) : (
                            <div className="text-stone-400 text-xs italic">No phone linked</div>
                          )}
                        </div>
                      </td>

                      {/* Orders Count */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            (customer.orderCount || 0) > 0
                              ? 'bg-saffron/10 text-saffron border border-saffron/30'
                              : 'bg-stone-100 text-stone-500'
                          }`}
                        >
                          {customer.orderCount || 0} {customer.orderCount === 1 ? 'Order' : 'Orders'}
                        </span>
                      </td>

                      {/* Total Spent */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-charcoal">
                          {formatPrice(customer.totalSpent)}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            isBlocked
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isBlocked ? 'bg-red-600' : 'bg-emerald-600'
                            }`}
                          ></span>
                          {isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>

                      {/* Member Since */}
                      <td className="py-4 px-4 text-xs text-stone-500">
                        {formatDate(customer.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedCustomer(customer)}
                            className="px-2.5 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-charcoal hover:bg-stone-50 transition-colors text-xs font-medium"
                            title="View Customer Profile"
                          >
                            <Eye size={16} className="mr-1" /> Details
                          </button>

                          <button
                            onClick={() => handleToggleBlock(customer)}
                            disabled={isActing}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                              isBlocked
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                                : 'bg-red-50 text-brand-red border border-red-200 hover:bg-red-100'
                            }`}
                            title={isBlocked ? 'Unblock customer account' : 'Block customer account'}
                          >
                            {isActing ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : isBlocked ? (
                              <>
                                <Unlock size={16} className="text-[11px]" />
                                <span>Unblock</span>
                              </>
                            ) : (
                              <>
                                <Ban size={16} className="text-[11px]" />
                                <span>Block</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Details Modal / Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-charcoal to-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-red to-saffron text-white flex items-center justify-center font-bold text-xl shadow-md border-2 border-white/20">
                  {getInitials(selectedCustomer.firstName, selectedCustomer.lastName)}
                </div>
                <div>
                  <h3 className="font-bold text-xl font-display text-white">
                    {selectedCustomer.firstName} {selectedCustomer.lastName || ''}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-stone-300">
                    <span>Customer ID: {selectedCustomer._id}</span>
                    <span>•</span>
                    <span>Joined: {formatDate(selectedCustomer.createdAt)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-8 h-8 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Account Quick Status */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-center">
                  <div className="text-xs text-stone-500 font-semibold uppercase">Total Orders</div>
                  <div className="text-xl font-bold text-charcoal mt-0.5">
                    {selectedCustomer.orderCount || 0}
                  </div>
                </div>
                <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-center">
                  <div className="text-xs text-stone-500 font-semibold uppercase">Total Spend</div>
                  <div className="text-xl font-bold text-brand-red mt-0.5">
                    {formatPrice(selectedCustomer.totalSpent)}
                  </div>
                </div>
                <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-center">
                  <div className="text-xs text-stone-500 font-semibold uppercase">Access Status</div>
                  <div
                    className={`text-sm font-bold mt-1 inline-block px-2.5 py-0.5 rounded-full ${
                      selectedCustomer.isBlocked
                        ? 'bg-red-100 text-brand-red'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {selectedCustomer.isBlocked ? 'Blocked' : 'Active'}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border border-stone-200 rounded-xl p-4 bg-white space-y-3">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-stone-400">Email Address</div>
                    <div className="font-semibold text-charcoal mt-0.5">
                      {selectedCustomer.email || '—'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-stone-400">Phone Number</div>
                    <div className="font-semibold text-charcoal mt-0.5">
                      {selectedCustomer.phone || '—'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Saved Delivery Addresses */}
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Saved Addresses ({selectedCustomer.addresses?.length || 0})
                  </h4>
                </div>

                {selectedCustomer.addresses && selectedCustomer.addresses.length > 0 ? (
                  <div className="space-y-2.5">
                    {selectedCustomer.addresses.map((addr, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3 rounded-lg border border-stone-200 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-bold text-charcoal">
                          <span className="flex items-center gap-1.5">
                            <MapPin size={16} className="text-saffron" />
                            {addr.label || 'Home Address'}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-saffron/10 text-saffron px-2 py-0.5 rounded font-bold">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-stone-600">
                          {addr.addressLine1}
                          {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                        </div>
                        <div className="text-stone-500">
                          {addr.city}, {addr.state} - {addr.pincode}
                        </div>
                        {addr.phone && (
                          <div className="text-stone-400 text-[11px]">Phone: {addr.phone}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-400 italic">No saved delivery addresses yet.</p>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Close
              </button>

              <button
                onClick={() => handleToggleBlock(selectedCustomer)}
                disabled={actionLoadingId === selectedCustomer._id}
                className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-2 ${
                  selectedCustomer.isBlocked
                    ? 'bg-brand-green text-white hover:bg-emerald-800'
                    : 'bg-brand-red text-white hover:bg-red-800'
                }`}
              >
                {actionLoadingId === selectedCustomer._id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : selectedCustomer.isBlocked ? (
                  <>
                    <Unlock size={16} />
                    <span>Unblock Customer</span>
                  </>
                ) : (
                  <>
                    <Ban size={16} />
                    <span>Block Customer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
