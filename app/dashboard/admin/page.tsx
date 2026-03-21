'use client';

import React from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="admin-container">
      <div className="bg-gradient"></div>
      
      {/* Sidebar */}
      <aside className="sidebar-glass">
        <h2 className="logo">ماذا <span>Admn</span></h2>
        <nav className="side-nav">
          <Link href="#" className="active">نظرة عامة</Link>
          <Link href="#">إدارة المستخدمين</Link>
          <Link href="#">التقارير المالية</Link>
          <Link href="#">إعدادات AI</Link>
          <Link href="/welcome" className="mt-auto">الخروج للموقع</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="content">
        <header className="header">
          <h1>لوحة تحكم الإدارة العليا</h1>
          <div className="admin-profile">
            <span className="badge-admin">Super Admin</span>
          </div>
        </header>

        {/* Global Stats */}
        <div className="stats-grid">
          <div className="stat-card glass border-blue">
            <span className="label">إجمالي المستخدمين</span>
            <div className="value">1,248</div>
            <div className="sub">850 ولي أمر | 398 أخصائي</div>
          </div>
          <div className="stat-card glass border-purple">
            <span className="label">الإيرادات الكلية</span>
            <div className="value">$45,200</div>
            <div className="sub">≈ 2,200,000 ج.م</div>
          </div>
          <div className="stat-card glass border-green">
            <span className="label">أداء AI (Gemini)</span>
            <div className="value">98.2%</div>
            <div className="sub">دقة التقارير المولدة</div>
          </div>
          <div className="stat-card glass border-orange">
            <span className="label">الجلسات النشطة الآن</span>
            <div className="value">14</div>
            <div className="sub">غرف فيديو حية</div>
          </div>
        </div>

        {/* Recent Users Table */}
        <section className="management-section glass mt-4">
          <div className="sec-header">
            <h3>طلبات انضمام الأخصائيين</h3>
            <button className="btn-outline">عرض الكل</button>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>الأخصائي</th>
                  <th>التخصص</th>
                  <th>التاريخ</th>
                  <th>الحالة</th>
                  <th>الإجراء</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>د. سارة أحمد</td>
                  <td>تخاطب</td>
                  <td>21 مارس 2026</td>
                  <td><span className="tag pending">قيد المراجعة</span></td>
                  <td><button className="btn-sm-approve">قبول</button></td>
                </tr>
                <tr>
                  <td>أ. محمود حسن</td>
                  <td>صعوبات تعلم</td>
                  <td>20 مارس 2026</td>
                  <td><span className="tag active">نشط</span></td>
                  <td><button className="btn-sm-edit">تعديل</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <style jsx>{`
        .admin-container {
          display: flex;
          min-height: 100vh;
          background: var(--bg-color);
          color: var(--text-primary);
          direction: rtl;
          font-family: 'Inter', sans-serif;
        }

        .bg-gradient {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at 10% 10%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
                      radial-gradient(circle at 90% 90%, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
          z-index: 0;
        }

        .sidebar-glass {
          width: 260px;
          background: var(--glass-bg);
          backdrop-filter: blur(30px);
          border-left: 1px solid var(--glass-border);
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          z-index: 10;
        }

        .logo { font-size: 1.8rem; font-weight: 800; margin-bottom: 4rem; }
        .logo span { font-size: 0.9rem; color: #6366f1; opacity: 0.8; margin-right: 5px; }

        .side-nav { display: flex; flex-direction: column; gap: 1rem; flex: 1; }
        .side-nav a {
          color: #94a3b8;
          text-decoration: none;
          padding: 1rem;
          border-radius: 12px;
          transition: 0.3s;
          font-weight: 500;
        }
        .side-nav a.active, .side-nav a:hover {
          background: rgba(99, 102, 241, 0.1);
          color: #fff;
        }

        .mt-auto { margin-top: auto; border: 1px solid rgba(255,255,255,0.1); text-align: center; }

        .content { flex: 1; padding: 3rem; z-index: 1; }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
        }

        .badge-admin {
          background: linear-gradient(135deg, #6366f1, #a855f7);
          padding: 0.5rem 1.2rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .glass {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 1.8rem;
        }

        .border-blue { border-bottom: 3px solid #3b82f6; }
        .border-purple { border-bottom: 3px solid #8b5cf6; }
        .border-green { border-bottom: 3px solid #10b981; }
        .border-orange { border-bottom: 3px solid #f59e0b; }

        .stat-card .label { color: #94a3b8; font-size: 0.9rem; }
        .stat-card .value { font-size: 2.2rem; font-weight: 800; margin: 0.8rem 0; }
        .stat-card .sub { color: #64748b; font-size: 0.8rem; }

        .mt-4 { margin-top: 2rem; }
        .sec-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        
        .admin-table { width: 100%; border-collapse: collapse; text-align: right; }
        .admin-table th { padding: 1.2rem; color: #94a3b8; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .admin-table td { padding: 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.03); }

        .tag { padding: 0.3rem 0.8rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; }
        .tag.pending { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
        .tag.active { background: rgba(16, 185, 129, 0.15); color: #34d399; }

        .btn-sm-approve { background: #6366f1; border: none; color: #fff; padding: 0.4rem 1rem; border-radius: 6px; cursor: pointer; }
        .btn-sm-edit { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 0.4rem 1rem; border-radius: 6px; cursor: pointer; }

        .btn-outline { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 0.5rem 1.2rem; border-radius: 8px; cursor: pointer; }
      `}</style>
    </div>
  );
}
