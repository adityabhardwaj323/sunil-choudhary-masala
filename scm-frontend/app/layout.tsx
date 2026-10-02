import type { Metadata } from 'next';
import { Playfair_Display, Inter, Kalam } from 'next/font/google';
import { CartWishlistProvider } from '@/context/CartWishlistContext';
import GoogleAnalytics from '@/components/layout/GoogleAnalytics';
import './globals.css';

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  weight: ['500', '600', '700'],
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

const kalam = Kalam({ 
  subsets: ['latin'], 
  weight: ['400', '700'],
  variable: '--font-kalam',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Sunil Choudhary Masala – Shuddhta Hi Hamari Pehchaan Hai',
  description: 'Premium quality masala products from Rajasthan. Pure, authentic spices including Red Chilli, Coriander, Turmeric, Dry Fruits, Makhana, and Cooking Oils.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${kalam.variable}`}>
      <body>
        <CartWishlistProvider>
          {children}
        </CartWishlistProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
