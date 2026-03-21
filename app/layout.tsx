import "./globals.css";

export const metadata = {
  title: "منصة ماذا | لوحة تحكم الأخصائي",
  description: "لوحة تحكم الأخصائي",
};

import ThemeToggle from '@/components/ThemeToggle';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
