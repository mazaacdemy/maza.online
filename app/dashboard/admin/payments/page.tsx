'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPaymentsPage() {
  const [stats, setStats] = useState({
    totalRevenue: 2450.50, // Static demo for now since we don't have a transaction table yet
    activeSubscriptions: 12,
    completedSessions: 85,
    geoRevenue: [
      { country: 'مصر', value: '1,200 EGP' },
      { country: 'السعودية', value: '800 SAR' },
      { country: 'الإمارات', value: '450 AED' }
    ]
  });

  return (
    <div className="dashboard-container">
      <aside className="sidebar glass-panel">
        <div className="logo">
          <div className="logo-icon admin-bg-warning">A</div>
          <h2>التقارير المالية</h2>
        </div>
        <nav className="side-nav">
          <Link href="/dashboard/admin" className="nav-item">العودة للرئيسية</Link>
          <Link href="/dashboard/admin/payments" className="nav-item active">الإيرادات والمدفوعات</Link>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h2>تحليل الإيرادات (Geo-Pricing Analytics)</h2>
        </header>

        <div className="dashboard-grid mt-4">
          <div className="stat-cards">
            <div className="card glass-panel gradient-border">
              <h3>إجمالي الإيرادات المقدرة</h3>
              <div className="value text-gradient">$2,450.50</div>
              <p className="trend positive">بناءً على أسعار البوابات المحلية</p>
            </div>
            <div className="card glass-panel gradient-border">
              <h3>الجلسات المدفوعة</h3>
              <div className="value">85</div>
              <p className="trend positive">جلسات Telehealth مكتملة</p>
            </div>
          </div>

          <div className="card glass-panel mt-4 col-span-2">
            <h3>توزيع الإيرادات حسب المنطقة (Geo-Pricing)</h3>
            <div className="mt-2 overflow-x-auto">
               <table className="w-full text-right">
                 <thead>
                    <tr className="border-bottom-glass">
                      <th className="p-1">الدولة</th>
                      <th className="p-1">الإيراد بالعملة المحلية</th>
                    </tr>
                 </thead>
                 <tbody>
                    {stats.geoRevenue.map((item, idx) => (
                      <tr key={idx} className="border-bottom-glass-subtle">
                        <td className="p-1">{item.country}</td>
                        <td className="p-1 text-accent-primary">{item.value}</td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
