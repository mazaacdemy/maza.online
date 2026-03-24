import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    // @ts-ignore
    const user = await prisma.user.findFirst({
      where: {
        // @ts-ignore
        resetToken: token,
        // @ts-ignore
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'رمز استعادة كلمة المرور غير صالح أو منتهي الصلاحية' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // @ts-ignore
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ message: 'تم تغيير كلمة المرور بنجاح' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء معالجة الطلب' }, { status: 500 });
  }
}
