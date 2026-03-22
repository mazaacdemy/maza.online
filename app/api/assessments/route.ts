import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { patientName, summary, iepPlan } = await request.json();

    if (!patientName || !summary || !iepPlan) {
      return NextResponse.json({ success: false, error: 'بيانات التقرير مفقودة' }, { status: 400 });
    }

    let specialistId = (session?.user as any)?.id;
    
    // For Demo: fallback to a demo specialist if not authenticated
    if (!specialistId) {
      let demoSpecialist = await prisma.user.findFirst({ where: { role: 'SPECIALIST' } });
      if (!demoSpecialist) {
        return NextResponse.json({ success: false, error: 'لم يتم العثور على حساب أخصائي محدد' }, { status: 403 });
      }
      specialistId = demoSpecialist.id;
    }

    // Try to find the patient by name (fuzzy match). In production, this should pass patientId from a select dropdown.
    let patient = await prisma.patient.findFirst({
      where: { name: { contains: patientName } }
    });

    // If patient not found, create a dummy container (or fail in strict mode). We'll fail safely.
    if (!patient) {
      return NextResponse.json({ 
        success: false, 
        error: `لم يتم العثور على طفل مسجل بالاسم: ${patientName}. يرجى إضافة الطفل من حساب ولي الأمر أولاً.` 
      }, { status: 404 });
    }

    const assessment = await prisma.assessment.create({
      data: {
        summary,
        proposedPlan: iepPlan,
        patientId: patient.id,
        specialistId: specialistId,
      }
    });

    return NextResponse.json({ success: true, assessment }, { status: 201 });
  } catch (error: any) {
    console.error('Save Assessment Error:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء حفظ التقييم' }, { status: 500 });
  }
}
