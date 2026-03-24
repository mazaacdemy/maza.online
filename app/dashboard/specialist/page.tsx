import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SpecialistDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email || (session.user as any).role !== "SPECIALIST") {
    redirect('/login');
  }

  const specialistEmail = session.user.email;
  const specialist = await prisma.user.findUnique({
    where: { email: specialistEmail },
    include: {
      specialistSessions: {
        include: { parent: true }
      },
      assessments: {
        include: { patient: true }
      }
    }
  });

  if (!specialist) return <div>User not found</div>;

  const totalPatientsConnected = await prisma.patient.count(); // For an admin/center this would be global, for specialist it could be linked patients only. Just using total for now as an example metric.
  
  const upcomingSessionsList = specialist.specialistSessions
    .filter(a => a.status === 'Scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const upcomingSessionsCount = specialist.specialistSessions.filter(a => a.status === 'Scheduled').length;
  
  const recentReportsList = specialist.assessments
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
    
  const recentReportsCount = specialist.assessments.length;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar glass-panel">
        <div className="logo">
          <div className="logo-icon">M</div>
          <h2>ماذا <span>(Maza)</span></h2>
        </div>
        <nav className="side-nav">
          <Link href="/dashboard/specialist" className="nav-item active">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            الرئيسية
          </Link>
          <Link href="/dashboard/specialist/sessions" className="nav-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            جلسات التخاطب والمتابعة
          </Link>
          <Link href="/dashboard/specialist/assessments" className="nav-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            تقييمات الذكاء الاصطناعي
          </Link>
          <a href="#" className="nav-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            قائمة الحالات
          </a>
          <a href="#" className="nav-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            الإيرادات والتقارير
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div className="search-bar glass-panel">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" placeholder="ابحث عن حالة، تقرير، أو موعد..." />
          </div>
          <div className="user-profile">
            <button className="icon-btn glass-panel notification-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="badge">3</span>
            </button>
            <div className="profile-info glass-panel">
              <img src="https://i.pravatar.cc/100?img=11" alt="Profile" className="avatar" />
              <div className="text">
                <span className="name">{specialist.name}</span>
                <span className="role">أخصائي تخاطب وتعديل سلوك</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-grid">
          <div className="stat-cards">
            <div className="card glass-panel gradient-border">
              <h3>المهام/الجلسات النشطة</h3>
              <div className="value">{upcomingSessionsCount}</div>
              <p className="trend positive">↑ الجلسات المجدولة لك</p>
            </div>
            <div className="card glass-panel gradient-border">
              <h3>تقاريرك المنجزة</h3>
              <div className="value text-gradient">{recentReportsCount}</div>
              <p className="trend">بمساعدة Maza AI</p>
            </div>
            <div className="card glass-panel gradient-border">
              <h3>إجمالي مستخدمي المنصة</h3>
              <div className="value">{totalPatientsConnected}</div>
              <p className="trend">حالة طبية مسجلة بالنظام</p>
            </div>
            <div className="card glass-panel gradient-border earnings-card">
              <h3>إيرادات الشهر</h3>
              <div className="value">$0 <span className="local-currency">/ 0 ج.م</span></div>
              <p className="trend positive">لم يتم تفعيل الدفع الفعلي بعد</p>
            </div>
          </div>

          <div className="content-row">
            <div className="card glass-panel upcoming-sessions" style={{ gridColumn: "span 2" }}>
              <div className="card-header">
                <h2>مواعيدك القادمة</h2>
                <Link href="/dashboard/specialist/sessions" className="btn-outline">عرض الكل</Link>
              </div>
              <ul className="session-list">
                {upcomingSessionsList.length > 0 ? upcomingSessionsList.map((session: any) => (
                  <li className="session-item" key={session.id}>
                    <div className="time">{new Date(session.date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="details">
                      <h4>{session.parent.name} <span className="tag tag-speech">{session.type}</span></h4>
                      <p>تاريخ الجلسة: {new Date(session.date).toLocaleDateString('ar-EG')}</p>
                    </div>
                    <Link href="/telehealth" className="btn-primary join-btn">
                      انضمام للجلسة
                    </Link>
                  </li>
                )) : (
                  <p style={{ padding: '1rem', color: 'var(--text-secondary)' }}>لا توجد جلسات مجدولة لك حالياً.</p>
                )}
              </ul>
            </div>

            <div className="card glass-panel ai-widget">
               <div className="card-header">
                <h2>مساعد Maza الذكي ✨</h2>
              </div>
              <div className="ai-content">
                <div className="ai-burst"></div>
                <p>مرحباً بك! يمكنك كتابة ملاحظات الجلسات أثناء الانعقاد داخل غرفة "telehealth"، وسيقوم نظامنا بتوليد تقرير لك.</p>
              </div>
              <div className="recent-reports mt-4">
                <h4>أحدث التقارير المصدرة</h4>
                {recentReportsList.length > 0 ? recentReportsList.map((report: any) => (
                  <div className="report-item" key={report.id}>
                    <span>{report.type} - حالة: {report.patient.name}</span>
                    <span className="status ready">عرض</span>
                  </div>
                )) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>لا توجد تقارير بعد.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
