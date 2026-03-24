import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    const settingsObj = settings.reduce((acc: any, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
    
    return NextResponse.json(settingsObj);
  } catch (error) {
    return NextResponse.json({ error: "فشل استرجاع الإعدادات" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: "غير مصرح لك القيام بهذا الإجراء" }, { status: 403 });
    }

    const body = await req.json();
    const settingsToUpdate = Object.entries(body);

    const updatePromises = settingsToUpdate.map(async ([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { value: value as string },
        create: { key, value: value as string },
      });
    });

    await Promise.all(updatePromises);
    return NextResponse.json({ message: "تم تحديث الإعدادات بنجاح" });

  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ أثناء حفظ الإعدادات" }, { status: 500 });
  }
}
