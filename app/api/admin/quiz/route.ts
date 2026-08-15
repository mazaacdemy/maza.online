import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

function isAdmin(session: any) {
  return session && ['ADMIN', 'SUPER_ADMIN'].includes(session.user?.role);
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // @ts-ignore
    const [questions, results] = await Promise.all([
      prisma.quizQuestion.findMany({ orderBy: { order: 'asc' } }),
      prisma.quizResult.findMany({ orderBy: { createdAt: 'desc' } }),
    ]);

    return NextResponse.json({ questions, results });
  } catch (error) {
    console.error('Quiz admin fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { id } = body;

    if (body.kind === 'question') {
      const { text, options, correct, order, active } = body;
      if (!text || !Array.isArray(options) || options.length === 0) {
        return NextResponse.json({ error: 'بيانات السؤال غير مكتملة' }, { status: 400 });
      }
      if (id) {
        // @ts-ignore
        await prisma.quizQuestion.update({
          where: { id },
          data: {
            text,
            options: JSON.stringify(options),
            correct: Number(correct) || 0,
            order: Number(order) || 0,
            active: active !== undefined ? Boolean(active) : true,
          },
        });
      } else {
        // @ts-ignore
        await prisma.quizQuestion.create({
          data: {
            text,
            options: JSON.stringify(options),
            correct: Number(correct) || 0,
            order: Number(order) || 0,
            active: active !== undefined ? Boolean(active) : true,
          },
        });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown kind' }, { status: 400 });
  } catch (error) {
    console.error('Quiz question save error:', error);
    return NextResponse.json({ error: 'Failed to save question' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const kind = searchParams.get('kind');
    const id = searchParams.get('id');

    if (!kind || !id) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (kind === 'question') {
      // @ts-ignore
      await prisma.quizQuestion.delete({ where: { id } });
    } else if (kind === 'result') {
      // @ts-ignore
      await prisma.quizResult.delete({ where: { id } });
    } else {
      return NextResponse.json({ error: 'Unknown kind' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Quiz delete error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}