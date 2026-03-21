import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function ParentDashboard() {
  // In a real app, we get this ID from the session (NextAuth)
  // For this demo, we use the ID of the parent we seeded (parent@maza.com)
  const parentEmail = 'parent@maza.com';
  const parent = await prisma.user.findUnique({
    where: { email: parentEmail },
    include: {
      patients: {
        include: { assessments: true }
      },
      appointments: true,
    }
  });

  if (!parent) return <div>User not found</div>;

  const totalPatients = parent.patients.length;
  const completedSessions = 0; // Simplified for now
  const upcomingAppointments = parent.appointments.filter(a => a.status === 'Scheduled').length;

  return (
    <div className="dashboard-container">
      <div className="bg-blur"></div>
      
      <aside className="sidebar-glass">
        <h2 className="logo">ماذا</h2>
        <nav className="side-nav">
          <Link href="#" className="active">الرئيسية</Link>
          <Link href="/telehealth">الجلسات القادمة</Link>
          <Link href="/report">التقارير</Link>
          <Link href="/booking">حجز جديد</Link>
        </nav>
      </aside>

      <main className="content">
        <header className="main-header">
          <h1>مرحباً بك، ولي الأمر</h1>
          <div className="user-profile">الملف الشخصي</div>
        </header>

        <section className="stats-grid">
          <div className="stat-card glass">
            <h3>أطفالي المسجلين</h3>
            <p className="value">{totalPatients}</p>
          </div>
          <div className="stat-card glass">
            <h3>التقييمات الحالية</h3>
            <p className="value">{parent.patients.reduce((acc, p) => acc + p.assessments.length, 0)}</p>
          </div>
          <div className="stat-card glass">
            <h3>مواعيد قادمة</h3>
            <p className="value">{upcomingAppointments}</p>
          </div>
        </section>

        <section className="progress-section glass">
          <h3>تطور الأطفال (Yahia & Saja)</h3>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '1.5rem' }}>
            {parent.patients.map(p => (
              <li key={p.id} style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                <strong>{p.name}</strong> - {p.diagnosis || 'متابعة دورية'}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background: var(--bg-color);
          color: var(--text-primary);
          direction: rtl;
        }

        .bg-blur {
          position: fixed;
          width: 50vw;
          height: 50vw;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
          z-index: 0;
          top: -10%;
          left: -10%;
        }

        .sidebar-glass {
          width: 250px;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border-left: 1px solid var(--glass-border);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 3rem;
          z-index: 10;
        }

        .logo { font-size: 2rem; font-weight: 800; color: #6366f1; }

        .side-nav { display: flex; flex-direction: column; gap: 1rem; }

        .side-nav a {
          color: var(--text-secondary);
          text-decoration: none;
          padding: 1rem;
          border-radius: 12px;
          transition: 0.3s;
        }

        .side-nav a.active, .side-nav a:hover {
          background: rgba(99, 102, 241, 0.1);
          color: var(--accent-primary);
        }

        .content { flex: 1; padding: 3rem; z-index: 1; }

        .main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .glass {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 2rem;
        }

        .stat-card h3 { color: var(--text-secondary); font-size: 1rem; }
        .stat-card .value { font-size: 2.5rem; font-weight: 800; margin-top: 1rem; }

        .progress-section { min-height: 300px; }

        .chart-placeholder {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px dashed rgba(255, 255, 255, 0.2);
          margin-top: 2rem;
          color: var(--text-secondary);
        }
      `}} />
    </div>
  );
}
