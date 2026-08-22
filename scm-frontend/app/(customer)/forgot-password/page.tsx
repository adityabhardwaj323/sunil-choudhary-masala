'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, KeyRound, Lock, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();

  // State
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  // Timer effect for resend cooldown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // Step 1: Send Email
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to request OTP');
      }

      setSuccess(data.message);
      setStep(2);
      setResendCountdown(60);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 1a: Resend OTP
  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/resend-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      setSuccess('A new OTP has been sent to your email.');
      setResendCountdown(60);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to verify OTP');
      }

      setResetToken(data.resetToken);
      setSuccess('OTP verified! Please enter your new password.');
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setSuccess('Password reset successfully. You can now log in.');
      setStep(4);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream min-h-[calc(100vh-200px)] py-12 md:py-20 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-cream-dark overflow-hidden p-8 md:p-10">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-3xl font-bold text-charcoal mb-2">
            Reset Password
          </h1>
          
          {step < 4 && (
            <p className="text-brown text-sm">
              {step === 1 && "Enter your email to receive an OTP."}
              {step === 2 && "Enter the 6-digit OTP sent to your email."}
              {step === 3 && "Create a new secure password."}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 border border-red-200 mb-6">
            <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-start gap-3 border border-green-200 mb-6">
            <CheckCircle2 className="flex-shrink-0 mt-0.5" size={18} />
            <p className="text-sm font-medium">{success}</p>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-charcoal">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email" 
                  className="w-full px-4 py-3 pl-11 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-brand-red text-white py-3.5 rounded-xl font-bold text-lg shadow-md hover:bg-red-800 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading ? <><Loader2 size={20} className="animate-spin" /> Sending OTP...</> : 'Send OTP'}
            </button>
            
            <div className="text-center text-sm text-brown mt-2">
              Remembered your password? <Link href="/login" className="font-semibold text-brand-red hover:underline ml-1">Sign In</Link>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-charcoal">6-Digit OTP</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="123456" 
                  maxLength={6}
                  className="w-full px-4 py-3 pl-11 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors tracking-[0.25em] text-center font-bold text-xl"
                />
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading || otp.length !== 6} 
              className="w-full bg-brand-red text-white py-3.5 rounded-xl font-bold text-lg shadow-md hover:bg-red-800 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading ? <><Loader2 size={20} className="animate-spin" /> Verifying...</> : 'Verify OTP'}
            </button>
            
            <div className="flex justify-between items-center text-sm mt-2">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="text-brown hover:text-charcoal font-medium transition-colors"
              >
                Change Email
              </button>
              <button 
                type="button" 
                onClick={handleResendOtp}
                disabled={resendCountdown > 0 || loading}
                className={`font-semibold transition-colors ${resendCountdown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-brand-red hover:text-red-800'}`}
              >
                {resendCountdown > 0 ? `Resend OTP in ${resendCountdown}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-charcoal">New Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter new password" 
                  className="w-full px-4 py-3 pl-11 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading || !newPassword} 
              className="w-full bg-brand-red text-white py-3.5 rounded-xl font-bold text-lg shadow-md hover:bg-red-800 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading ? <><Loader2 size={20} className="animate-spin" /> Resetting...</> : 'Reset Password'}
            </button>
          </form>
        )}

        {step === 4 && (
          <div className="flex flex-col items-center gap-6">
            <Link href="/login" className="w-full bg-brand-red text-white py-3.5 rounded-xl font-bold text-lg shadow-md hover:bg-red-800 hover:shadow-lg transition-all flex justify-center items-center gap-2">
              <ArrowLeft size={20} /> Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
