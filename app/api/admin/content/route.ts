import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    // @ts-ignore - Ignoring if prisma types are slow to update
    const settings = await prisma.setting.findMany();
    const contentMap = settings.reduce((acc: Record<string, string>, s: any) => {
      acc[s.key] = s.value;
      return acc;
    }, {});
    return NextResponse.json(contentMap);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();

    // Upsert all keys
    const prismaCalls = Object.entries(body).map(([key, value]) => {
      // @ts-ignore
      return prisma.setting.upsert({
        where: { key: key },
        update: { value: value as string },
        create: { key: key, value: value as string },
      });
    });

    await Promise.all(prismaCalls);

    return NextResponse.json({ message: 'Content updated successfully' });
  } catch (error) {
    console.error('Content update error:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
