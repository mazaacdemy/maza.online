'use client';

import React, { useState, useEffect } from "react";

export default function TermsPage() {
  const [page, setPage] = useState<any>(null);

  useEffect(() => {
    fetch('/api/pages/terms')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setPage(data);
      })
      .catch(e => console.error("CMS Error:", e));
  }, []);

  const content = page || {};
  const sections = page?.sections || [];

  return (
    <main className="dashboard-container min-h-screen">
      <div className="card glass-panel flex-col gap-1 p-2 m-2 max-w-800-mx-auto">
        <h1 className="text-primary-no-margin color-accent-primary">
          {content.title || "الشروط والسياسات للمنصة"}
        </h1>
        
        {sections.length > 0 ? (
          sections.map((s: any) => (
            <div key={s.id}>
              {s.title && (
                <h2 className="text-primary-no-margin mt-1">{s.title}</h2>
              )}
              <p className="text-secondary line-height-18 whitespace-pre-wrap">
                {s.content}
              </p>
            </div>
          ))
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
