'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, Check, CheckCircle, EyeOff, Info, Loader2, MessageSquareOff, Search, Star, Trash2, XCircle } from 'lucide-react';

interface Review {
  _id: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  product?: {
    _id: string;
    name: string;
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToastMsg = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reviews', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await res.json();
      setReviews(data || []);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleApproval = async (reviewId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: !currentStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update approval status');
      }

      setReviews(prev =>
        prev.map(r => (r._id === reviewId ? { ...r, isApproved: !currentStatus } : r))
      );
      showToastMsg(`Review ${!currentStatus ? 'approved' : 'hidden'} successfully`, 'success');
    } catch (err: any) {
      showToastMsg(err.message || 'Error updating review', 'error');
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review permanently?')) return;
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete review');
      }

      setReviews(prev => prev.filter(r => r._id !== reviewId));
      showToastMsg('Review deleted successfully', 'success');
    } catch (err: any) {
      showToastMsg(err.message || 'Error deleting review', 'error');
    }
  };

  const filterButtons = ['All', 'Pending', 'Approved'];

  const filteredReviews = reviews.filter(r => {
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Approved' && r.isApproved) ||
      (statusFilter === 'Pending' && !r.isApproved);
      
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (r.comment && r.comment.toLowerCase().includes(q)) ||
      (r.user?.firstName && r.user.firstName.toLowerCase().includes(q)) ||
      (r.user?.lastName && r.user.lastName.toLowerCase().includes(q)) ||
      (r.product?.name && r.product.name.toLowerCase().includes(q));
      
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Notification */}
      {toast && (
        <div
          id="scm-toast"
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            zIndex: 9999,
            padding: '13px 20px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#fff',
            boxShadow: '0 6px 20px rgba(0,0,0,.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor:
              toast.type === 'success' ? '#2A6B4A' : toast.type === 'error' ? '#B5390A' : '#0E82E8',
          }}
        >
          {toast.type === 'success' ? (
            <CheckCircle size={18} />
          ) : toast.type === 'error' ? (
            <XCircle size={18} />
          ) : (
            <Info size={18} />
          )}
          {toast.message}
        </div>
      )}

      {/* Header Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal">Reviews</h1>
          <p className="text-sm text-brown mt-1">
            Manage customer reviews, approve testimonials, and maintain quality
          </p>
        </div>
      </div>

      {/* Search & Status Filters Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-cream-dark shadow-sm">
        {/* Status Filter Buttons */}
        <div id="statusFilters" className="flex flex-wrap items-center gap-2">
          {filterButtons.map(status => {
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`btn btn-sm ${
                  isActive
                    ? 'btn-primary active-filter !bg-brand-red !text-white'
                    : 'btn-secondary'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <Search size={16} />
          <input
            id="revSearch"
            type="text"
            placeholder="Search reviews, products, users..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full md:w-64"
          />
        </div>
      </div>

      {/* Reviews Table Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">All Reviews ({filteredReviews.length})</div>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="p-8 text-center text-brown">
              <Loader2 size={24} className="mb-2 text-saffron block animate-spin" />
              Loading reviews...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red">
              <AlertCircle size={24} className="mb-2 block" />
              {error}
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="p-8 text-center text-brown">
              <MessageSquareOff size={30} className="mb-2 text-cream-mid block" />
              No reviews found
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Customer</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.map(r => (
                    <tr key={r._id}>
                      <td>
                        <strong>{r.product?.name || '—'}</strong>
                      </td>
                      <td>
                        <div className="font-semibold text-charcoal">
                          {r.user?.firstName || '—'} {r.user?.lastName || ''}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--brown)' }}>
                          {r.user?.email || ''}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-0.5 text-saffron" style={{ fontSize: '13px' }}>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className={i < r.rating ? 'fill-saffron' : ''} />
                          ))}
                        </div>
                      </td>
                      <td>
                        <div style={{ maxWidth: '250px', whiteSpace: 'normal', fontSize: '13px', lineHeight: '1.4' }}>
                          {r.comment}
                        </div>
                      </td>
                      <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${r.isApproved ? 'badge-green' : 'badge-orange'}`}>
                          {r.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            className={`btn btn-sm ${r.isApproved ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={() => toggleApproval(r._id, r.isApproved)}
                            title={r.isApproved ? 'Hide Review' : 'Approve Review'}
                          >
                            {r.isApproved ? <EyeOff size={14} /> : <Check size={14} />}
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            style={{ color: 'var(--red)' }}
                            onClick={() => deleteReview(r._id)}
                            title="Delete Review"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
