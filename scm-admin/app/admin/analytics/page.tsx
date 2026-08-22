'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [range, setRange] = useState('all');

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/admin/analytics?range=${range}`);
      if (!res.ok) throw new Error('Failed to fetch analytics data');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-saffron"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded-md my-4">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-display font-bold text-charcoal">Analytics Dashboard</h1>
        <select 
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="p-2 border border-cream-mid rounded-md"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="last7days">Last 7 Days</option>
          <option value="last30days">Last 30 Days</option>
          <option value="thismonth">This Month</option>
        </select>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-cream-mid">
              <h3 className="text-sm text-gray-500 uppercase tracking-wide">Total Revenue</h3>
              <p className="text-3xl font-bold text-charcoal mt-2">₹{data.summary.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-cream-mid">
              <h3 className="text-sm text-gray-500 uppercase tracking-wide">Total Orders</h3>
              <p className="text-3xl font-bold text-charcoal mt-2">{data.summary.totalOrders}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-cream-mid">
              <h3 className="text-sm text-gray-500 uppercase tracking-wide">Customers</h3>
              <p className="text-3xl font-bold text-charcoal mt-2">{data.summary.totalCustomers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-cream-mid">
              <h3 className="text-sm text-gray-500 uppercase tracking-wide">Average Order</h3>
              <p className="text-3xl font-bold text-charcoal mt-2">₹{Math.round(data.summary.averageOrderValue).toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-cream-mid">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">Order Status Breakdown</h2>
              <ul className="space-y-3">
                {Object.entries(data.charts.ordersByStatus).map(([status, count]) => (
                  <li key={status} className="flex justify-between items-center">
                    <span className="text-gray-700">{status}</span>
                    <span className="font-bold bg-cream-dark px-3 py-1 rounded-full text-sm">{String(count)}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-cream-mid">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">Payment Methods</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Online (Razorpay)</span>
                  <div className="text-right">
                    <div className="font-bold">{data.summary.razorpayOrderCount} orders</div>
                    <div className="text-sm text-gray-500">₹{data.summary.razorpayRevenue.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center border-t pt-3">
                  <span className="text-gray-700">Cash on Delivery (COD)</span>
                  <div className="text-right">
                    <div className="font-bold">{data.summary.codOrderCount} orders</div>
                    <div className="text-sm text-gray-500">₹{data.summary.codRevenue.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-cream-mid">
              <h2 className="text-xl font-bold mb-4 border-b pb-2 text-red-600">Refunds & Cancellations</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Cancelled Orders</p>
                  <p className="text-2xl font-bold">{data.summary.cancelledOrders}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Refunds Processed</p>
                  <p className="text-2xl font-bold">{data.summary.refundCount}</p>
                </div>
                <div className="col-span-2 mt-2">
                  <p className="text-gray-500 text-sm">Total Refund Amount</p>
                  <p className="text-2xl font-bold text-red-600">₹{data.summary.refundTotal.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-cream-mid">
              <h2 className="text-xl font-bold mb-4 border-b pb-2 text-orange-600">Low Stock Alerts</h2>
              {data.lowStockItems.length === 0 ? (
                <p className="text-green-600">All products are sufficiently stocked!</p>
              ) : (
                <ul className="space-y-3">
                  {data.lowStockItems.map((item: any) => (
                    <li key={item.productId + item.weight} className="flex justify-between items-center">
                      <span className="text-gray-700">{item.name} ({item.weight})</span>
                      <span className={'font-bold px-3 py-1 rounded-full text-sm ' + (item.isOutOfStock ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700')}>
                        {item.stock} left
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
