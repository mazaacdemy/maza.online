import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { specialistId, date, type } = await req.json();

    if (!specialistId || !date || !type) {
        return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!currentUser) throw new Error('User not found');

    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        type,
        status: 'Scheduled',
        parentId: currentUser.id,
        specialistId,
      }
    });

    return NextResponse.json({ success: true, appointment });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
