import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function SpecialistAssessmentsPage() {
  const assessments = await prisma.assessment.findMany({
    include: { patient: true },
    orderBy: { date: 'desc' }
  });

  return (
    <div className="dashboard-container">
      <div className="bg-blur"></div>
      
      <aside className="sidebar-glass">
        <h2 className="logo">ماذا</h2>
        <nav className="side-nav">
          <Link href="/dashboard/specialist">الرئيسية</Link>
          <Link href="/dashboard/specialist/sessions">جلسات التخاطب</Link>
          <Link href="/dashboard/specialist/assessments" className="active">تقييمات AI</Link>
          <Link href="/welcome">الخروج</Link>
        </nav>
      </aside>

      <main className="content">
        <header className="main-header">
          <h1>تقارير التقييم الذكية (AI Assessments)</h1>
          <div className="actions">
            <button className="btn-gradient">بدء تقييم جديد ✨</button>
          </div>
        </header>

        <section className="assessments-grid mt-4">
          {assessments.map(assessment => (
            <div className="assessment-card glass" key={assessment.id}>
              <div className="card-header">
                <h3>{assessment.patient.name}</h3>
                <span className="date">{new Date(assessment.date).toLocaleDateString('ar-EG')}</span>
              </div>
              <div className="type-tag">{assessment.type}</div>
              <p className="summary">{assessment.aiSummary?.substring(0, 100)}...</p>
              <div className="footer">
                <button className="btn-outline">عرض التقرير الكامل</button>
              </div>
            </div>
          ))}
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
        .assessments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }
        .glass {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 2rem;
        }
        .assessment-card { display: flex; flex-direction: column; gap: 1rem; transition: 0.3s; }
        .assessment-card:hover { transform: translateY(-5px); border-color: #6366f1; }
        .card-header { display: flex; justify-content: space-between; align-items: center; }
        .card-header h3 { font-size: 1.2rem; }
        .date { font-size: 0.8rem; color: #94a3b8; }
        .type-tag { background: rgba(99, 102, 241, 0.1); color: #818cf8; padding: 0.4rem 1rem; border-radius: 50px; font-size: 0.85rem; align-self: flex-start; }
        .summary { font-size: 0.9rem; color: #cbd5e1; line-height: 1.6; }
        .btn-gradient { background: linear-gradient(135deg, #6366f1, #a855f7); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 12px; cursor: pointer; font-weight: 600; }
        .btn-outline { background: transparent; color: #818cf8; border: 1px solid #6366f1; padding: 0.6rem 1rem; border-radius: 10px; cursor: pointer; transition: 0.3s; width: 100%; }
        .btn-outline:hover { background: rgba(99, 102, 241, 0.1); }
        .mt-4 { margin-top: 2rem; }
      `}} />
    </div>
  );
}
