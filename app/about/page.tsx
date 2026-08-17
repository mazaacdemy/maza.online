'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const [page, setPage] = useState<any>(null);

  useEffect(() => {
    fetch('/api/pages/about')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setPage(data);
      })
      .catch(e => console.error("CMS Error:", e));
  }, []);

  const content = page || {};
  const sections = page?.sections || [];
  const cardSections = sections.filter((s: any) => s.type === 'card');
  const textSections = sections.filter((s: any) => s.type !== 'card');

  return (
    <>
      <div className="immersive-header dynamic-bg">
        <div className="immersive-overlay"></div>
        <h1 className="immersive-title">
          {content.title || "قصة منصة ماذا"}
        </h1>
      </div>

      <style jsx>{`
        .dynamic-bg {
          background-image: url('${content.heroImage || "/assets/cms/about_hero.png"}');
        }
      `}</style>

      <main className="overlapping-content">
        <section className="text-center mb-4">
          <p className="text-secondary subtitle-1-2rem">
            {content.description || "نحن هنا لتمكين كل فرد في المجتمع عبر التكنولوجيا والذكاء الاصطناعي."}
          </p>
        </section>

        {cardSections.length > 0 && (
          <section className="mission-grid">
            {cardSections.map((s: any) => (
              <div className="mission-card" key={s.id}>
                <h3>{s.title}</h3>
                <p>{s.content}</p>
              </div>
            ))}
          </section>
        )}

        {textSections.length > 0 && (
          <section className="audience-section">
            <h2>من نخدم؟</h2>
            <div className="audience-list">
              {textSections.map((s: any) => (
                <div className="item" key={s.id}>
                  <h4>{s.title}</h4>
                  <p>{s.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}
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
