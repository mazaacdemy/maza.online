'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AboutPage() {
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

  return (
    <>
      <div className="immersive-header dynamic-bg">
        <div className="immersive-overlay"></div>
        <h1 className="immersive-title">
          {content.about_page_title || "قصة منصة ماذا"}
        </h1>
      </div>

      <style jsx>{`
        .dynamic-bg {
          background-image: url('${content.about_page_img || "/assets/cms/about_hero.png"}');
        }
      `}</style>

      <main className="overlapping-content">
        <section className="text-center mb-4">
          <p className="text-secondary subtitle-1-2rem">
            {content.about_page_description || "نحن هنا لتمكين كل فرد في المجتمع عبر التكنولوجيا والذكاء الاصطناعي."}
          </p>
        </section>

        <section className="mission-grid">
          <div className="mission-card">
            <h3>رؤيتنا</h3>
            <p>أن نكون المنصة الأولى في الشرق الأوسط التي تدمج بين الخبرة البشرية والذكاء الاصطناعي لدعم الصحة النفسية والتطور المهاراتي.</p>
          </div>
          <div className="mission-card">
            <h3>مهمتنا</h3>
            <p>توفير أدوات دقيقة للأخصائيين، ومتابعة سهلة لأولياء الأمور، وبرامج تدريبية متطورة للكبار لضمان جودة حياة أفضل للجميع.</p>
          </div>
        </section>

        <section className="audience-section">
          <h2>من نخدم؟</h2>
          <div className="audience-list">
            <div className="item">
              <h4>ذوي الاحتياجات الخاصة</h4>
              <p>نقدم لهم تقارير تقييم ذكية وجلسات متابعة تخاطب وسلوك مكثفة.</p>
            </div>
            <div className="item">
              <h4>الأطفال العاديين</h4>
              <p>نركز على تنمية المهارات الإبداعية، التركيز، والتفوق الدراسي.</p>
            </div>
            <div className="item">
              <h4>الكبار والبالغين</h4>
              <p>استشارات نفسية ومهنية لدعم الاستقرار النفسي والإنتاجية.</p>
            </div>
          </div>
        </section>
      </main>

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
        .back-link:hover { color: var(--accent-primary); }
        .logo { font-size: 1.5rem; font-weight: 800; }
        
        .content { padding: 4rem; border-radius: 24px; }
        .hero-section { text-align: center; margin-bottom: 4rem; }
        .hero-section h1 { font-size: 3rem; margin-bottom: 1rem; }
        .subtitle { font-size: 1.2rem; color: var(--text-secondary); }

        .mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 4rem;
        }
        .mission-card {
          background: rgba(var(--accent-primary-rgb), 0.05);
          border: 1px solid var(--glass-border);
          padding: 2rem;
          border-radius: 16px;
        }
        .mission-card h3 { margin-bottom: 1rem; color: var(--accent-primary); }

        .audience-section h2 { text-align: center; margin-bottom: 3rem; font-size: 2rem; }
        .audience-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .item { padding: 1.5rem; border-bottom: 2px solid var(--accent-primary); }
        .item h4 { margin-bottom: 0.5rem; }
        .item p { color: var(--text-secondary); font-size: 0.95rem; }

        @media (max-width: 768px) {
          .mission-grid, .audience-list { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
