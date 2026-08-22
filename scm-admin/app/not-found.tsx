import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-cream min-h-screen flex items-center justify-center py-20 px-4">
      <div className="text-center">
        <Compass size={60} className="text-saffron mb-6" />
        <h1 className="text-8xl font-display font-bold text-charcoal mb-4">404</h1>
        <h2 className="text-3xl font-display font-bold text-charcoal mb-4">Page Not Found</h2>
        <p className="text-brown mb-8 max-w-md mx-auto">
          We couldn't find the page you were looking for. It might have been moved or removed.
        </p>
        <Link href="/" className="btn-primary inline-flex items-center">
          <ArrowLeft size={16} className="mr-2" /> Return to Home
        </Link>
      </div>
    </div>
  );
}
