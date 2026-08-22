'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Eye, Info, Loader2, MapPin, PackageOpen, Save, Search, X, XCircle } from 'lucide-react';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
}

interface OrderUser {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}

interface Order {
  _id: string;
  orderId: string;
  user?: OrderUser;
  items?: OrderItem[];
  totalAmount: number;
  subtotal?: number;
  shippingCharge?: number;
  discount?: number;
  couponCode?: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  refundStatus?: string;
  trackingNumber?: string;
  shippingAddress?: ShippingAddress;
  createdAt: string;
  razorpayRefundId?: string;
  refundAmount?: number;
  refundInitiatedAt?: string;
  refundProcessedAt?: string;
  refundFailureReason?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('Processing');
  const [trackingNum, setTrackingNum] = useState<string>('');
  const [updating, setUpdating] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToastMsg = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const fetchOrders = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to fetch orders');
      }
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : data.orders || []);
      setError(null);
    } catch (err: any) {
      console.error(err);
      if (isInitial) setError(err.message || 'Failed to load orders');
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(true);
  }, []);

  // Auto-refresh order list every 30s (skips when modal is open)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!modalOpen) {
        fetchOrders(false);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [modalOpen]);

  const formatPrice = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN');
  const formatDate = (d: string) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const statusBadgeClass = (status: string) => {
    const map: Record<string, string> = {
      Processing: 'badge-orange',
      Confirmed: 'badge-blue',
      Packed: 'badge-blue',
      Shipped: 'badge-blue',
      'Out for Delivery': 'badge-blue',
      Delivered: 'badge-green',
      Cancelled: 'badge-red',
      Paid: 'badge-green',
      Pending: 'badge-orange',
      Failed: 'badge-red',
      New: 'badge-orange',
      Read: 'badge-blue',
      Replied: 'badge-green',
    };
    return map[status] || 'badge-grey';
  };

  const openOrderModal = (o: Order) => {
    setSelectedOrder(o);
    setNewStatus(o.orderStatus || 'Processing');
    setTrackingNum(o.trackingNumber || '');
    setModalOpen(true);
  };

  const closeOrderModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    if (selectedOrder.orderStatus === 'Cancelled' && newStatus !== 'Cancelled') {
      showToastMsg('Cancelled orders cannot be changed to another status', 'error');
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber: trackingNum,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update status');
      }

      setOrders(prev =>
        prev.map(item =>
          item._id === selectedOrder._id
            ? {
                ...item,
                orderStatus: data.orderStatus || newStatus,
                refundStatus: data.refundStatus || item.refundStatus,
                trackingNumber: trackingNum,
              }
            : item
        )
      );

      setSelectedOrder(prev =>
        prev
          ? {
              ...prev,
              orderStatus: data.orderStatus || newStatus,
              refundStatus: data.refundStatus || prev.refundStatus,
              trackingNumber: trackingNum,
            }
          : null
      );

      showToastMsg(`Order status updated to ${newStatus}`, 'success');
      closeOrderModal();
    } catch (err: any) {
      console.error(err);
      showToastMsg(err.message || 'Failed to update status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const filterButtons = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter(o => {
    const matchesStatus =
      statusFilter === 'All' || !statusFilter || o.orderStatus === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (o.orderId && o.orderId.toLowerCase().includes(q)) ||
      (o.user?.firstName && o.user.firstName.toLowerCase().includes(q)) ||
      (o.user?.lastName && o.user.lastName.toLowerCase().includes(q)) ||
      (o.user?.phone && o.user.phone.toLowerCase().includes(q));
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
          <h1 className="font-display text-2xl font-bold text-charcoal">Orders</h1>
          <p className="text-sm text-brown mt-1">
            Manage customer orders, track status &amp; view details
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
            id="ordSearch"
            type="text"
            placeholder="Search order ID, customer..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full md:w-64"
          />
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">All Orders ({filteredOrders.length})</div>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="p-8 text-center text-brown">
              <Loader2 size={24} className="mb-2 text-saffron block animate-spin" />
              Loading orders...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red">
              <AlertCircle size={24} className="mb-2 block" />
              {error}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-brown">
              <PackageOpen size={30} className="mb-2 text-cream-mid block" />
              No orders found
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(o => (
                    <tr key={o._id}>
                      <td>
                        <strong>{o.orderId}</strong>
                      </td>
                      <td>
                        <div className="font-semibold text-charcoal">
                          {o.user?.firstName || '—'} {o.user?.lastName || ''}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--brown)' }}>
                          {o.user?.phone || ''}
                        </div>
                      </td>
                      <td>{o.items?.length || 0} item(s)</td>
                      <td>
                        <strong>{formatPrice(o.totalAmount)}</strong>
                        <div style={{ fontSize: '11px', color: 'var(--brown)' }}>
                          {o.paymentMethod}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${statusBadgeClass(o.paymentStatus)}`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${statusBadgeClass(o.orderStatus)}`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td>{formatDate(o.createdAt)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => openOrderModal(o)}
                        >
                          <Eye size={16} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Details & Status Update Modal */}
      <div
        id="orderModal"
        className={`modal-overlay ${modalOpen ? 'open' : ''}`}
        onClick={e => {
          if (e.target === e.currentTarget) closeOrderModal();
        }}
      >
        {selectedOrder && (
          <div className="modal" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div id="orderModalTitle" className="modal-title">
                Order — {selectedOrder.orderId}
              </div>
              <button className="modal-close" onClick={closeOrderModal}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body" id="orderModalBody">
              {/* Customer Info & Address */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    background: 'var(--cream)',
                    borderRadius: '10px',
                    padding: '14px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      color: 'var(--brown)',
                      fontWeight: 600,
                      marginBottom: '8px',
                    }}
                  >
                    Customer Info
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    <strong>
                      {selectedOrder.user?.firstName} {selectedOrder.user?.lastName || ''}
                    </strong>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--brown)' }}>
                    {selectedOrder.user?.phone || ''}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--brown)' }}>
                    {selectedOrder.user?.email || ''}
                  </div>
                </div>

                <div
                  style={{
                    background: 'var(--cream)',
                    borderRadius: '10px',
                    padding: '14px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      color: 'var(--brown)',
                      fontWeight: 600,
                      marginBottom: '8px',
                    }}
                  >
                    Delivery Address
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--brown)', lineHeight: '1.6' }}>
                    {selectedOrder.shippingAddress?.addressLine1 || ''}{' '}
                    {selectedOrder.shippingAddress?.addressLine2 || ''}
                    <br />
                    {selectedOrder.shippingAddress?.city || ''},{' '}
                    {selectedOrder.shippingAddress?.state || ''} —{' '}
                    {selectedOrder.shippingAddress?.pincode || ''}
                  </div>
                  {selectedOrder.shippingAddress?.latitude &&
                  selectedOrder.shippingAddress?.longitude ? (
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${selectedOrder.shippingAddress.latitude}&mlon=${selectedOrder.shippingAddress.longitude}#map=16/${selectedOrder.shippingAddress.latitude}/${selectedOrder.shippingAddress.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        marginTop: '8px',
                        fontSize: '12px',
                        color: 'var(--red)',
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      <MapPin size={16} /> View Pinned Location on Map
                    </a>
                  ) : (
                    <div
                      style={{
                        marginTop: '8px',
                        fontSize: '11px',
                        color: 'var(--brown)',
                        fontStyle: 'italic',
                      }}
                    >
                      No map pin saved for this order
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div
                style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  color: 'var(--brown)',
                  fontWeight: 600,
                  marginBottom: '10px',
                }}
              >
                Order Items
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginBottom: '16px',
                }}
              >
                {(selectedOrder.items || []).map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px',
                      background: 'var(--cream)',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  >
                    <span>
                      <strong>{item.name}</strong> × {item.quantity}
                    </span>
                    <span style={{ fontWeight: 700, color: 'var(--red)' }}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div
                style={{
                  background: 'var(--cream-dark)',
                  borderRadius: '10px',
                  padding: '14px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    marginBottom: '6px',
                  }}
                >
                  <span>Subtotal</span>
                  <span>
                    {formatPrice(selectedOrder.subtotal || selectedOrder.totalAmount)}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    marginBottom: '6px',
                  }}
                >
                  <span>Shipping</span>
                  <span style={{ color: 'var(--green)' }}>
                    {selectedOrder.shippingCharge
                      ? formatPrice(selectedOrder.shippingCharge)
                      : 'FREE'}
                  </span>
                </div>
                {selectedOrder.discount ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '13px',
                      marginBottom: '6px',
                    }}
                  >
                    <span>Discount ({selectedOrder.couponCode})</span>
                    <span style={{ color: 'var(--green)' }}>
                      — {formatPrice(selectedOrder.discount)}
                    </span>
                  </div>
                ) : null}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '16px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-d)',
                    borderTop: '1px solid var(--cream-mid,#EDD9BC)',
                    paddingTop: '10px',
                    marginTop: '6px',
                  }}
                >
                  <span>Total</span>
                  <span style={{ color: 'var(--red)' }}>
                    {formatPrice(selectedOrder.totalAmount)}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    marginTop: '10px',
                    paddingTop: '8px',
                    borderTop: '1px dashed var(--cream-mid,#EDD9BC)',
                  }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--brown)' }}>Refund Status:</span>
                  <strong
                    style={{
                      color:
                        selectedOrder.refundStatus === 'Processing' || selectedOrder.refundStatus === 'Failed'
                          ? '#B5390A'
                          : '#2A6B4A',
                    }}
                  >
                    {selectedOrder.refundStatus === 'Processing'
                      ? 'Processing'
                      : selectedOrder.refundStatus === 'Failed'
                      ? 'Failed (Manual Action Needed)'
                      : selectedOrder.refundStatus || 'N/A'}
                  </strong>
                </div>
                {selectedOrder.refundStatus && selectedOrder.refundStatus !== 'NotRequired' && (
                  <div style={{ marginTop: '12px', fontSize: '13px', background: 'var(--cream-dark)', padding: '12px', borderRadius: '8px' }}>
                    {selectedOrder.refundAmount && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ color: 'var(--brown)' }}>Refund Amount:</span>
                        <strong>₹{selectedOrder.refundAmount}</strong>
                      </div>
                    )}
                    {selectedOrder.razorpayRefundId && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ color: 'var(--brown)' }}>Razorpay Refund ID:</span>
                        <span>{selectedOrder.razorpayRefundId}</span>
                      </div>
                    )}
                    {selectedOrder.refundInitiatedAt && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ color: 'var(--brown)' }}>Initiated At:</span>
                        <span>{new Date(selectedOrder.refundInitiatedAt).toLocaleString()}</span>
                      </div>
                    )}
                    {selectedOrder.refundProcessedAt && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ color: 'var(--brown)' }}>Processed At:</span>
                        <span>{new Date(selectedOrder.refundProcessedAt).toLocaleString()}</span>
                      </div>
                    )}
                    {selectedOrder.refundFailureReason && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--red)' }}>
                        <span style={{ fontWeight: 600 }}>Failure Reason:</span>
                        <span>{selectedOrder.refundFailureReason}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Status & Tracking Update Form */}
              <div
                style={{
                  background: 'var(--cream)',
                  borderRadius: '10px',
                  padding: '16px',
                  border: '1px solid var(--cream-dark)',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    color: 'var(--brown)',
                    fontWeight: 700,
                    marginBottom: '12px',
                  }}
                >
                  Update Order Status
                </div>
                {selectedOrder.orderStatus === 'Cancelled' && (
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(181, 57, 10, 0.1)',
                      color: 'var(--red)',
                      fontSize: '13px',
                      fontWeight: 600,
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <AlertTriangle size={16} />
                    This order is Cancelled and its status cannot be modified.
                  </div>
                )}
                <div className="form-row" style={{ marginBottom: '12px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="newStatus">
                      Status
                    </label>
                    <select
                      id="newStatus"
                      className="form-control"
                      value={newStatus}
                      onChange={e => setNewStatus(e.target.value)}
                      disabled={selectedOrder.orderStatus === 'Cancelled'}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="trackingNum">
                      Tracking Number (Optional)
                    </label>
                    <input
                      id="trackingNum"
                      type="text"
                      className="form-control"
                      placeholder="e.g. AWB12345678"
                      value={trackingNum}
                      onChange={e => setTrackingNum(e.target.value)}
                      disabled={selectedOrder.orderStatus === 'Cancelled'}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary w-full justify-center"
                  onClick={handleUpdateStatus}
                  disabled={updating || selectedOrder.orderStatus === 'Cancelled'}
                >
                  {updating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Updating...
                    </>
                  ) : (
                    <>
                      <Save size={16} /> Update Status
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeOrderModal}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
