import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from 'next/navigation';
import { Prisma } from "@prisma/client";

export const dynamic = 'force-dynamic';

// Explicit local interface to satisfy IDE when Prisma types are stale
interface AppointmentWithRelations {
  id: string;
  date: Date;
  type: string;
  status: string;
  parentId: string;
  specialistId: string;
  paymentStatus: string;
  stripeSessionId: string | null;
  price: number | null;
  specialist: {
    name: string;
  };
  parent: {
    name: string;
  };
}

export default async function AdminPaymentsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email || !['ADMIN', 'SUPER_ADMIN'].includes((session.user as any).role)) {
    redirect('/login');
  }

  // Fetch all appointments that have a price set
  const appointments = (await prisma.appointment.findMany({
    // @ts-ignore - 'price' field is added in schema but IDE might not sync after prisma generate
    where: { price: { not: null } } as any,
    include: { specialist: { select: { name: true } }, parent: { select: { name: true } } },
    orderBy: { date: 'desc' },
  })) as unknown as AppointmentWithRelations[];

  const totalRevenue = appointments.reduce((sum, curr) => {
    if (curr.paymentStatus === 'PAID') {
      return sum + (curr.price || 0);
    }
    return sum;
  }, 0);

  const platformCommission = totalRevenue * 0.20; // 20% platform fee

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar glass-panel">
        <div className="logo">
          <div className="logo-icon admin-bg-warning">A</div>
          <h2>إدارة ماذا <span>(Maza)</span></h2>
        </div>
        <nav className="side-nav">
          <Link href="/dashboard/admin" className="nav-item">لوحة قيادة النظام (Super Admin)</Link>
          <Link href="/dashboard/admin/users" className="nav-item">إدارة المستخدمين والأخصائيين</Link>
          <Link href="/dashboard/admin/payments" className="nav-item active">تقارير الإيرادات (Geo-Payments)</Link>
          <Link href="/dashboard/admin/settings" className="nav-item">إعدادات المنصة والذكاء الاصطناعي</Link>
          <Link href="/dashboard/admin/content" className="nav-item">إدارة محتوى الموقع (CMS)</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar mb-2">
          <h2 className="text-primary text-2xl font-bold">المعاملات المالية والإيرادات</h2>
        </header>

        <div className="stats-grid mb-1-5">
          <div className="card glass-panel gradient-border">
            <h3 className="text-secondary">إجمالي الدخل (Gross)</h3>
            <div className="value mt-1 text-green-400">{totalRevenue} ج.م</div>
          </div>
          <div className="card glass-panel gradient-border admin-border-accent">
            <h3 className="text-secondary">أرباح المنصة (20%)</h3>
            <div className="value mt-1 text-indigo-400">{platformCommission} ج.م</div>
          </div>
          <div className="card glass-panel gradient-border">
            <h3 className="text-secondary">مستحقات الأخصائيين</h3>
            <div className="value mt-1 text-gray-300">{totalRevenue - platformCommission} ج.م</div>
          </div>
        </div>

        <div className="card glass-panel w-full">
          <h3 className="text-lg font-semibold text-secondary mb-2">سجل الجلسات والحجوزات</h3>
          
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-gray-700 text-secondary text-sm">
                <th className="p-2">تاريخ الجلسة</th>
                <th className="p-2">الأخصائي</th>
                <th className="p-2">العميل</th>
                <th className="p-2">المبلغ</th>
                <th className="p-2">حالة الدفع</th>
                <th className="p-2">Stripe Session ID</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(appt => (
                <tr key={appt.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="p-3 text-sm">{new Date(appt.date).toLocaleDateString()}</td>
                  <td className="p-3 font-semibold text-primary">{appt.specialist.name}</td>
                  <td className="p-3 text-secondary text-sm">{appt.parent.name}</td>
                  <td className="p-3 font-bold">{appt.price} ج.م</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${appt.paymentStatus === 'PAID' ? 'bg-green-900/50 text-green-300' : 'bg-yellow-900/50 text-yellow-300'}`}>
                      {appt.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-gray-500 font-mono">
                    {appt.stripeSessionId ? appt.stripeSessionId.slice(0, 15) + '...' : 'N/A'}
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-secondary">لا توجد عمليات دفع حتى الآن.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
