import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function CenterSpecialistsPage() {
  const session = await getServerSession(authOptions);
  
  // Real implementation: where: { centerId: currentUser.id, role: 'SPECIALIST' }
  const specialists = await prisma.user.findMany({
    where: { role: 'SPECIALIST' },
    orderBy: { createdAt: 'desc' },
    include: {
      assessments: true,
      _count: {
        select: { specialistSessions: true }
      }
    }
  });

  return (
    <div className="dashboard-container min-h-screen">
      
      <aside className="sidebar glass-panel">
        <div className="logo">
          <div className="logo-icon admin-bg-warning">C</div>
          <h2>ماذا <span>(Center)</span></h2>
        </div>
        <nav className="side-nav">
          <Link href="/dashboard/center" className="nav-item">
            لوحة قيادة المركز
          </Link>
          <Link href="/dashboard/center/specialists" className="nav-item active">
            إدارة الأخصائيين
          </Link>
        </nav>
      </aside>

      <main className="main-content flex-col">
        <header className="topbar">
          <h1 className="text-primary-no-margin line-height-18">إدارة الأخصائيين التابعين للمركز</h1>
          <div className="actions">
            <button className="btn-gradient px-1 py-05">+ دعوة أخصائي جديد</button>
          </div>
        </header>

        <section className="card glass-panel mt-1">
          <div className="telehealth-notes-area mb-1">
            <table className="w-full-h-full-no-border" width="100%">
              <thead>
                <tr className="border-bottom-glass p-1">
                  <th className="color-accent-primary p-1">الاسم</th>
                  <th className="color-accent-primary p-1">البريد الإلكتروني</th>
                  <th className="color-accent-primary p-1">تاريخ الانضمام</th>
                  <th className="color-accent-primary p-1 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {specialists.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-2 text-center text-secondary">لا يوجد أخصائيين مضافين بعد</td>
                  </tr>
                ) : (
                  specialists.map(spec => (
                     <tr key={spec.id} className="border-bottom-glass-light p-1">
                      <td className="p-1">{spec.name}</td>
                      <td className="p-1 text-secondary">{spec.email}</td>
                      <td className="p-1 text-secondary">
                        {new Date(spec.createdAt).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="p-1 text-center">
                        <button className="btn-outline">إزالة</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
