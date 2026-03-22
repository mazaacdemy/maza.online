import prisma from "@/lib/prisma";
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;

  if (!token) {
    return (
      <div className="verify-container">
        <div className="glass card text-center">
          <h1 className="error-title">رابط التحقق غير صالح</h1>
          <p>يرجى التأكد من الرابط أو محاولة تسجيل الدخول مجدداً.</p>
          <Link href="/login" className="btn-outline-small mt-4 inline-block">العودة لتسجيل الدخول</Link>
        </div>
        <VerifyStyles />
      </div>
    );
  }

  const user = await prisma.user.findFirst({
    where: { verificationToken: token }
  });

  if (!user) {
    return (
      <div className="verify-container">
        <div className="glass card text-center">
          <h1 className="error-title">الرابط منتهي أو غير صحيح</h1>
          <p>يبدو أنك قمت بتفعيل حسابك مسبقاً، أو الرابط خاطئ.</p>
          <Link href="/login" className="btn-outline-small mt-4 inline-block">العودة لتسجيل الدخول</Link>
        </div>
        <VerifyStyles />
      </div>
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      verificationToken: null
    }
  });

  return (
    <div className="verify-container">
      <div className="glass card text-center">
        <div className="success-icon">✅</div>
        <h1 className="success-title">تم التحقق بنجاح!</h1>
        <p>شكراً لك، تم تأكيد بريدك الإلكتروني بنجاح ويمكنك الآن الدخول للمنصة.</p>
        <Link href="/login?verified=true" className="btn-gradient mt-6 block p-3 rounded-xl font-bold">تسجيل الدخول الآن</Link>
      </div>
      <VerifyStyles />
    </div>
  );
}

function VerifyStyles() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      .verify-container { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #0f172a; color: #f8fafc; direction: rtl; }
      .glass { background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 3rem; max-width: 400px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
      .error-title { color: #f87171; font-size: 1.5rem; margin-bottom: 1rem; }
      .success-title { color: #4ade80; font-size: 1.5rem; margin-bottom: 1rem; }
      .success-icon { font-size: 4rem; margin-bottom: 1rem; }
      .btn-outline-small { background: transparent; color: #818cf8; border: 1px solid #6366f1; padding: 0.8rem 1.5rem; border-radius: 8px; text-decoration: none; transition: 0.3s; }
      .btn-outline-small:hover { background: rgba(99, 102, 241, 0.1); }
      .btn-gradient { background: linear-gradient(135deg, #6366f1, #a855f7); color: white; text-decoration: none; border: none; text-align: center; }
      .mt-4 { margin-top: 1rem; }
      .mt-6 { margin-top: 1.5rem; }
      .inline-block { display: inline-block; }
      .block { display: block; }
      .p-3 { padding: 0.75rem; }
      .rounded-xl { border-radius: 0.75rem; }
      .font-bold { font-weight: bold; }
    `}} />
  );
}
