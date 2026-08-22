'use client';

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, Phone, User } from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const redirectPath = (redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')) ? redirectParam : '/account';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, phone, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('scm_user', JSON.stringify(data));
      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 border border-red-200">
          <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-charcoal">First Name</label>
          <div className="relative">
            <input 
              type="text" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="Sunil" 
              className="w-full px-4 py-3 pl-11 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors"
            />
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-charcoal">Last Name</label>
          <div className="relative">
            <input 
              type="text" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="Sharma" 
              className="w-full px-4 py-3 pl-11 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors"
            />
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-charcoal">Phone Number *</label>
        <div className="relative">
          <input 
            type="tel" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="Enter your phone number" 
            className="w-full px-4 py-3 pl-11 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors"
          />
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-charcoal">Email Address</label>
        <div className="relative">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email" 
            className="w-full px-4 py-3 pl-11 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors"
          />
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-charcoal">Password *</label>
        <div className="relative">
          <input 
            type={showPassword ? 'text' : 'password'} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Create a password"
            className="w-full px-4 py-3 pl-11 pr-11 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors"
          />
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <button 
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <p className="text-xs text-brown leading-relaxed mb-2 mt-1">
        By creating an account, you agree to our <Link href="/terms" className="text-brand-red font-semibold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-brand-red font-semibold hover:underline">Privacy Policy</Link>.
      </p>

      <button 
        type="submit" 
        disabled={loading} 
        className="w-full bg-brand-red text-white py-3.5 rounded-xl font-bold text-lg shadow-md hover:bg-red-800 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        {loading ? <><Loader2 size={20} className="animate-spin" /> Creating Account...</> : 'Create Account'}
      </button>

      <div className="relative flex items-center justify-center my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-cream-dark"></div>
        </div>
        <div className="relative bg-white px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
          OR
        </div>
      </div>
      
      <button 
        type="button" 
        className="w-full bg-white border border-cream-dark text-charcoal py-3 rounded-xl font-semibold flex justify-center items-center gap-3 hover:bg-cream transition-colors"
      >
        <img src="/images/google-icon.png" alt="Google" className="w-5 h-5" onError={(e) => e.currentTarget.style.display = 'none'} /> 
        Continue with Google
      </button>

      <div className="text-center text-sm text-brown mt-2">
        Already have an account? <Link href="/login" className="font-semibold text-brand-red hover:underline ml-1">Log In</Link>
      </div>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <div className="bg-cream min-h-[calc(100vh-200px)] py-12 md:py-20 px-4 flex items-center justify-center">
      <div className="w-full max-w-[500px] bg-white rounded-3xl shadow-lg border border-cream-dark overflow-hidden">
        <div className="flex border-b border-cream-dark bg-cream/30">
          <Link href="/login" className="flex-1 text-center py-4 font-semibold text-brown hover:text-charcoal transition-colors">
            Log In
          </Link>
          <Link href="/register" className="flex-1 text-center py-4 font-bold text-brand-red border-b-2 border-brand-red bg-white">
            Register
          </Link>
        </div>
        
        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="font-playfair text-3xl font-bold text-charcoal mb-2">Create Your Account</h2>
            <p className="text-brown text-sm">Create an account to track orders, save addresses, and checkout faster.</p>
          </div>
          
          <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin text-saffron" size={32} /></div>}>
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
