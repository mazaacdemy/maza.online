import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // @ts-ignore
    const listings = await prisma.directoryListing.findMany({
      where: { approved: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json(listings);
  } catch (error) {
    console.error('Fetch directory error:', error);
    return NextResponse.json({ error: 'Failed to fetch directory' }, { status: 500 });
  }
}
