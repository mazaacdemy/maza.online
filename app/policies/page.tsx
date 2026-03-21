'use client';

import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function PoliciesPage() {
  return (
    <div className="info-page">
      <nav className="simple-nav glass-panel">
        <Link href="/welcome" className="back-link">← العودة للرئيسية</Link>
        <div className="logo">سياسة الاستخدام</div>
      </nav>

      <main className="content glass-panel mt-4">
        <section className="policy-content">
          <h2>شروط واستخدام منصة ماذا</h2>
          <p className="update-date">آخر تحديث: مارس 2026</p>

          <div className="policy-block">
            <h3>1. الحسابات والاشتراكات</h3>
            <p>يجب على المستخدم تقديم معلومات دقيقة عند التسجيل. المنصة تدعم ثلاث أدوار رئيسية: أخصائي، ولي أمر، وأدمن. يمنع مشاركة الحسابات مع أطرف خارجية لضمان خصوصية البيانات.</p>
          </div>

          <div className="policy-block">
            <h3>2. الجلسات والتقييمات</h3>
            <p>الجلسات التي يتم حجزها عبر المنصة تخضع لسياسة الإلغاء قبل 24 ساعة. التقييمات الصادرة عن الذكاء الاصطناعي هي أدوات مساعدة للأخصائي ويجب اعتمادها من قبل المتخصص البشري.</p>
          </div>

          <div className="policy-block">
            <h3>3. الدفع والاسترداد</h3>
            <p>ندعم الدفع بالعملات المحلية (EGP) والدولار (USD). يتم تطبيق أسعار مختلفة بناءً على الموقع الجغرافي. في حال عدم إتمام الجلسة لسبب تقني من طرفنا، يتم استرداد المبلغ كاملاً.</p>
          </div>

          <div className="policy-block">
            <h3>4. السلوك العام</h3>
            <p>يلتزم المستخدمون بالتعامل المهني والأخلاقي خلال الجلسات الافتراضية. أي تجاوز قد يؤدي إلى تعليق الحساب فوراً.</p>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .info-page {
          min-height: 100vh;
          background: var(--bg-color);
          color: var(--text-primary);
          direction: rtl;
          padding: 2rem 10% 0;
        }
        .simple-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          margin-bottom: 2rem;
        }
        .back-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
        }
        .logo { font-size: 1.5rem; font-weight: 800; }
        
        .content { padding: 4rem; border-radius: 24px; }
        .policy-content h2 { font-size: 2.5rem; margin-bottom: 0.5rem; color: var(--accent-primary); }
        .update-date { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 3rem; }

        .policy-block {
          margin-bottom: 2.5rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          border-right: 4px solid var(--accent-secondary);
        }
        .policy-block h3 { margin-bottom: 1rem; color: var(--text-primary); }
        .policy-block p { color: var(--text-secondary); line-height: 1.7; }
      `}</style>
    </div>
  );
}
