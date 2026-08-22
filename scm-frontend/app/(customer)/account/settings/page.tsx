'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Edit2, X, Save, Info } from 'lucide-react';

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export default function AccountSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [savedNote, setSavedNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cachedUser = localStorage.getItem('scm_user');

    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        setUser(parsed);
        setFirstNameInput(parsed.firstName || '');
        setLastNameInput(parsed.lastName || '');
        setPhoneInput(parsed.phone || '');
      } catch (e) {}
    }

    fetch('/api/auth/profile')
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem('scm_user');
          router.push('/login?redirect=/account/settings');
          return null;
        }
        return res.ok ? res.json() : null;
      })
      .then((data) => {
        if (data) {
          setUser(data);
          setFirstNameInput(data.firstName || '');
          setLastNameInput(data.lastName || '');
          setPhoneInput(data.phone || '');
          localStorage.setItem('scm_user', JSON.stringify(data));
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [router]);

  const [saveError, setSaveError] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    const updated = {
      firstName: firstNameInput.trim(),
      lastName: lastNameInput.trim(),
      phone: phoneInput.trim(),
    };

    try {
      const res = await fetch(`/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updated)
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        router.push('/login?redirect=/account/settings');
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setUser(data);
      localStorage.setItem('scm_user', JSON.stringify(data));
      setIsEditing(false);
      setSavedNote('Profile updated successfully');
      setTimeout(() => setSavedNote(''), 4000);
    } catch (err: any) {
      setSaveError(err.message || 'Something went wrong. Please try again.');
    }
  };

  if (loading && !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-cream-dark p-8 shadow-sm">
        <Loader2 className="animate-spin text-brand-red mb-4" size={40} />
        <p className="text-brown font-medium text-lg">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-cream-dark shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-cream-dark flex justify-between items-center bg-cream/30">
        <h2 className="font-playfair text-2xl font-bold text-charcoal">Personal Information</h2>
        <button
          type="button"
          className="flex items-center gap-2 font-semibold text-sm px-4 py-2 rounded-lg transition-colors border border-cream-dark hover:bg-cream"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? <><X size={16} /> Cancel</> : <><Edit2 size={16} /> Edit</>}
        </button>
      </div>

      <div className="p-6 md:p-8">
        {!isEditing ? (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">First Name</label>
                <div className="text-lg font-medium text-charcoal">{user?.firstName || '—'}</div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Last Name</label>
                <div className="text-lg font-medium text-charcoal">{user?.lastName || '—'}</div>
              </div>
            </div>
            
            <hr className="border-cream-dark" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Email</label>
                <div className="text-lg font-medium text-charcoal">{user?.email || '—'}</div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Phone</label>
                <div className="text-lg font-medium text-charcoal">{user?.phone || '—'}</div>
              </div>
            </div>
            
            {savedNote && (
              <div className="mt-4 bg-green-50 text-green-700 p-4 rounded-xl flex items-start gap-3 border border-green-200">
                <Info className="flex-shrink-0 mt-0.5" size={18} />
                <p className="text-sm font-medium">{savedNote}</p>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-charcoal">First Name</label>
                <input
                  type="text"
                  value={firstNameInput}
                  onChange={(e) => setFirstNameInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-charcoal">Last Name</label>
                <input
                  type="text"
                  value={lastNameInput}
                  onChange={(e) => setLastNameInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-charcoal">Email</label>
                <div className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-gray-500 cursor-not-allowed">
                  {user?.email || '—'}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-charcoal">Phone</label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors"
                />
              </div>
            </div>
            
            {saveError && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 border border-red-200">
                <Info className="flex-shrink-0 mt-0.5" size={18} />
                <p className="text-sm font-medium">{saveError}</p>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button 
                type="submit" 
                className="bg-brand-red text-white py-3 px-8 rounded-xl font-bold shadow-md hover:bg-red-800 hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Save size={18} /> Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
