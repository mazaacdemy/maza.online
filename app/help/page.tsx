import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import React from "react";

export default async function HelpPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const role = user?.role;

  return (
    <main className="dashboard-container min-h-screen">
      <div className="card glass-panel flex-col gap-1 p-2 m-2 max-w-900-mx-auto">
        <h1 className="text-primary-no-margin color-accent-primary">مركز المساعدة والدعم التقني</h1>
        
        {!role && (
          <div className="help-section mt-1">
            <h2 className="text-primary-no-margin">مرحباً بك في منصة ماذا!</h2>
            <p className="text-secondary mt-1 line-height-18">
              منصة "ماذا" هي المنصة الأولى المتكاملة لتقييم وجلسات تعديل السلوك والتخاطب للأطفال باستخدام أحدث التقنيات 
              والذكاء الاصطناعي. كمستخدم غير مسجل حتى الآن، يمكنك البدء عبر اختيار إنشاء حساب.
            </p>
            <Link href="/register" className="btn-primary inline-block mt-1">تسجيل حساب وتجربة المنصة</Link>
          </div>
        )}

        {role === "PARENT" && (
          <div className="help-section mt-1">
            <h2 className="text-primary-no-margin">دليل مساعدة: لولي الأمر</h2>
            <ul className="list-no-bullets-mt text-secondary line-height-20">
              <li className="list-item-bordered">
                <strong>لإضافة طفل:</strong> انتقل إلى ملفك في لوحة التحكم الخاصة بك واضغط على إضافة طفل أو إضافة مريض.
              </li>
              <li className="list-item-bordered">
                <strong>لحجز جلسة (موعد):</strong> استخدم خيار الحجز من القائمة (أونلاين أو المركز) لاختيار الأخصائي المناسب والوقت المناسب لك والقيام بالدفع عبر البوابات الآمنة.
              </li>
              <li className="list-item-bordered">
                <strong>الانضمام لجلسة الأونلاين (Telehealth):</strong> ستجد رابط الجلسة قبل موعدها في لوحة التحكم في قسم المواعيد، اضغط على دخول الغرفة.
              </li>
              <li className="list-item-bordered">
                <strong>الاطلاع على التقارير:</strong> التقارير المكتوبة آلياً من الذكاء الاصطناعي ستجدها في لوحة التحكم تحت قسم "التقارير" بعد انتهاء كل جلسة تقييم.
              </li>
            </ul>
          </div>
        )}

        {role === "SPECIALIST" && (
          <div className="help-section mt-1">
            <h2 className="text-primary-no-margin">دليل مساعدة: أخصائي تخاطب / سلوك</h2>
            <ul className="list-no-bullets-mt text-secondary line-height-20">
              <li className="list-item-bordered">
                <strong>لمتابعة الجلسات المجدولة:</strong> ستجدها في لوحة تحكمك، بادر بالانضمام للغرفة الافتراضية قبل موعد المريض بدقائق.
              </li>
              <li className="list-item-bordered">
                <strong>استخدام مساعد Maza الذكي للتقارير:</strong> أثناء الجلسة عبر نظام Telehealth، ستجد صندوق لكتابة الملاحظات. 
                استخدمه لتدوين أي طارئ، وسيقوم الذكاء الاصطناعي (Gemini) بتوليد تقارير الـ IEP الجاهزة بنهاية التقييم بناءً عليها!
              </li>
              <li className="list-item-bordered">
                <strong>استخدام استبيانات CARS وغيرها:</strong> توجه لقسم تقييمات الذكاء الاصطناعي وقم بتعبئة النماذج.
              </li>
            </ul>
          </div>
        )}

        {role === "CENTER" && (
          <div className="help-section mt-1">
            <h2 className="text-primary-no-margin">دليل مساعدة: مدير المركز</h2>
            <ul className="list-no-bullets-mt text-secondary line-height-20">
              <li className="list-item-bordered">
                <strong>إدارة الفريق:</strong> يمكنك إضافة الأخصائيين وتعيين رواتبهم وعمولاتهم عبر منصتك المركزية.
              </li>
              <li className="list-item-bordered">
                <strong>المركزية الشاملة:</strong> تابع أداء جميع الأخصائيين المربوطين بمركزك والمواعيد المحجوزة.
              </li>
            </ul>
          </div>
        )}

        {role === "ADMIN" && (
          <div className="help-section mt-1">
            <h2 className="text-primary-no-margin text-error-sm">دليل الإدارة العليا (Super Admin)</h2>
            <p className="text-secondary mt-1">
              أهلاً بك أيها المدير. لديك الصلاحيات الحصرية لمراقبة كل أطراف النظام (Webhooks، API، المستخدمين، والمصروفات).
              يرجى دائماً التعامل بحذر مع البيانات المركزية حيث تنعكس التعديلات على بقية المنصات فوراً.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
