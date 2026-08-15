import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // @ts-ignore
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
    const body = await req.json();
    const { name, phone, points, discount } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'برجاء إدخال اسمك ورقم هاتفك لحفظ الخصم' }, { status: 400 });
    }

    // @ts-ignore
    const result = await prisma.quizResult.create({
      data: {
        name: String(name).trim(),
        phone: String(phone).trim(),
        points: Number(points) || 0,
        discount: Number(discount) || 0,
        status: 'NEW',
      },
    });

    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Quiz result error:', error);
    return NextResponse.json({ error: 'فشل حفظ النتيجة، حاول مرة أخرى' }, { status: 500 });
  }
}