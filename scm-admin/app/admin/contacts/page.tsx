'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Check, CheckCheck, CheckCircle, Eye, Inbox, Info, Mail, MailOpen, MessageSquare, Phone, Reply, RotateCcw, RotateCw, Search, X } from 'lucide-react';

interface Contact {
  _id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  subject?: string;
  message: string;
  status: 'New' | 'Read' | 'Replied';
  createdAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'Read' | 'Replied'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Inquiry for Modal
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const fetchContacts = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const res = await fetch('/api/admin/contacts', { cache: 'no-store' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to fetch inquiries');
      }
      const data = await res.json();
      setContacts(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      console.error(err);
      if (isInitial) setError(err.message || 'Could not load messages');
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(true);
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'New' | 'Read' | 'Replied') => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const updated = await res.json();
      if (!res.ok) {
        throw new Error(updated.message || 'Failed to update status');
      }

      setContacts(prev =>
        prev.map(c => (c._id === id ? { ...c, status: newStatus } : c))
      );

      if (selectedContact && selectedContact._id === id) {
        setSelectedContact(prev => (prev ? { ...prev, status: newStatus } : null));
      }

      const statusLabel = newStatus === 'Replied' ? 'Resolved / Replied' : newStatus;
      showToast(`Inquiry marked as ${statusLabel}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Error updating status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filter calculations
  const filteredContacts = contacts.filter(c => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const name = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
      const email = (c.email || '').toLowerCase();
      const phone = (c.phone || '').toLowerCase();
      const subject = (c.subject || '').toLowerCase();
      const msg = (c.message || '').toLowerCase();
      return (
        name.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        subject.includes(q) ||
        msg.includes(q)
      );
    }
    return true;
  });

  const newCount = contacts.filter(c => c.status === 'New').length;
  const readCount = contacts.filter(c => c.status === 'Read').length;
  const repliedCount = contacts.filter(c => c.status === 'Replied').length;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl font-medium text-white shadow-2xl flex items-center gap-3 transition-all ${
            toast.type === 'success' ? 'bg-brand-green' : toast.type === 'error' ? 'bg-brand-red' : 'bg-saffron'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle size={18} />
          ) : toast.type === 'error' ? (
            <AlertCircle size={18} />
          ) : (
            <Info size={18} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-saffron/10 text-saffron flex items-center justify-center">
              <Mail size={16} />
            </span>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal">
              Customer Inquiries
            </h1>
          </div>
          <p className="text-sm text-brown mt-1">
            Review customer support inquiries, feedback, and mark items as resolved.
          </p>
        </div>

        <button
          onClick={() => fetchContacts(true)}
          className="inline-flex items-center justify-center gap-2 bg-cream-dark hover:bg-cream-mid text-charcoal px-4 py-2 rounded-xl font-semibold text-xs transition-all shrink-0"
        >
          <RotateCw size={16} /> Refresh List
        </button>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-cream-mid/60 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-brown uppercase tracking-wider">Total Messages</div>
            <div className="text-2xl font-bold text-charcoal mt-1">{contacts.length}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-cream-dark flex items-center justify-center text-charcoal">
            <Inbox size={16} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-cream-mid/60 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-brown uppercase tracking-wider">New (Unread)</div>
            <div className="text-2xl font-bold text-saffron mt-1">{newCount}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center text-saffron">
            <MailOpen size={16} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-cream-mid/60 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-brown uppercase tracking-wider">In Review (Read)</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">{readCount}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Eye size={16} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-cream-mid/60 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-brown uppercase tracking-wider">Resolved</div>
            <div className="text-2xl font-bold text-brand-green mt-1">{repliedCount}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
            <CheckCheck size={16} />
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Status Filters */}
      <div className="bg-white p-4 rounded-xl border border-cream-mid/60 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {(['All', 'New', 'Read', 'Replied'] as const).map(tab => {
            const isActiveTab = statusFilter === tab;
            const label = tab === 'Replied' ? 'Resolved / Replied' : tab;
            const count =
              tab === 'New'
                ? newCount
                : tab === 'Read'
                ? readCount
                : tab === 'Replied'
                ? repliedCount
                : contacts.length;

            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActiveTab
                    ? 'bg-charcoal text-white shadow-sm'
                    : 'bg-cream-dark/60 text-charcoal hover:bg-cream-mid/50'
                }`}
              >
                <span>{label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActiveTab
                      ? 'bg-white/20 text-white'
                      : 'bg-cream-mid/80 text-brown'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Box */}
        <div className="relative min-w-[260px]">
          <Search size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown" />
          <input
            type="text"
            placeholder="Search sender, email, subject..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-sm bg-gray-50 border border-cream-mid rounded-lg focus:outline-none focus:border-saffron focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Main Inquiries Table */}
      <div className="bg-white rounded-xl border border-cream-mid/60 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-brown">
            <div className="w-10 h-10 border-4 border-cream-mid border-t-saffron rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm font-medium">Loading customer inquiries...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-brand-red">
            <AlertCircle size={30} className="mb-2" />
            <p className="font-semibold">{error}</p>
            <button
              onClick={() => fetchContacts(true)}
              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-saffron hover:underline"
            >
              <RotateCw size={16} /> Try Again
            </button>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-cream-dark flex items-center justify-center text-brown text-2xl mx-auto mb-3">
              <MailOpen size={16} />
            </div>
            <h3 className="font-display font-semibold text-lg text-charcoal">No Inquiries Found</h3>
            <p className="text-sm text-brown mt-1 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'All'
                ? 'No messages match your selected search/status filter.'
                : 'Customer inquiries submitted via the Contact form will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream/70 border-b border-cream-mid/60 text-xs font-bold text-brown uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Subject &amp; Message</th>
                  <th className="px-5 py-3.5">Date Received</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark/60">
                {filteredContacts.map(c => {
                  const fullName = `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Anonymous User';
                  const initials = fullName
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2) || 'C';

                  return (
                    <tr
                      key={c._id}
                      className={`hover:bg-cream/30 transition-colors ${
                        c.status === 'New' ? 'bg-saffron/5 font-medium' : ''
                      }`}
                    >
                      {/* Customer Info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-saffron to-gold text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-charcoal text-sm">{fullName}</div>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-brown">
                              {c.email && (
                                <a
                                  href={`mailto:${c.email}`}
                                  className="hover:text-brand-red flex items-center gap-1 transition-colors"
                                  title="Send Email"
                                >
                                  <Mail size={16} className="text-[10px]" />
                                  <span>{c.email}</span>
                                </a>
                              )}
                              {c.phone && (
                                <a
                                  href={`tel:${c.phone}`}
                                  className="hover:text-brand-red flex items-center gap-1 transition-colors"
                                  title="Call Phone"
                                >
                                  <Phone size={16} className="text-[10px]" />
                                  <span>{c.phone}</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Subject & Message snippet */}
                      <td className="px-5 py-4 max-w-md">
                        {c.subject && (
                          <div className="font-bold text-charcoal text-xs mb-0.5 line-clamp-1">
                            {c.subject}
                          </div>
                        )}
                        <p className="text-xs text-brown line-clamp-2 leading-relaxed">
                          {c.message}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-brown font-medium">
                        {formatDate(c.createdAt)}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {c.status === 'New' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-saffron/10 text-saffron">
                            <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse"></span>
                            New
                          </span>
                        ) : c.status === 'Read' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            Read
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-brand-green/10 text-brand-green">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-green"></span>
                            Resolved
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {/* Quick Resolve Button */}
                          {c.status !== 'Replied' ? (
                            <button
                              onClick={() => handleUpdateStatus(c._id, 'Replied')}
                              disabled={updatingId === c._id}
                              className="inline-flex items-center gap-1 bg-brand-green/10 hover:bg-brand-green text-brand-green hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                              title="Mark as Resolved / Replied"
                            >
                              <Check size={16} className="text-[11px]" />
                              <span>Resolve</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateStatus(c._id, 'New')}
                              disabled={updatingId === c._id}
                              className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1.5 rounded-lg text-xs font-medium transition-all"
                              title="Reopen inquiry"
                            >
                              <RotateCcw size={16} className="text-[10px]" />
                              <span>Reopen</span>
                            </button>
                          )}

                          {/* View details */}
                          <button
                            onClick={() => {
                              setSelectedContact(c);
                              if (c.status === 'New') {
                                handleUpdateStatus(c._id, 'Read');
                              }
                            }}
                            className="bg-cream-dark hover:bg-cream-mid text-charcoal px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <Eye size={16} className="mr-1" /> View
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

      {/* Inquiry Detail Modal */}
      {selectedContact && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={e => {
            if (e.target === e.currentTarget) setSelectedContact(null);
          }}
        >
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-cream-mid my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-cream-dark">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-saffron/10 text-saffron flex items-center justify-center font-bold">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-charcoal">
                    {selectedContact.subject || 'Customer Inquiry'}
                  </h2>
                  <p className="text-xs text-brown">{formatDate(selectedContact.createdAt)}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-gray-400 hover:text-charcoal p-1 text-lg"
              >
                <X size={16} />
              </button>
            </div>

            {/* Sender Info Card */}
            <div className="my-4 bg-cream/60 p-4 rounded-xl border border-cream-mid/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-brown uppercase tracking-wider">Sender</div>
                <div className="font-bold text-charcoal text-sm mt-0.5">
                  {selectedContact.firstName} {selectedContact.lastName || ''}
                </div>
                <div className="text-xs text-brown mt-1 space-y-0.5">
                  {selectedContact.email && (
                    <div>
                      <Mail size={16} className="text-[10px] mr-1 text-saffron" />
                      {selectedContact.email}
                    </div>
                  )}
                  {selectedContact.phone && (
                    <div>
                      <Phone size={16} className="text-[10px] mr-1 text-saffron" />
                      {selectedContact.phone}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Pill */}
              <div>
                <span className="text-xs font-bold text-brown uppercase tracking-wider block mb-1">
                  Status
                </span>
                {selectedContact.status === 'New' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-saffron/10 text-saffron">
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron"></span>
                    New
                  </span>
                ) : selectedContact.status === 'Read' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Read
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-green/10 text-brand-green">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green"></span>
                    Resolved / Replied
                  </span>
                )}
              </div>
            </div>

            {/* Message Body */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-brown uppercase tracking-wider mb-2">
                Message Content
              </label>
              <div className="p-4 bg-gray-50 rounded-xl border border-cream-mid text-sm text-charcoal whitespace-pre-wrap leading-relaxed">
                {selectedContact.message}
              </div>
            </div>

            {/* Quick Resolution Controls */}
            <div className="pt-4 border-t border-cream-dark flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Change Status Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-brown mr-1">Mark as:</span>
                <button
                  onClick={() => handleUpdateStatus(selectedContact._id, 'New')}
                  disabled={updatingId === selectedContact._id || selectedContact.status === 'New'}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                    selectedContact.status === 'New'
                      ? 'bg-saffron text-white'
                      : 'bg-cream-dark hover:bg-cream-mid text-charcoal'
                  }`}
                >
                  New
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedContact._id, 'Read')}
                  disabled={updatingId === selectedContact._id || selectedContact.status === 'Read'}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                    selectedContact.status === 'Read'
                      ? 'bg-blue-600 text-white'
                      : 'bg-cream-dark hover:bg-cream-mid text-charcoal'
                  }`}
                >
                  Read
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedContact._id, 'Replied')}
                  disabled={updatingId === selectedContact._id || selectedContact.status === 'Replied'}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                    selectedContact.status === 'Replied'
                      ? 'bg-brand-green text-white'
                      : 'bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-white'
                  }`}
                >
                  <Check size={16} className="mr-1" /> Resolved
                </button>
              </div>

              {/* Action: Reply via Email */}
              {selectedContact.email && (
                <a
                  href={`mailto:${selectedContact.email}?subject=${encodeURIComponent(
                    `Re: ${selectedContact.subject || 'Your inquiry to Sunil Choudhary Masala'}`
                  )}`}
                  className="inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Reply size={16} /> Reply via Email
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
