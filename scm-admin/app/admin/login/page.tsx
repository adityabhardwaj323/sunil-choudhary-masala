'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Loader2, Lock, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email.trim(),
          password: password,
        }),
      });

      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error('Non-JSON response from server:', text.substring(0, 200));
        throw new Error('Authentication service returned an unexpected response.');
      }

      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials or login failed');
      }

      // Check if user is an admin
      if (data.role && data.role !== 'admin') {
        throw new Error('Access denied. This account does not have administrator privileges.');
      }

      // Store in localStorage for client persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('scm_admin_user', JSON.stringify(data));
        localStorage.setItem('scm_admin_user_data', JSON.stringify(data));
      }

      // Redirect to admin dashboard
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error('Admin login error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-stone-900 to-stone-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-body selection:bg-brand-red selection:text-white">
      {/* Background Decorative Spice Glow Elements */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-red/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-saffron/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Login Card Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Top Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-red via-red-600 to-saffron text-white text-2xl font-bold shadow-xl border-2 border-white/20 mb-4 transform hover:scale-105 transition-transform duration-200">
            <span className="tracking-tighter">SCM</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Sunil Choudhary Masala
          </h1>
          <p className="text-xs text-saffron font-script text-base mt-0.5 tracking-wider">
            Shuddhta Hi Hamari Pehchaan Hai
          </p>
          <div className="inline-block mt-3 px-3 py-1 bg-stone-800/90 border border-stone-700/80 rounded-full text-xs font-semibold text-stone-300">
            <ShieldCheck size={16} className="text-saffron mr-1.5" />
            Admin Control Center
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-stone-100/30 ring-1 ring-black/5">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-charcoal font-display">Sign In to Dashboard</h2>
            <p className="text-xs text-stone-500 mt-1">
              Enter your authorized administrator credentials to continue
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200/80 text-brand-red text-xs font-medium flex items-start gap-3 animate-in fade-in duration-200">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email / Username */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="block text-xs font-bold text-stone-700 uppercase tracking-wider"
              >
                Admin Email / Mobile <span className="text-brand-red">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <ShieldCheck size={14} />
                </div>
                <input
                  id="admin-email"
                  type="text"
                  required
                  placeholder="admin@sunilmasala.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-stone-50/80 border border-stone-200 rounded-xl text-sm text-charcoal placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red focus:bg-white transition-all"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-bold text-stone-700 uppercase tracking-wider"
                >
                  Password <span className="text-brand-red">*</span>
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock size={14} />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 bg-stone-50/80 border border-stone-200 rounded-xl text-sm text-charcoal placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red focus:bg-white transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-stone-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-brand-red border-stone-300 rounded focus:ring-brand-red"
                />
                <span>Keep me signed in</span>
              </label>

              <span className="text-stone-400 text-[11px] flex items-center gap-1">
                <Lock size={16} className="text-[10px]" /> 256-Bit SSL
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl text-white font-semibold text-sm shadow-lg shadow-brand-red/25 bg-gradient-to-r from-brand-red via-red-600 to-saffron hover:opacity-95 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Access Admin Dashboard</span>
                  <ArrowRight size={12} className="mt-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <div className="flex items-center justify-center gap-1.5 text-stone-400 text-xs">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Authorized personnel only. All access is logged.</span>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-stone-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft size={16} className="text-[10px]" />
            <span>Return to Public Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
