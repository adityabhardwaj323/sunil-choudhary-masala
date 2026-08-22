'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AccountDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/account/orders');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-cream-dark p-8">
      <Loader2 className="animate-spin text-brand-red mb-4" size={40} />
      <p className="text-brown font-medium text-lg">Redirecting to dashboard...</p>
    </div>
  );
}
