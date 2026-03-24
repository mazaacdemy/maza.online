import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email || (session.user as any).role !== "ADMIN") {
    redirect('/login');
  }

  const [
    totalUsers,
    totalPatients,
    totalAppointments,
    totalAssessments,
    recentUsers
  ] = await Promise.all([
    prisma.user.count(),
    prisma.patient.count(),
    prisma.appointment.count(),
    prisma.assessment.count(),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    })
  ]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar glass-panel">
        <div className="logo">
          <div className="logo-icon" style={{ background: 'var(--warning)' }}>A</div>
          <h2>إدارة ماذا <span>(Maza)</span></h2>
        </div>
        <nav className="side-nav">
          <Link href="/dashboard/admin" className="nav-item active">
            لوحة قيادة النظام (Super Admin)
          </Link>
          <a href="#" className="nav-item">
            إدارة المستخدمين والأخصائيين
          </a>
          <a href="#" className="nav-item">
            تقارير الإيرادات (Geo-Payments)
          </a>
          <a href="#" className="nav-item">
            إعدادات الذكاء الاصطناعي (Prompts)
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div className="search-bar glass-panel">
            <input type="text" placeholder="البحث برقم المعاملة أو الإيميل..." />
          </div>
          <div className="user-profile">
            <div className="profile-info glass-panel" style={{ border: '1px solid var(--warning)' }}>
              <div className="text">
                <span className="name">المدير العام (Super Admin)</span>
                <span className="role">{session.user.email}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-grid">
          <div className="stat-cards">
            <div className="card glass-panel gradient-border">
              <h3>إجمالي المستخدمين</h3>
              <div className="value">{totalUsers}</div>
              <p className="trend positive">أخصائيين، أولياء أمور، مراكز</p>
            </div>
            <div className="card glass-panel gradient-border">
              <h3>إجمالي المرضى (Patients)</h3>
              <div className="value text-gradient">{totalPatients}</div>
              <p className="trend positive">ملفات سريرية موثقة</p>
            </div>
            <div className="card glass-panel gradient-border">
              <h3>الجلسات المحجوزة</h3>
              <div className="value">{totalAppointments}</div>
              <p className="trend positive">جلسات (Telehealth / المركز)</p>
            </div>
            <div className="card glass-panel gradient-border" style={{ borderColor: 'var(--accent-secondary)' }}>
              <h3>تقارير AI المكتملة</h3>
              <div className="value">{totalAssessments}</div>
              <p className="trend">عمليات ناجحة عبر Gemini 1.5 Pro</p>
            </div>
          </div>

          <div className="content-row">
            <div className="card glass-panel upcoming-sessions" style={{ gridColumn: "span 2" }}>
              <div className="card-header">
                <h2>أحدث المنضمين للمنصة</h2>
                <a href="#" className="btn-outline">إدارة الجميع</a>
              </div>
              <ul className="session-list">
                {recentUsers.map((user: any) => (
                  <li className="session-item" key={user.id}>
                    <div className="details" style={{ flex: 1 }}>
                      <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {user.name} 
                        <span className={`tag ${user.role === 'SPECIALIST' ? 'tag-speech' : 'tag-behavior'}`}>
                           {user.role}
                        </span>
                      </h4>
                      <p>{user.email}</p>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                       {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card glass-panel ai-widget">
               <div className="card-header">
                <h2 style={{ color: 'var(--success)' }}>مراقب النظام الحي</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                 <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                    <h4 style={{ color: '#10b981', marginBottom: '0.3rem' }}>Stripe / Paymob Webhooks</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>تعمل بكفاءة وتستقبل المدفوعات.</p>
                 </div>
                 <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '4px solid #8b5cf6' }}>
                    <h4 style={{ color: '#8b5cf6', marginBottom: '0.3rem' }}>Daily.co Video Engine</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>توليد الغرف نشط.</p>
                 </div>
                 <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                    <h4 style={{ color: '#f59e0b', marginBottom: '0.3rem' }}>Nodemailer SMTP</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>جاهز لإرسال إيميلات التفعيل.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
