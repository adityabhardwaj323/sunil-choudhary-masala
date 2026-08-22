import type { Metadata } from 'next';
import { CartWishlistProvider } from '@/context/CartWishlistContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sunil Choudhary Masala – Shuddhta Hi Hamari Pehchaan Hai',
  description: 'Premium quality masala products from Rajasthan. Pure, authentic spices including Red Chilli, Coriander, Turmeric, Dry Fruits, Makhana, and Cooking Oils.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Inter:wght@300;400;500;600;700&family=Kalam:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartWishlistProvider>
          {children}
        </CartWishlistProvider>
      </body>
    </html>
  );
}
