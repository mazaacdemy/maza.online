import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      specialty,
      degree,
      degreeSpec,
      years,
      isFresh,
      hasTraining,
      trainingWhere,
      cvUrl,
    } = body;

    if (!name || !phone || !specialty) {
      return NextResponse.json({ error: 'برجاء ملء الاسم ورقم الهاتف والتخصص أولاً' }, { status: 400 });
    }

    // @ts-ignore
    const application = await prisma.jobApplication.create({
      data: {
        name: String(name).trim(),
        phone: String(phone).trim(),
        specialty: String(specialty).trim(),
        degree: degree ? String(degree) : null,
        degreeSpec: degreeSpec ? String(degreeSpec).trim() : null,
        years: years !== undefined && years !== '' ? Number(years) : null,
        isFresh: Boolean(isFresh),
        hasTraining: Boolean(hasTraining),
        trainingWhere: trainingWhere ? String(trainingWhere).trim() : null,
        cvUrl: cvUrl ? String(cvUrl) : null,
        status: 'NEW',
      },
    });

    return NextResponse.json({ success: true, id: application.id });
  } catch (error) {
    console.error('Job application error:', error);
    return NextResponse.json({ error: 'فشل التقديم، حاول مرة أخرى' }, { status: 500 });
  }
}