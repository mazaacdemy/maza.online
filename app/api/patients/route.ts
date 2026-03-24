import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // In a real flow, check the session. For testing/demo without forced auth, we allow fallback or check email.
    // If no session exists, we reject the request or use a hard-coded email for the demo if 'parentEmail' is passed.
    const { name, dateOfBirth, diagnosis } = await request.json();

    if (!name || !dateOfBirth) {
      return NextResponse.json({ success: false, error: 'الاسم وتاريخ الميلاد مطلوبان' }, { status: 400 });
    }

    let parentId = (session?.user as any)?.id;

    // For Demo: if NextAuth session isn't populated, we fallback to the demo parent email
    if (!parentId) {
      const demoParent = await prisma.user.findUnique({ where: { email: 'parent@maza.com' } });
      if (demoParent) {
        parentId = demoParent.id;
      }
    }

    if (!parentId) {
      return NextResponse.json({ success: false, error: 'غير مصرح أو لم يتم العثور على حساب لولي الأمر' }, { status: 403 });
    }

    const patient = await prisma.patient.create({
      data: {
        name,
        dateOfBirth: new Date(dateOfBirth),
        diagnosis: diagnosis || null,
        parentId: parentId,
      }
    });

    return NextResponse.json({ success: true, patient }, { status: 201 });
  } catch (error: any) {
    console.error('Add Patient Error:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم أثناء إضافة الطفل' }, { status: 500 });
  }
}
