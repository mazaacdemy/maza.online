import prisma from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function VerifyPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token;
  
  if (!token) {
    return (
      <div className="dashboard-container flex-center">
        <div className="card glass-panel verify-card">
          <h2 className="text-danger">رابط التفعيل غير صالح</h2>
          <Link href="/login" className="btn-outline mt-1 inline-block">العودة لتسجيل الدخول</Link>
        </div>
      </div>
    );
  }

  const user = await prisma.user.findFirst({
    where: { verificationToken: token }
  });

  if (!user) {
    return (
      <div className="dashboard-container flex-center">
         <div className="card glass-panel verify-card">
            <h2 className="text-danger">الرابط منتهي الصلاحية أو غير صحيح</h2>
            <Link href="/login" className="btn-outline mt-1 inline-block">العودة لتسجيل الدخول</Link>
         </div>
      </div>
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date(), verificationToken: null }
  });

  redirect('/login?verified=true');
}
