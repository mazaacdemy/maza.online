import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function CenterSpecialistsPage() {
  // Mock fetching specialists for this center
  // Real implementation: where: { centerId: currentUser.id, role: 'SPECIALIST' }
  const specialists = await prisma.user.findMany({
    where: { role: 'SPECIALIST' },
    orderBy: { createdAt: 'desc' },
    // If we want to show their sessions/assessments count
    include: {
      assessments: true,
      _count: {
        select: { specialistSessions: true }
      }
    }
  });

  return (
    <div className="dashboard-container">
      <div className="bg-blur"></div>
      
      <aside className="sidebar-glass">
        <h2 className="logo">ماذا</h2>
        <nav className="side-nav">
          <Link href="/dashboard/center">لوحة المركز</Link>
          <Link href="/dashboard/center/specialists" className="active">إدارة الأخصائيين</Link>
          <Link href="/welcome">الخروج</Link>
        </nav>
      </aside>

      <main className="content">
        <header className="main-header">
          <h1>إدارة الأخصائيين التابعين</h1>
          <div className="actions">
            <button className="btn-gradient">+ دعوة أخصائي جديد</button>
          </div>
        </header>

        <section className="specialists-list mt-4">
          <div className="table-responsive glass">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '1.5rem 1rem', color: '#94a3b8' }}>الاسم</th>
                  <th style={{ padding: '1.5rem 1rem', color: '#94a3b8' }}>البريد الإلكتروني</th>
                  <th style={{ padding: '1.5rem 1rem', color: '#94a3b8' }}>الجلسات</th>
                  <th style={{ padding: '1.5rem 1rem', color: '#94a3b8' }}>التقييمات</th>
                  <th style={{ padding: '1.5rem 1rem', color: '#94a3b8' }}>تاريخ الانضمام</th>
                  <th style={{ padding: '1.5rem 1rem', color: '#94a3b8' }}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {specialists.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#cbd5e1' }}>لا يوجد أخصائيين مضافين بعد</td>
                  </tr>
                ) : (
                  specialists.map(spec => (
                    <tr key={spec.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1.5rem 1rem' }}>{spec.name}</td>
                      <td style={{ padding: '1.5rem 1rem', color: '#cbd5e1' }}>{spec.email}</td>
                      <td style={{ padding: '1.5rem 1rem' }}>
                        <span className="badge">{spec._count?.specialistSessions || 0} جلسة</span>
                      </td>
                      <td style={{ padding: '1.5rem 1rem' }}>
                        <span className="badge ai">{spec.assessments?.length || 0} تقييم</span>
                      </td>
                      <td style={{ padding: '1.5rem 1rem', color: '#94a3b8' }}>
                        {new Date(spec.createdAt).toLocaleDateString('ar-EG')}
                      </td>
                      <td style={{ padding: '1.5rem 1rem' }}>
                        <button className="btn-outline-small">إزالة</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
        .content { flex: 1; padding: 3rem; overflow-y: auto; }
        .main-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .glass {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
        }
        .btn-gradient { background: linear-gradient(135deg, #6366f1, #a855f7); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 12px; cursor: pointer; font-weight: 600; }
        .btn-outline-small { background: transparent; color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.5); padding: 0.4rem 0.8rem; border-radius: 8px; cursor: pointer; transition: 0.3s; }
        .btn-outline-small:hover { background: rgba(239, 68, 68, 0.1); border-color: #ef4444; }
        .badge { background: rgba(255, 255, 255, 0.1); padding: 0.3rem 0.6rem; border-radius: 50px; font-size: 0.85rem; }
        .badge.ai { background: rgba(99, 102, 241, 0.15); color: #818cf8; }
        .mt-4 { margin-top: 2rem; }
        .table-responsive { overflow-x: auto; padding: 1rem; }
      `}} />
    </div>
  );
}
