'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import LocationDetector from '@/components/checkout/LocationDetector';
import { Loader2, Plus, MapPin, Check, Trash2, AlertTriangle, X } from 'lucide-react';

export default function AddressPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    label: 'Home',
    addressLine1: '',
    addressLine2: '',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '',
    phone: '', lat: 0, lng: 0});

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/users/addresses');
      if (res.status === 401 || res.status === 403) {
        window.location.href = '/login?redirect=/account/address';
        return;
      }
      if (!res.ok) throw new Error('Failed to load addresses');
      const data = await res.json();
      setAddresses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  
      const handleLocationSelect = (lat: number, lng: number, addressDetails?: any) => {
    if (!addressDetails) return;
    
    // In checkout, we need to switch to 'new' form
    

    setFormData(prev => ({
      ...prev,
      lat,
      lng,
      addressLine1: addressDetails.addressLine1 || '',
      addressLine2: addressDetails.addressLine2 || '',
      city: addressDetails.city || '',
      state: addressDetails.state || '',
      pincode: addressDetails.pincode || ''
    }));
  };

  
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await fetch(`/api/users/addresses/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error('Failed to update address');
        setEditingId('');
      } else {
        const res = await fetch('/api/users/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error('Failed to add address');
      }
      
      setFormData({
        label: 'Home',
        addressLine1: '',
        addressLine2: '',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '',
        phone: '',
        lat: 0,
        lng: 0
      });
      await fetchAddresses();
      alert(editingId ? 'Address updated successfully' : 'Address added successfully');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this address?')) return;
    try {
      const res = await fetch(`/api/users/addresses/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete address');
      setAddresses(addresses.filter(a => a._id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch(`/api/users/addresses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true })
      });
      if (!res.ok) throw new Error('Failed to set default address');
      await fetchAddresses();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-cream-dark p-8 shadow-sm">
      <Loader2 className="animate-spin text-brand-red mb-4" size={40} />
      <p className="text-brown font-medium text-lg">Loading addresses...</p>
    </div>
  );

  return (
    <div className="relative">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 border border-red-200 mb-6 shadow-sm">
          <AlertTriangle className="flex-shrink-0 mt-0.5" size={18} />
          <div>
            <h3 className="font-bold text-sm">Couldn't load your addresses</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-cream-dark shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-cream-dark flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-cream/30">
          <h2 className="font-playfair text-2xl font-bold text-charcoal">Delivery Addresses</h2>
          <button 
            className="bg-brand-red text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-red-800 hover:shadow-lg transition-all flex items-center gap-2 text-sm" 
            onClick={() => setIsAdding(true)}
          >
            <Plus size={16} /> Add Address
          </button>
        </div>
        
        <div className="p-6 md:p-8">
          {addresses.length === 0 ? (
            <div className="text-center py-12 px-4 border-2 border-dashed border-cream-dark rounded-xl bg-cream/30">
              <MapPin className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-brown font-medium">No saved addresses yet.</p>
              <p className="text-sm text-gray-500 mt-1">Add one to speed up checkout.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map(addr => (
                <div key={addr._id} className={`border rounded-xl p-6 transition-all ${addr.isDefault ? 'border-brand-red bg-red-50/30' : 'border-cream-dark bg-white hover:border-brand-red/50'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-charcoal">{addr.label || 'Address'}</span>
                      {addr.isDefault && (
                        <span className="bg-brand-red text-white text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                      {addr.latitude && addr.longitude && (
                        <span title="Location pinned on map" className="text-saffron text-xs font-semibold flex items-center gap-1">
                          <MapPin size={12} /> Pinned
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm text-charcoal/80 leading-relaxed mb-5 min-h-[4.5rem]">
                    <p>{addr.addressLine1 || ''}{addr.addressLine2 ? ', ' + addr.addressLine2 : ''}</p>
                    <p>{addr.city || ''}{addr.state ? ', ' + addr.state : ''} {addr.pincode || ''}</p>
                    {addr.phone && <p className="mt-1 text-brown font-medium"><span className="text-gray-400 font-normal">Phone:</span> {addr.phone}</p>}
                  </div>
                  
                  <div className="flex items-center gap-3 pt-4 border-t border-cream-dark">
                    {!addr.isDefault && (
                      <button 
                        className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center gap-1 transition-colors flex-1 justify-center py-1" 
                        onClick={() => handleSetDefault(addr._id)}
                      >
                        <Check size={14} /> Set Default
                      </button>
                    )}
                    <button 
                      className={`text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-1 transition-colors py-1 ${!addr.isDefault ? 'flex-1 justify-center border-l border-cream-dark' : ''}`} 
                      onClick={() => handleDelete(addr._id)}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-cream-dark bg-cream/50">
              <h3 className="font-playfair font-bold text-xl text-charcoal">Add Delivery Address</h3>
              <button 
                type="button" 
                className="text-gray-400 hover:text-charcoal transition-colors p-1 rounded-md hover:bg-white" 
                onClick={() => setIsAdding(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdd} className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-charcoal">Label</label>
                <select 
                  value={formData.label} 
                  onChange={e => setFormData({...formData, label: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors appearance-none bg-white"
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-charcoal">Address Line 1 *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="House/Flat No., Building, Street" 
                  value={formData.addressLine1} 
                  onChange={e => setFormData({...formData, addressLine1: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors"
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-charcoal">Address Line 2</label>
                <input 
                  type="text" 
                  placeholder="Area, Landmark (optional)" 
                  value={formData.addressLine2} 
                  onChange={e => setFormData({...formData, addressLine2: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-charcoal">City *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Jaipur" 
                    value={formData.city} 
                    onChange={e => setFormData({...formData, city: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-charcoal">State</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Rajasthan" 
                    value={formData.state} 
                    onChange={e => setFormData({...formData, state: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-charcoal">Pincode *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="302001" 
                    maxLength={6} 
                    value={formData.pincode} 
                    onChange={e => setFormData({...formData, pincode: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-charcoal">Phone *</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="+91 98765 43210" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-cream-dark">
                <button 
                  type="button" 
                  className="px-6 py-2.5 rounded-xl font-semibold text-charcoal border border-cream-dark hover:bg-cream transition-colors" 
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-brand-red text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-red-800 hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Check size={18} /> {editingId ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
