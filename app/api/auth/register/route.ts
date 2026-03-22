import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ success: false, error: 'يرجى تعبئة جميع الحقول المطلوبة' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'البريد الإلكتروني مسجل مسبقاً' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomUUID();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as any,
        verificationToken,
      }
    });

    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      
      return NextResponse.json({ 
        success: false, 
        error: 'تم حفظ البيانات لكن فشل إرسال بريد التفعيل. تأكد من إعدادات SMTP في السيرفر.' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, email: user.email, role: user.role },
      message: 'تم إرسال رابط التحقق إلى بريدك الإلكتروني.'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم أثناء إنشاء الحساب' }, { status: 500 });
  }
}
