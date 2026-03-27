import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { sendEmail } from '@/lib/mailer';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // For security, don't reveal if user exists
      return NextResponse.json({ message: 'If an account exists with this email, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // @ts-ignore
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

    await sendEmail({
      to: email,
      subject: 'استعادة كلمة المرور - منصة ماذا',
      html: `
        <div style="direction: rtl; font-family: sans-serif; text-align: center; padding: 20px; background: #0f172a; color: white; border-radius: 10px;">
          <h2 style="color: #818cf8;">استعادة كلمة المرور</h2>
          <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك على منصة ماذا.</p>
          <p>يرجى الضغط على الزر أدناه لتعيين كلمة مرور جديدة:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">تعيين كلمة مرور جديدة</a>
          <p style="margin-top: 30px; font-size: 12px; color: #94a3b8;">إذا لم تطلب هذا، يمكنك تجاهل هذا البريد بأمان.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'If an account exists with this email, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء معالجة الطلب' }, { status: 500 });
  }
}
