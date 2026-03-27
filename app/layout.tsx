import "./globals.css";

export const metadata = {
  title: "أكاديمية ماذا | تمكين طفلك يبدأ بخبراتنا",
  description: "منصة تربوية وتأهيلية تسعى لتمكين ذوي الهمم وأسرهم",
};

import ThemeToggle from '@/components/ThemeToggle';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PWABanner from '@/components/PWABanner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <PWABanner />
          <ThemeToggle />
        </Providers>
      </body>
    </html>
  );
}
