import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const specialists = await prisma.user.findMany({
      where: { role: 'SPECIALIST' },
      select: { id: true, name: true, email: true }
    });
    return NextResponse.json({ success: true, specialists });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
