import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  // --- Data Fetching from PostgreSQL via Prisma ---
  // In a real scenario, this uses the currently authenticated specialist's ID
  const totalPatients = await prisma.patient.count();
  const upcomingSessionsList = await prisma.appointment.findMany({
    where: { status: 'Scheduled' },
    include: { parent: true },
    take: 5,
    orderBy: { date: 'asc' }
  });
  const upcomingSessionsCount = upcomingSessionsList.length;

  const recentReportsList = await prisma.assessment.findMany({
    include: { patient: true },
    take: 3,
    orderBy: { id: 'desc' }
  });
  const recentReportsCount = recentReportsList.length;
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar glass-panel">
        <div className="logo">
          <div className="logo-icon">M</div>
          <h2>ماذا <span>(Maza)</span></h2>
        </div>
        <nav className="side-nav">
          <a href="#" className="nav-item active">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            الرئيسية
          </a>
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
                <span className="name">د. مصطفى كمال</span>
                <span className="role">أخصائي تخاطب وتعديل سلوك</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-grid">
          <div className="stat-cards">
            <div className="card glass-panel gradient-border">
              <h3>جلسات اليوم</h3>
              <div className="value">{upcomingSessionsCount}</div>
              <p className="trend positive">↑ بيانات متصلة بـ DB</p>
            </div>
            <div className="card glass-panel gradient-border">
              <h3>تقارير AI المنجزة</h3>
              <div className="value text-gradient">{recentReportsCount}</div>
              <p className="trend">في انتظار المراجعة</p>
            </div>
            <div className="card glass-panel gradient-border">
              <h3>الحالات المسجلة</h3>
              <div className="value">{totalPatients}</div>
              <p className="trend positive">↑ متصل بجدول Patients</p>
            </div>
            <div className="card glass-panel gradient-border earnings-card">
              <h3>إيرادات الشهر</h3>
              <div className="value">$1,250 <span className="local-currency">/ 12,000 ج.م</span></div>
              <p className="trend positive">مدفوعات دولية ومحلية نشطة</p>
            </div>
          </div>

          <div className="content-row">
            <div className="card glass-panel upcoming-sessions" style={{ gridColumn: "span 2" }}>
              <div className="card-header">
                <h2>مواعيد اليوم (Telehealth)</h2>
                <Link href="/dashboard/specialist/sessions" className="btn-outline">عرض الكل</Link>
              </div>
              <ul className="session-list">
                {upcomingSessionsList.length > 0 ? upcomingSessionsList.map((session: any, idx: number) => (
                  <li className="session-item" key={session.id}>
                    <div className="time">{new Date(session.date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="details">
                      <h4>{session.parent.name} <span className="tag tag-speech">{session.type}</span></h4>
                      <p>جلسة متابعة - حالة {idx === 0 ? 'يحيى' : 'سجا'}</p>
                    </div>
                    <button className="btn-primary join-btn">
                      انضمام للجلسة
                    </button>
                  </li>
                )) : (
                  <p style={{ padding: '1rem', color: 'var(--text-secondary)' }}>لا توجد جلسات مجدولة اليوم.</p>
                )}
              </ul>
            </div>

            <div className="card glass-panel ai-widget">
              <div className="card-header">
                <h2>مساعد Maza الذكي ✨</h2>
              </div>
              <div className="ai-content">
                <div className="ai-burst"></div>
                <p>تم تحليل تقييم حالة &quot;ياسين محمد&quot; بنجاح. لقد صممت مسودة البرنامج العلاجي (IEP).</p>
                <button className="btn-gradient mt-4">مراجعة تقرير الحالة واعتماده</button>
              </div>
              <div className="recent-reports mt-4">
                <h4>تقارير بانتظارك</h4>
                {recentReportsList.map((report: any) => (
                  <div className="report-item" key={report.id}>
                    <span>{report.type} - {report.patient.name}</span>
                    <span className="status ready">جاهز</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
