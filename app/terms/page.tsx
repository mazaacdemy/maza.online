'use client';

import React, { useState, useEffect } from "react";

export default function TermsPage() {
  const [cmsContent, setCmsContent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/content')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setCmsContent(data);
      })
      .catch(e => console.error("CMS Error:", e));
  }, []);

  const content = cmsContent || {};
  const termsText = content.policies_page_description || "";

  return (
    <main className="dashboard-container min-h-screen">
      <div className="card glass-panel flex-col gap-1 p-2 m-2 max-w-800-mx-auto">
        <h1 className="text-primary-no-margin color-accent-primary">
          {content.policies_page_title || "الشروط والسياسات للمنصة"}
        </h1>
        
        {termsText ? (
           <p className="text-secondary line-height-18 whitespace-pre-wrap">
             {termsText}
           </p>
        ) : (
          <>
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
          </>
        )}
      </div>
    </main>
  );
}
