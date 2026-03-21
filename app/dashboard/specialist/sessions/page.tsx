import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function SpecialistSessionsPage() {
  const sessions = await prisma.appointment.findMany({
    include: { parent: true },
    orderBy: { date: 'desc' }
  });

  return (
    <div className="dashboard-container">
      <div className="bg-blur"></div>
      
      <aside className="sidebar-glass">
        <h2 className="logo">ماذا</h2>
        <nav className="side-nav">
          <Link href="/dashboard/specialist">الرئيسية</Link>
          <Link href="/dashboard/specialist/sessions" className="active">جلسات التخاطب</Link>
          <Link href="/dashboard/specialist/assessments">تقييمات AI</Link>
          <Link href="/welcome">الخروج</Link>
        </nav>
      </aside>

      <main className="content">
        <header className="main-header">
          <h1>سجل الجلسات والمواعيد</h1>
          <div className="actions">
            <button className="btn-primary">حجز جلسة جديدة</button>
          </div>
        </header>

        <section className="sessions-list glass mt-4">
          <table className="data-table">
            <thead>
              <tr>
                <th>التاريخ والوقت</th>
                <th>ولي الأمر</th>
                <th>نوع الجلسة</th>
                <th>الحالة</th>
                <th>الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(session => (
                <tr key={session.id}>
                  <td>{new Date(session.date).toLocaleString('ar-EG')}</td>
                  <td>{session.parent.name}</td>
                  <td><span className="tag">{session.type}</span></td>
                  <td><span className={`status-tag ${session.status.toLowerCase()}`}>{session.status}</span></td>
                  <td>
                    <button className="btn-sm">عرض التفاصيل</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
          padding: 2rem;
        }
        .data-table { width: 100%; border-collapse: collapse; text-align: right; }
        .data-table th { padding: 1.2rem; color: #94a3b8; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
        .data-table td { padding: 1.2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        .tag { background: rgba(99, 102, 241, 0.1); color: #818cf8; padding: 0.3rem 0.8rem; border-radius: 6px; font-size: 0.8rem; }
        .status-tag { padding: 0.3rem 0.8rem; border-radius: 6px; font-size: 0.8rem; }
        .status-tag.scheduled { background: rgba(245, 158, 11, 0.1); color: #fbbf24; }
        .status-tag.completed { background: rgba(16, 185, 129, 0.1); color: #34d399; }
        .btn-primary { background: #6366f1; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 12px; cursor: pointer; font-weight: 600; }
        .btn-sm { background: rgba(255, 255, 255, 0.05); color: #f8fafc; border: 1px solid rgba(255, 255, 255, 0.1); padding: 0.4rem 0.8rem; border-radius: 8px; cursor: pointer; }
        .mt-4 { margin-top: 2rem; }
      `}} />
    </div>
  );
}
