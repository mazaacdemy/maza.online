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
          <div className="logo-icon admin-bg-warning">A</div>
          <h2>إدارة ماذا <span>(Maza)</span></h2>
        </div>
        <nav className="side-nav">
          <Link href="/dashboard/admin" className="nav-item active">
            لوحة قيادة النظام (Super Admin)
          </Link>
          <Link href="/dashboard/admin/users" className="nav-item">
            إدارة المستخدمين والأخصائيين
          </Link>
          <Link href="/dashboard/admin/payments" className="nav-item">
            تقارير الإيرادات (Geo-Payments)
          </Link>
          <Link href="/dashboard/admin/settings" className="nav-item">
            إعدادات المنصة والذكاء الاصطناعي
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div className="search-bar glass-panel">
            <input type="text" placeholder="البحث برقم المعاملة أو الإيميل..." />
          </div>
          <div className="user-profile">
            <div className="profile-info glass-panel admin-border-warning">
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
            <div className="card glass-panel gradient-border admin-border-accent">
              <h3>تقارير AI المكتملة</h3>
              <div className="value">{totalAssessments}</div>
              <p className="trend">عمليات ناجحة عبر Gemini 1.5 Pro</p>
            </div>
          </div>

          <div className="content-row">
            <div className="card glass-panel upcoming-sessions col-span-2">
              <div className="card-header">
                <h2>أحدث المنضمين للمنصة</h2>
                <a href="#" className="btn-outline">إدارة الجميع</a>
              </div>
              <ul className="session-list">
                {recentUsers.map((user: any) => (
                  <li className="session-item" key={user.id}>
                    <div className="details flex-1">
                      <h4 className="flex-center-gap-1">
                        {user.name} 
                        <span className={`tag ${user.role === 'SPECIALIST' ? 'tag-speech' : 'tag-behavior'}`}>
                           {user.role}
                        </span>
                      </h4>
                      <p>{user.email}</p>
                    </div>
                    <div className="text-sm-secondary-mt">
                       {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card glass-panel ai-widget">
               <div className="card-header">
                <h2 className="text-success-sm">مراقب النظام الحي</h2>
              </div>
              <div className="flex-col mt-1 gap-1">
                 <div className="admin-badge-stripe">
                    <h4 className="admin-title-stripe">Stripe / Paymob Webhooks</h4>
                    <p className="text-sm-secondary-mt">تعمل بكفاءة وتستقبل المدفوعات.</p>
                 </div>
                 <div className="admin-badge-daily">
                    <h4 className="admin-title-daily">Daily.co Video Engine</h4>
                    <p className="text-sm-secondary-mt">توليد الغرف نشط.</p>
                 </div>
                 <div className="admin-badge-mail">
                    <h4 className="admin-title-mail">Nodemailer SMTP</h4>
                    <p className="text-sm-secondary-mt">جاهز لإرسال إيميلات التفعيل.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
