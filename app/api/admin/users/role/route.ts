import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only SUPER_ADMIN can change roles to ADMIN or SUPER_ADMIN
    // ADMIN can change roles to MODERATOR, SPECIALIST, PARENT
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes((session.user as any).role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, role } = await req.json();
    const currentUserRole = (session.user as any).role;

    if (role === 'SUPER_ADMIN' && currentUserRole !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Only Super Admin can appoint another Super Admin' }, { status: 403 });
    }

    if (role === 'ADMIN' && currentUserRole !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Only Super Admin can appoint Admins' }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json({ success: true, role: updatedUser.role });
  } catch (error) {
    console.error('Update Role Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
