import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppWidget from '@/components/layout/WhatsAppWidget';
import { cookies } from 'next/headers';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get('customer_jwt')?.value;
  const isLoggedIn = !!token;

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <main>
        {children}
      </main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}
