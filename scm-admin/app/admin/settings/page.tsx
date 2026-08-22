'use client';
import { useState, useEffect } from 'react';
import { Plus, Settings, Trash2 } from 'lucide-react';

type DeliveryRange = { minAmount: number; maxAmount: number | null; charge: number; };
type Settings = { _id?: string; shopName: string; codEnabled: boolean; codCharge: number; deliveryRanges: DeliveryRange[]; };

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => { setSettings(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to save settings');
      } else {
        alert('Settings saved successfully');
      }
    } catch (e) {
      alert('Error saving settings');
    }
    setSaving(false);
  };

  const updateRange = (idx: number, field: keyof DeliveryRange, val: number | null) => {
    if (!settings) return;
    const newRanges = [...settings.deliveryRanges];
    newRanges[idx] = { ...newRanges[idx], [field]: val };
    setSettings({ ...settings, deliveryRanges: newRanges });
  };

  const removeRange = (idx: number) => {
    if (!settings) return;
    const newRanges = settings.deliveryRanges.filter((_, i) => i !== idx);
    setSettings({ ...settings, deliveryRanges: newRanges });
  };

  const addRange = () => {
    if (!settings) return;
    const newRanges = [...settings.deliveryRanges, { minAmount: 0, maxAmount: null, charge: 0 }];
    setSettings({ ...settings, deliveryRanges: newRanges });
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;
  if (!settings) return <div className="p-8 text-center text-red-500">Failed to load settings</div>;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-bold text-charcoal">System Settings</h1>
        <button onClick={saveSettings} disabled={saving} className="bg-red hover:bg-red-dark text-white px-6 py-2 rounded font-medium disabled:opacity-50">
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-charcoal">🚚 Delivery Charges (Phase 4)</h2>
          <p className="text-sm text-gray-500 mt-1">Configure dynamic delivery charges based on cart value.</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {settings.deliveryRanges.map((r, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-gray-50 p-4 rounded border border-gray-100">
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-600 block mb-1">Min Order Value (₹)</label>
                  <input type="number" className="w-full border rounded p-2" value={r.minAmount} onChange={e => updateRange(idx, 'minAmount', Number(e.target.value))} />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-600 block mb-1">Max Order Value (₹)</label>
                  <input type="number" className="w-full border rounded p-2" value={r.maxAmount || ''} placeholder="Infinity" onChange={e => updateRange(idx, 'maxAmount', e.target.value ? Number(e.target.value) : null)} />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-600 block mb-1">Delivery Charge (₹)</label>
                  <input type="number" className="w-full border rounded p-2" value={r.charge} onChange={e => updateRange(idx, 'charge', Number(e.target.value))} />
                </div>
                <div className="pt-5">
                  <button onClick={() => removeRange(idx)} className="text-red hover:text-red-dark w-10 h-10 flex items-center justify-center bg-white rounded border border-gray-200" title="Remove Rule">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            <button onClick={addRange} className="text-sm font-medium text-red hover:text-red-dark flex items-center gap-2">
              <Plus size={16} /> Add New Delivery Rule
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-charcoal">💰 Cash on Delivery (COD)</h2>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 accent-red" checked={settings.codEnabled} onChange={e => setSettings({...settings, codEnabled: e.target.checked})} />
            <span className="font-medium text-charcoal">Enable Cash on Delivery</span>
          </label>
          <div className="max-w-xs">
            <label className="text-sm font-bold text-gray-700 block mb-2">COD Extra Charge (₹)</label>
            <input type="number" className="w-full border rounded p-2" value={settings.codCharge} onChange={e => setSettings({...settings, codCharge: Number(e.target.value)})} disabled={!settings.codEnabled} />
          </div>
        </div>
      </div>

    </div>
  );
}
