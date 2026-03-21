'use client';

import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="info-page">
      <nav className="simple-nav glass-panel">
        <Link href="/welcome" className="back-link">← العودة للرئيسية</Link>
        <div className="logo">سياسة الخصوصية</div>
      </nav>

      <main className="content glass-panel mt-4">
        <section className="privacy-content">
          <h2>حماية بياناتك هي أولويتنا</h2>
          <p className="update-date">نحن ندرك قيمة البيانات الطبية والاجتماعية وحساسيتها.</p>

          <div className="policy-block">
            <h3>التشفير والأمان</h3>
            <p>يتم تشفير جميع البيانات المخزنة وقاعدة البيانات باستخدام خوارزميات AES-256 المتطورة. الجلسات والاتصالات محمية بالكامل وبروتوكول HTTPS المشفر.</p>
          </div>

          <div className="policy-block">
            <h3>الذكاء الاصطناعي (Gemini)</h3>
            <p>عند استخدام الذكاء الاصطناعي لتحليل التقييمات، يتم إرسال البيانات بشكل مجهول (Anonymized) ولا يتلقى محرك AI أي معلومات قد تعرف بهوية الشخص (الاسم، العنوان، إلخ).</p>
          </div>

          <div className="policy-block">
            <h3>حقوق المستخدم</h3>
            <p>لك الحق الكامل في طلب نسخة من بياناتك، أو طلب حذف حسابك وبياناتك الطبية نهائياً من سجلاتنا في أي وقت.</p>
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
        .privacy-content h2 { font-size: 2.5rem; margin-bottom: 0.5rem; color: var(--accent-primary); }
        .update-date { color: var(--text-secondary); margin-bottom: 3rem; }

        .policy-block {
          margin-bottom: 2.5rem;
          padding: 1.5rem;
          background: rgba(var(--accent-primary-rgb), 0.03);
          border-right: 4px solid var(--accent-primary);
          border-radius: 4px 12px 12px 4px;
        }
        .policy-block h3 { margin-bottom: 1rem; color: var(--text-primary); }
        .policy-block p { color: var(--text-secondary); line-height: 1.7; }
      `}</style>
    </div>
  );
}
