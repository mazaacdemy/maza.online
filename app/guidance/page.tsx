'use client';

import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function GuidancePage() {
  return (
    <div className="guidance-page">
      <nav className="simple-nav glass-panel">
        <Link href="/welcome" className="back-link">← العودة للرئيسية</Link>
        <div className="logo">ارشادات أسرية</div>
      </nav>

      <main className="content glass-panel mt-4">
        <header className="hero-section">
          <h1>دليل <span className="text-gradient">ماذا</span> للإرشاد الأسري</h1>
          <p className="subtitle">نساندكم بالمعرفة والخبرة لنبني معاً مستقبلاً أفضل لأطفالنا.</p>
        </header>

        <div className="guidance-grid">
          <section className="guidance-card glass">
            <div className="icon">🗣️</div>
            <h3>تنمية مهارات التخاطب</h3>
            <ul>
              <li>تحدث مع طفلك بوضوح وبطء.</li>
              <li>استخدم الصور والبطاقات التعليمية لتعزيز المفردات.</li>
              <li>شجع طفلك على التعبير عن احتياجاته بالكلمات بدلاً من الإشارة.</li>
            </ul>
          </section>

          <section className="guidance-card glass">
            <div className="icon">🧠</div>
            <h3>تعديل السلوك الإيجابي</h3>
            <ul>
              <li>استخدم نظام المكافآت لتعزيز السلوكيات الجيدة.</li>
              <li>تجنب العقاب البدني واستخدم "وقت الهدوء" (Time-out) عند الضرورة.</li>
              <li>كن صبوراً وثابتاً في تطبيق القواعد.</li>
            </ul>
          </section>

          <section className="guidance-card glass">
            <div className="icon">🛡️</div>
            <h3>الدعم النفسي للأهل</h3>
            <ul>
              <li>تذكر أن اهتمامك بنفسك ينعكس على طفلك.</li>
              <li>تواصل مع مجموعات الدعم لتبادل الخبرات.</li>
              <li>لا تتردد في طلب الاستشارة المتخصصة عند الشعور بالإرهاق.</li>
            </ul>
          </section>

          <section className="guidance-card glass">
            <div className="icon">🎮</div>
            <h3>التعلم من خلال اللعب</h3>
            <ul>
              <li>خصص وقتاً يومياً للعب التفاعلي مع طفلك.</li>
              <li>استخدم الألعاب التي تنمي التركيز والمهارات الحركية الدقيقة.</li>
              <li>اجعل وقت التعلم ممتعاً وغير ضاغط.</li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .guidance-page {
          min-height: 100vh;
          background: #020617;
          color: white;
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
          color: #94a3b8;
          text-decoration: none;
          font-weight: 500;
        }
        .back-link:hover { color: #6366f1; }
        .logo { font-size: 1.5rem; font-weight: 800; }
        
        .content { padding: 4rem; border-radius: 24px; }
        .hero-section { text-align: center; margin-bottom: 4rem; }
        .hero-section h1 { font-size: 3rem; margin-bottom: 1rem; }
        .text-gradient { background: linear-gradient(135deg, #6366f1, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .subtitle { font-size: 1.2rem; color: #94a3b8; }

        .guidance-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }
        .guidance-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .guidance-card .icon { font-size: 3rem; }
        .guidance-card h3 { color: #818cf8; font-size: 1.5rem; }
        .guidance-card ul { list-style: none; padding: 0; }
        .guidance-card li { margin-bottom: 1rem; position: relative; padding-right: 1.5rem; color: #cbd5e1; }
        .guidance-card li::before { content: "•"; color: #6366f1; position: absolute; right: 0; font-size: 1.5rem; top: -0.2rem; }

        .glass {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
        }

        .mt-4 { margin-top: 2rem; }

        @media (max-width: 768px) {
          .hero-section h1 { font-size: 2rem; }
          .guidance-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
