import prisma from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function VerifyPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token;
  
  if (!token) {
    return (
      <div className="dashboard-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="card glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <h2 style={{ color: '#ef4444' }}>رابط التفعيل غير صالح</h2>
          <Link href="/login" className="btn-outline" style={{ marginTop: '1rem', display: 'inline-block' }}>العودة لتسجيل الدخول</Link>
        </div>
      </div>
    );
  }

  const user = await prisma.user.findFirst({
    where: { verificationToken: token }
  });

  if (!user) {
    return (
      <div className="dashboard-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
         <div className="card glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <h2 style={{ color: '#ef4444' }}>الرابط منتهي الصلاحية أو غير صحيح</h2>
            <Link href="/login" className="btn-outline" style={{ marginTop: '1rem', display: 'inline-block' }}>العودة لتسجيل الدخول</Link>
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
