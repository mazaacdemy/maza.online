import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

function generateCouponCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'QUIZ-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function GET() {
  try {
    const questions = await prisma.quizQuestion.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });

    const payload = questions.map(q => ({
      id: q.id,
      text: q.text,
      options: JSON.parse(q.options || '[]'),
      correct: q.correct,
    }));

    return NextResponse.json({ questions: payload });
  } catch (error) {
    console.error('Quiz questions error:', error);
    return NextResponse.json({ error: 'Failed to load quiz' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { name, phone, points, discount } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'برجاء إدخال اسمك ورقم هاتفك لحفظ الخصم' }, { status: 400 });
    }

    const cleanName = String(name).trim();
    const cleanPhone = String(phone).trim();
    const finalPoints = Number(points) || 0;
    const finalDiscount = Number(discount) || 0;

    let result;
    let requiresAuth = false;
    let couponCode: string | null = null;

    const userId = (session?.user as any)?.id;
    if (userId) {
      result = await prisma.quizResult.create({
        data: {
          name: cleanName,
          phone: cleanPhone,
          points: finalPoints,
          discount: finalDiscount,
          status: 'NEW',
          userId,
        },
      });

      couponCode = generateCouponCode();
      await prisma.coupon.create({
        data: {
          code: couponCode,
          discount: finalDiscount,
          userId,
          type: 'QUIZ_DISCOUNT',
        },
      });
    } else {
      result = await prisma.quizResult.create({
        data: {
          name: cleanName,
          phone: cleanPhone,
          points: finalPoints,
          discount: finalDiscount,
          status: 'NEW',
          userId: null,
        },
      });
      requiresAuth = true;
    }

    return NextResponse.json({ 
      success: true, 
      id: result.id,
      requiresAuth,
      couponCode,
      discount: finalDiscount,
    });
  } catch (error) {
    console.error('Quiz result error:', error);
    return NextResponse.json({ error: 'فشل حفظ النتيجة، حاول مرة أخرى' }, { status: 500 });
  }
}