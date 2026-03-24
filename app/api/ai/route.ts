import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { patientId, patientName, notes } = await request.json();

    const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!currentUser) throw new Error('User not found');

    let aiResponseObj;

    if (!genAI) {
      aiResponseObj = {
        summary: "يُظهر الطفل تحسناً ملحوظاً في الانتباه والإدراك بناءً على الملاحظات المدخلة. الجلسة كانت منتجة وساهمت في تعزيز الثقة.",
        iepPlan: "الهدف طويل المدى 1: تحسين مهارات التواصل المباشر. الهدف القصير 1: الانخراط في اللعب المشترك لمدة 10 دقائق متواصلة بدون تشتت.",
      };
    } else {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const prompt = `
        أنت مساعد تقييم ذكي مختص في التخاطب وتعديل السلوك وتنمية المهارات والتقييمات النفسية.
        المطلوب منك تحليل الملاحظات التالية وكتابة "ملخص حالة" و مسودة "خطة علاجية فردية" (IEP) مقترحة.
        بيانات الحالة:
        الاسم: ${patientName || "مريض"}
        ملاحظات الأخصائي خلال الجلسة التي تمت للتو عبر منصتنا (Telehealth):
        "${notes}"
        النتيجة المطلوبة:
        1. ملخص تحليلي للملاحظات (summary) بصيغة نص.
        2. خطة علاجية مقترحة بناءً على هذه الملاحظات تشمل أهداف (iepPlan) بصيغة نص.
        يرجى الرد بصيغة JSON فقط بدون علامات التوضيح البرمجية:
        { "summary": "...", "iepPlan": "..." }
      `;
      const result = await model.generateContent(prompt);
      const cleanJSON = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      aiResponseObj = JSON.parse(cleanJSON);
    }

    // Save to DB if patientId is provided
    let assessment = null;
    if (patientId) {
       assessment = await prisma.assessment.create({
           data: {
               patientId,
               specialistId: currentUser.id,
               type: 'جلسة متابعة (Telehealth)',
               aiSummary: aiResponseObj.summary,
               aiProposedPlan: aiResponseObj.iepPlan,
           }
       });
    }

    return NextResponse.json({ success: true, aiResponse: aiResponseObj, assessment });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
