import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function ParentPatientsPage() {
  const parentEmail = 'parent@maza.com';
  const parent = await prisma.user.findUnique({
    where: { email: parentEmail },
    include: {
      patients: true,
    }
  });

  if (!parent) return <div>User not found</div>;

  return (
    <div className="dashboard-container">
      <div className="bg-blur"></div>
      
      <aside className="sidebar-glass">
        <h2 className="logo">ماذا</h2>
        <nav className="side-nav">
          <Link href="/dashboard/parent">الرئيسية</Link>
          <Link href="/dashboard/parent/patients" className="active">إدارة الأبناء</Link>
          <Link href="/telehealth">الجلسات القادمة</Link>
          <Link href="/report">التقارير</Link>
          <Link href="/booking">حجز جديد</Link>
          <Link href="/welcome" className="logout-link">الخروج</Link>
        </nav>
      </aside>

      <main className="content">
        <header className="main-header">
          <h1>إدارة ملفات الأبناء</h1>
          <div className="actions">
            <Link href="/dashboard/parent/patients/new" className="btn-gradient no-underline">+ إضافة طفل جديد</Link>
          </div>
        </header>

        <section className="patients-list mt-4">
          <div className="glass table-responsive">
            <table className="patients-table">
              <thead>
                <tr className="table-header-row">
                  <th className="th-cell">الاسم</th>
                  <th className="th-cell">تاريخ الميلاد</th>
                  <th className="th-cell">التشخيص المبدئي</th>
                  <th className="th-cell">تاريخ الإضافة</th>
                  <th className="th-cell">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {parent.patients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-cell">
                      الرجاء الضغط على "إضافة طفل جديد" للبدء في حجز التقييمات.
                    </td>
                  </tr>
                ) : (
                  parent.patients.map(patient => (
                    <tr key={patient.id} className="table-row">
                      <td className="td-cell">{patient.name}</td>
                      <td className="td-cell-secondary">{new Date(patient.dateOfBirth).toLocaleDateString('ar-EG')}</td>
                      <td className="td-cell-secondary">{patient.diagnosis || 'لم يحدد بعد'}</td>
                      <td className="td-cell-dim">{new Date(patient.createdAt).toLocaleDateString('ar-EG')}</td>
                      <td className="td-cell">
                        <Link href={`/dashboard/parent/patients/${patient.id}`} className="btn-outline-small no-underline">الملف الرقمي</Link>
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
        .dashboard-container { display: flex; min-height: 100vh; background: #0f172a; color: #f8fafc; direction: rtl; }
        .bg-blur { position: fixed; width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%); z-index: 0; top: -10%; left: -10%; }
        .sidebar-glass { width: 250px; background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(20px); border-left: 1px solid rgba(255, 255, 255, 0.1); padding: 2.5rem; display: flex; flex-direction: column; gap: 3rem; z-index: 10; }
        .logo { font-size: 2rem; font-weight: 800; color: #6366f1; }
        .side-nav { display: flex; flex-direction: column; gap: 1rem; flex: 1; }
        .side-nav a { color: #94a3b8; text-decoration: none; padding: 1rem; border-radius: 12px; transition: 0.3s; }
        .side-nav a.active, .side-nav a:hover { background: rgba(99, 102, 241, 0.1); color: #818cf8; }
        .logout-link { margin-top: auto; }
        .content { flex: 1; padding: 3rem; z-index: 1; overflow-y: auto; }
        .main-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .glass { background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; }
        .btn-gradient { background: linear-gradient(135deg, #6366f1, #a855f7); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 12px; cursor: pointer; font-weight: 600; }
        .btn-outline-small { background: transparent; color: #818cf8; border: 1px solid #6366f1; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; transition: 0.3s; display: inline-block; }
        .btn-outline-small:hover { background: rgba(99, 102, 241, 0.1); }
        .no-underline { text-decoration: none; }
        .mt-4 { margin-top: 2rem; }
        .table-responsive { overflow-x: auto; }
        
        .patients-table { width: 100%; text-align: right; border-collapse: collapse; }
        .table-header-row { border-bottom: 1px solid rgba(255,255,255,0.1); }
        .th-cell { padding: 1.5rem; color: #94a3b8; }
        .td-cell { padding: 1.5rem; }
        .td-cell-secondary { padding: 1.5rem; color: #cbd5e1; }
        .td-cell-dim { padding: 1.5rem; color: #94a3b8; }
        .table-row { border-bottom: 1px solid rgba(255,255,255,0.05); }
        .empty-cell { padding: 2rem; textAlign: center; color: #cbd5e1; }
      `}} />
    </div>
  );
}
