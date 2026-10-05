import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { CartWishlistProvider } from '@/context/CartWishlistContext';
import GoogleAnalytics from '@/components/layout/GoogleAnalytics';
import './globals.css';

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap'
});

const inter = Inter({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Sunil Choudhary Masala – Premium Authentic Indian Spices',
  description: 'Carefully selected spices rooted in Rajasthan, crafted for everyday Indian cooking.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <CartWishlistProvider>
          {children}
        </CartWishlistProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
