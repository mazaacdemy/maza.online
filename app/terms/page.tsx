import React from "react";

export default function TermsPage() {
  return (
    <main className="dashboard-container min-h-screen">
      <div className="card glass-panel flex-col gap-1 p-2 m-2 max-w-800-mx-auto">
        <h1 className="text-primary-no-margin color-accent-primary">الشروط والسياسات للمنصة</h1>
        <p className="text-secondary line-height-18">
          يخضع استخدام منصة <strong>ماذا</strong> لعدد من شروط الاستخدام الموضحة لضمان حقوق كافة 
          الأطراف (المنصة، أولياء الأمور، والمراكز/الأخصائيين).
        </p>
        
        <h2 className="text-primary-no-margin mt-1">قواعد استخدام المنصة والجلسات</h2>
        <p className="text-secondary line-height-18">
          يمنع إساءة استخدام غرف الجلسات الافتراضية بأي شكل من الأشكال. المركز والأخصائي ملزمان 
          بتقديم التقارير السلوكية في موعدها. يرجى العلم بأن الجلسات تخضع للمراقبة الآلية من قبل مساعد 
          Maza الذكي لتحليل السلوك ومساعدة الأخصائي على الخروج بتقرير دقيق.
        </p>
      </div>
    </main>
  );
}
