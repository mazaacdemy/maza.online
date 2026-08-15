'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar glass-panel">
        <div className="logo">
          <div className="logo-icon admin-bg-warning">A</div>
          <h2>إدارة ماذا <span>(Maza)</span></h2>
        </div>
        <nav className="side-nav">
          <Link 
            href="/dashboard/admin" 
            className={`nav-item ${pathname === '/dashboard/admin' ? 'active' : ''}`}
          >
            لوحة قيادة النظام (Super Admin)
          </Link>
          <Link 
            href="/dashboard/admin/users" 
            className={`nav-item ${pathname.includes('/users') ? 'active' : ''}`}
          >
            إدارة المستخدمين والأخصائيين
          </Link>
          <Link 
            href="/dashboard/admin/payments" 
            className={`nav-item ${pathname.includes('/payments') ? 'active' : ''}`}
          >
            تقارير الإيرادات (Geo-Payments)
          </Link>
          <Link 
            href="/dashboard/admin/settings" 
            className={`nav-item ${pathname.includes('/settings') ? 'active' : ''}`}
          >
            إعدادات المنصة والذكاء الاصطناعي
          </Link>
          <Link 
            href="/dashboard/admin/content" 
            className={`nav-item ${pathname.includes('/content') ? 'active' : ''}`}
          >
            إدارة محتوى الموقع (CMS)
          </Link>
          <Link 
            href="/dashboard/admin/leads" 
            className={`nav-item ${pathname.includes('/leads') ? 'active' : ''}`}
          >
            طلبات التسجيل والتوظيف (Leads)
          </Link>
          <Link 
            href="/dashboard/admin/quiz" 
            className={`nav-item ${pathname.includes('/quiz') ? 'active' : ''}`}
          >
            اختبر معلوماتك (Quiz)
          </Link>
        </nav>
      </aside>

      {/* Main Content Layout Wrapper */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}