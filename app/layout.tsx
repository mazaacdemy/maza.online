import "./globals.css";

export const metadata = {
  title: "منصة ماذا | لوحة تحكم الأخصائي",
  description: "لوحة تحكم الأخصائي",
};

import ThemeToggle from '@/components/ThemeToggle';
import Providers from '@/components/Providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Providers>
          {children}
          <ThemeToggle />
        </Providers>
      </body>
    </html>
  );
}
