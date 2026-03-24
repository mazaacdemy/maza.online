import "./globals.css";

export const metadata = {
  title: "منصة ماذا | لوحة تحكم الأخصائي",
  description: "لوحة تحكم الأخصائي",
};

import ThemeToggle from '@/components/ThemeToggle';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
          <ThemeToggle />
        </Providers>
      </body>
    </html>
  );
}
