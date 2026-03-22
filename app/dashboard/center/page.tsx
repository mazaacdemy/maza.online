import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function CenterDashboardPage() {
  // Fetch a sample of center specialists (mocked for now, assuming the center will just see all specialists or specific ones)
  const stats = {
    totalSpecialists: await prisma.user.count({ where: { role: 'SPECIALIST' } }), // Real scenario: where: { centerId: currentUser.id }
    recentAssessments: 12,
    activeSessions: 5
  };

  return (
    <div className="dashboard-container">
      <div className="bg-blur"></div>
      
      <aside className="sidebar-glass">
        <h2 className="logo">ماذا</h2>
        <nav className="side-nav">
          <Link href="/dashboard/center" className="active">لوحة المركز</Link>
          <Link href="/dashboard/center/specialists">إدارة الأخصائيين</Link>
          <Link href="/welcome">الخروج</Link>
        </nav>
      </aside>

      <main className="content">
        <header className="main-header">
          <h1>لوحة تحكم المركز</h1>
          <div className="actions">
            <Link href="/dashboard/center/specialists" className="btn-gradient" style={{ textDecoration: 'none' }}>
              + إضافة أخصائي جديد
            </Link>
          </div>
        </header>

        <section className="stats-grid mt-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <div className="stat-card glass">
            <h3>إجمالي الأخصائيين</h3>
            <p className="stat-value">{stats.totalSpecialists}</p>
          </div>
          <div className="stat-card glass">
            <h3>التقييمات المنجزة</h3>
            <p className="stat-value">{stats.recentAssessments}</p>
          </div>
          <div className="stat-card glass">
            <h3>الجلسات النشطة</h3>
            <p className="stat-value">{stats.activeSessions}</p>
          </div>
        </section>

        <section className="mt-4 glass" style={{ padding: '2rem', borderRadius: '24px' }}>
          <h2>مرحباً بك في إدارة المركز</h2>
          <p style={{ color: '#cbd5e1', marginTop: '1rem', lineHeight: 1.6 }}>
            من خلال لوحة التحكم هذه، يمكنك إضافة الأخصائيين التابعين لمركزك، مراقبة أدائهم، والاطلاع على ملخصات التقييمات الذكية (AI) التي يتم إصدارها للحالات.
          </p>
        </section>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background: #0f172a;
          color: #f8fafc;
          direction: rtl;
        }
        .sidebar-glass {
          width: 260px;
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(20px);
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }
        .logo { font-size: 2rem; font-weight: 800; color: #6366f1; }
        .side-nav { display: flex; flex-direction: column; gap: 1rem; }
        .side-nav a {
          color: #94a3b8;
          text-decoration: none;
          padding: 1rem;
          border-radius: 12px;
          transition: 0.3s;
        }
        .side-nav a.active, .side-nav a:hover {
          background: rgba(99, 102, 241, 0.1);
          color: #818cf8;
        }
        .content { flex: 1; padding: 3rem; }
        .main-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .glass {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
        }
        .stat-card {
          padding: 2rem;
          text-align: center;
        }
        .stat-card h3 {
          font-size: 1.1rem;
          color: #94a3b8;
          margin-bottom: 1rem;
        }
        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: #a855f7;
        }
        .btn-gradient { background: linear-gradient(135deg, #6366f1, #a855f7); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 12px; cursor: pointer; font-weight: 600; display: inline-block; }
        .mt-4 { margin-top: 2rem; }
      `}} />
    </div>
  );
}
