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
    const [advertise, jobs] = await Promise.all([
      prisma.advertiseLead.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.jobApplication.findMany({ orderBy: { createdAt: 'desc' } }),
    ]);

    return NextResponse.json({ advertise, jobs });
  } catch (error) {
    console.error('Leads fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { type, id, status } = body;

    if (!type || !id || !status) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (type === 'advertise') {
      // @ts-ignore
      await prisma.advertiseLead.update({ where: { id }, data: { status } });
    } else if (type === 'jobs') {
      // @ts-ignore
      await prisma.jobApplication.update({ where: { id }, data: { status } });
    } else {
      return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Leads update error:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (type === 'advertise') {
      // @ts-ignore
      await prisma.advertiseLead.delete({ where: { id } });
    } else if (type === 'jobs') {
      // @ts-ignore
      await prisma.jobApplication.delete({ where: { id } });
    } else {
      return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Leads delete error:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}