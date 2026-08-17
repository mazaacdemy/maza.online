import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    // @ts-ignore
    const sections = await prisma.section.findMany({
      orderBy: [{ pageId: 'asc' }, { order: 'asc' }],
    });
    return NextResponse.json(sections);
  } catch (error) {
    console.error('Fetch sections error:', error);
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes((session.user as any).role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    if (!body.pageId) {
      return NextResponse.json({ error: 'pageId is required' }, { status: 400 });
    }

    // @ts-ignore
    const maxOrder = await prisma.section.aggregate({
      where: { pageId: body.pageId },
      _max: { order: true },
    });

    // @ts-ignore
    const section = await prisma.section.create({
      data: {
        pageId: body.pageId,
        title: body.title || null,
        content: body.content || null,
        image: body.image || null,
        type: body.type || 'text',
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    console.error('Create section error:', error);
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes((session.user as any).role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    // @ts-ignore
    const section = await prisma.section.update({
      where: { id: body.id },
      data: {
        title: body.title ?? null,
        content: body.content ?? null,
        image: body.image ?? null,
        type: body.type ?? 'text',
        order: body.order ?? 0,
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error('Update section error:', error);
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes((session.user as any).role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    // @ts-ignore
    await prisma.section.delete({ where: { id } });

    return NextResponse.json({ message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Delete section error:', error);
    return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 });
  }
}
