import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, type, phone, city, description } = body;

    if (!name || !phone || !city) {
      return NextResponse.json({ error: 'برجاء ملء الاسم ورقم الهاتف والمدينة أولاً' }, { status: 400 });
    }

    // @ts-ignore
    const lead = await prisma.advertiseLead.create({
      data: {
        name: String(name).trim(),
        type: type === 'specialist' ? 'specialist' : 'center',
        phone: String(phone).trim(),
        city: String(city).trim(),
        description: description ? String(description).trim() : null,
        status: 'NEW',
      },
    });

    return NextResponse.json({ success: true, id: lead.id });
  } catch (error) {
    console.error('Advertise lead error:', error);
    return NextResponse.json({ error: 'فشل التسجيل، حاول مرة أخرى' }, { status: 500 });
  }
}
