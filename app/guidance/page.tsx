'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const cardColors = ['indigo', 'emerald', 'amber', 'pink'];

export default function GuidancePage() {
  const [page, setPage] = useState<any>(null);

  useEffect(() => {
    fetch('/api/pages/guidance')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setPage(data);
      })
      .catch(e => console.error("CMS Error:", e));
  }, []);

  const content = page || {};
  const sections = page?.sections || [];

  return (
    <div className="bg-color-primary min-h-screen text-primary">
      <div className="immersive-header dynamic-bg">
        <div className="immersive-overlay"></div>
        <h1 className="immersive-title">
          {content.title || "إرشادات أسرية"}
        </h1>
      </div>

      <style jsx>{`
        .dynamic-bg {
          background-image: url('${content.heroImage || "/images/guidance-hero-fallback.jpg"}');
        }
      `}</style>

      <main className="overlapping-content">
        <header className="hero-section">
          <div className="hero-badge">💡 الدليل المعرفي</div>
          <h2>دليل <span className="text-gradient">ماذا</span> للإرشاد الأسري</h2>
          <p className="subtitle">
            {content.description || "نقف بجانبكم بالمعرفة والخبرة لنبني معاً مستقبلاً أفضل لأطفالنا وللمجتمع."}
          </p>
        </header>

        <div className="guidance-grid">
          {sections.map((card: any, index: number) => {
            const accentClass = cardColors[index % cardColors.length];
            const tips = (card.content || '').split('\n').filter((t: string) => t.trim());
            return (
              <section
                key={card.id}
                className={`guidance-card card-${index} glass guidance-card-${accentClass}`}
              >
                <div className="card-top">
                  <div className="icon-wrap">
                    <span className="icon">💡</span>
                  </div>
                  <h3 className={`card-title font-bold text-lg text-accent-${accentClass}`}>{card.title}</h3>
                </div>
                <ul className="list-no-bullets-mt">
                  {tips.map((tip: string, i: number) => (
                    <li key={i} className="mb-1 text-secondary list-item-bordered">
                      {tip}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
