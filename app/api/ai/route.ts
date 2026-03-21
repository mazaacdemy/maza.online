import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { patientName, age, diagnosis, notes } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      // For the sake of the mockup, we return a mock response if no key is provided.
      return NextResponse.json({
        success: true,
        aiResponse: {
          summary: "يُظهر الطفل تحسناً ملحوظاً في التواصل البصري...",
          strengths: ["القدرة على التعرف على الألوان الأساسية ومطابقتها.", "تنفيذ الأوامر البسيطة بنجاح 80%."],
          weaknesses: ["صعوبة في توظيف الانتباه المشترك لفترات تزيد عن دقيقة واحدة.", "ظهور بعض السلوكيات التكرارية."],
          iepPlan: "الهدف طويل المدى 1: أن يستخدم المريض جملة مكونة من كلمتين لطلب الأشياء أو التعبير الرفض باستقلالية بنسبة 80% خلال 3 أشهر.",
          note: "**ملاحظة**: هذا الرد تجريبي (Mockup) نظراً لعدم وجود مفتاح GEMINI_API_KEY فعّال في بيئة التطوير."
        }
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
      أنت مساعد تقييم ذكي مختص في التخاطب وتعديل السلوك وتنمية المهارات والتقييمات النفسية.
      المطلوب منك تحليل الملاحظات التالية وكتابة "ملخص حالة" و و استخراج نقاط القوة والضعف ومسودة "خطة علاجية فردية" (IEP) مقترحة.
      
      بيانات الحالة:
      الاسم: ${patientName}
      العمر: ${age}
      التشخيص المبدئي: ${diagnosis}
      
      ملاحظات الأخصائي خلال الجلسة:
      "${notes}"
      
      النتيجة المطلوبة:
      1. ملخص تحليلي للملاحظات (summary).
      2. 3 نقاط قوة على الأكثر (strengths).
      3. 3 نقاط ضعف على الأكثر (weaknesses).
      4. خطة علاجية تشمل أهداف طويلة وأهداف قصيرة المدى (iepPlan).
      
      يرجى الرد بصيغة JSON فقط:
      {
        "summary": "...",
        "strengths": ["...", "..."],
        "weaknesses": ["...", "..."],
        "iepPlan": "..."
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Removing the markdown block code notation if AI provides it
    const cleanJSON = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    return NextResponse.json({ success: true, aiResponse: JSON.parse(cleanJSON) });

  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
