import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // @ts-ignore
    let listing = await prisma.directoryListing.findUnique({
      where: { slug },
    });

    if (!listing || !listing.approved) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Track views (fire-and-forget, never blocks the response)
    // @ts-ignore
    prisma.directoryListing.update({
      where: { id: listing.id },
      data: { views: { increment: 1 } },
    }).catch(() => {});

    // Get session to decide if contact info is revealed
    const session = await getServerSession(authOptions);
    const isLoggedIn = !!session?.user;

    // The core of the login-wall: hide phone from anonymous visitors
    const publicListing = isLoggedIn ? listing : { ...listing, phone: null as string | null };

    return NextResponse.json({ listing: publicListing, locked: !isLoggedIn });
  } catch (error) {
    console.error('Fetch listing error:', error);
    return NextResponse.json({ error: 'Failed to fetch listing' }, { status: 500 });
  }
}
