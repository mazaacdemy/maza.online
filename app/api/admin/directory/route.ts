import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

function slugify(input: string): string {
  const base = input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60);
  return base || `listing-${Date.now()}`;
}

export async function GET() {
  try {
    // @ts-ignore
    const listings = await prisma.directoryListing.findMany({
      orderBy: [{ approved: 'asc' }, { featured: 'desc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json(listings);
  } catch (error) {
    console.error('Fetch directory error:', error);
    return NextResponse.json({ error: 'Failed to fetch directory' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes((session.user as any).role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    if (!body.name || !body.phone || !body.city) {
      return NextResponse.json({ error: 'name, phone and city are required' }, { status: 400 });
    }

    // @ts-ignore
    const existing = await prisma.directoryListing.findUnique({ where: { slug: slugify(body.name) } });
    if (existing) {
      return NextResponse.json({ error: 'هذا الاسم مستخدم بالفعل' }, { status: 409 });
    }

    // @ts-ignore
    const listing = await prisma.directoryListing.create({
      data: {
        slug: slugify(body.name),
        name: body.name,
        type: body.type || 'center',
        phone: body.phone,
        city: body.city,
        description: body.description || null,
        services: body.services ? JSON.stringify(body.services) : null,
        image: body.image || null,
        featured: body.featured || false,
        approved: body.approved || false,
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error('Create listing error:', error);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
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
    const listing = await prisma.directoryListing.update({
      where: { id: body.id },
      data: {
        name: body.name ?? undefined,
        type: body.type ?? undefined,
        phone: body.phone ?? undefined,
        city: body.city ?? undefined,
        description: body.description ?? undefined,
        services: body.services !== undefined ? JSON.stringify(body.services) : undefined,
        image: body.image ?? undefined,
        featured: body.featured ?? undefined,
        approved: body.approved ?? undefined,
      },
    });

    return NextResponse.json(listing);
  } catch (error) {
    console.error('Update listing error:', error);
    return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 });
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
    await prisma.directoryListing.delete({ where: { id } });

    return NextResponse.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Delete listing error:', error);
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 });
  }
}
