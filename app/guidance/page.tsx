'use client';

import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

const cards = [
  {
    icon: '🗣️',
    title: 'تنمية مهارات التخاطب',
    color: '#6366f1',
    glow: 'rgba(99,102,241,0.18)',
    border: 'rgba(99,102,241,0.4)',
    tips: [
      'تحدث مع طفلك بوضوح وبطء.',
      'استخدم الصور والبطاقات التعليمية لتعزيز المفردات.',
      'شجع طفلك على التعبير عن احتياجاته بالكلمات بدلاً من الإشارة.',
    ],
  },
  {
    icon: '🧠',
    title: 'تعديل السلوك الإيجابي',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.15)',
    border: 'rgba(16,185,129,0.4)',
    tips: [
      'استخدم نظام المكافآت لتعزيز السلوكيات الجيدة.',
      'تجنب العقاب البدني واستخدم "وقت الهدوء" (Time-out) عند الضرورة.',
      'كن صبوراً وثابتاً في تطبيق القواعد.',
    ],
  },
  {
    icon: '🛡️',
    title: 'الدعم النفسي للأهل',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.15)',
    border: 'rgba(245,158,11,0.4)',
    tips: [
      'تذكر أن اهتمامك بنفسك ينعكس إيجاباً على طفلك.',
      'تواصل مع مجموعات الدعم لتبادل الخبرات.',
      'لا تتردد في طلب الاستشارة المتخصصة عند الشعور بالإرهاق.',
    ],
  },
  {
    icon: '🎮',
    title: 'التعلم من خلال اللعب',
    color: '#ec4899',
    glow: 'rgba(236,72,153,0.15)',
    border: 'rgba(236,72,153,0.4)',
    tips: [
      'خصص وقتاً يومياً للعب التفاعلي مع طفلك.',
      'استخدم الألعاب التي تنمي التركيز والمهارات الحركية الدقيقة.',
      'اجعل وقت التعلم ممتعاً وغير ضاغط.',
    ],
  },
];

export default function GuidancePage() {
  return (
    <div className="guidance-page">
      {/* Background glows */}
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />

      <nav className="simple-nav">
        <Link href="/welcome" className="back-link">← العودة للرئيسية</Link>
        <div className="nav-logo">ماذا</div>
      </nav>

      <main className="content">
        <header className="hero-section">
          <div className="hero-badge">💡 إرشادات أسرية</div>
          <h1>دليل <span className="text-gradient">ماذا</span> للإرشاد الأسري</h1>
          <p className="subtitle">نساندكم بالمعرفة والخبرة لنبني معاً مستقبلاً أفضل لأطفالنا.</p>
        </header>

        <div className="guidance-grid">
          {cards.map((card) => (
            <section
              key={card.title}
              className="guidance-card"
              style={{
                background: `linear-gradient(135deg, ${card.glow} 0%, rgba(15,23,42,0.8) 100%)`,
                borderColor: card.border,
                boxShadow: `0 8px 40px ${card.glow}`,
              }}
            >
              <div className="card-top">
                <div className="icon-wrap" style={{ background: card.glow, border: `1px solid ${card.border}` }}>
                  <span className="icon">{card.icon}</span>
                </div>
                <h3 style={{ color: card.color }}>{card.title}</h3>
              </div>
              <ul>
                {card.tips.map((tip, i) => (
                  <li key={i} style={{ '--dot-color': card.color } as React.CSSProperties}>
                    {tip}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .guidance-page {
          min-height: 100vh;
          background: #080f1f;
          color: #f8fafc;
          direction: rtl;
          padding: 0 8% 0;
          position: relative;
          overflow-x: hidden;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .bg-glow {
          position: fixed;
          border-radius: 50%;
          filter: blur(100px);
          z-index: 0;
          pointer-events: none;
        }
        .bg-glow-1 {
          width: 500px; height: 500px;
          background: rgba(99, 102, 241, 0.12);
          top: -10%; right: -10%;
        }
        .bg-glow-2 {
          width: 400px; height: 400px;
          background: rgba(16, 185, 129, 0.08);
          bottom: 10%; left: -5%;
        }

        .simple-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 3rem;
          position: relative;
          z-index: 10;
        }
        .back-link {
          color: #94a3b8;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          transition: color 0.2s;
        }
        .back-link:hover { color: #818cf8; }
        .nav-logo { font-size: 1.6rem; font-weight: 800; color: #818cf8; }

        .content { position: relative; z-index: 1; padding-bottom: 5rem; }

        .hero-section { text-align: center; margin-bottom: 4rem; }
        .hero-badge {
          display: inline-block;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          color: #a5b4fc;
          padding: 0.4rem 1.2rem;
          border-radius: 50px;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }
        .hero-section h1 { font-size: 3.5rem; font-weight: 900; margin-bottom: 1rem; line-height: 1.2; }
        .text-gradient {
          background: linear-gradient(135deg, #818cf8, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .subtitle { font-size: 1.2rem; color: #94a3b8; max-width: 600px; margin: 0 auto; }

        .guidance-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .guidance-card {
          border: 1px solid;
          border-radius: 24px;
          padding: 2rem 2rem 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .guidance-card:hover { transform: translateY(-6px); }

        .card-top {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .icon-wrap {
          width: 56px; height: 56px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .icon { font-size: 1.8rem; }
        .card-top h3 { font-size: 1.3rem; font-weight: 700; margin: 0; }

        ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.9rem; }
        li {
          position: relative;
          padding-right: 1.5rem;
          color: #e2e8f0;
          font-size: 1rem;
          line-height: 1.6;
        }
        li::before {
          content: "◆";
          color: var(--dot-color, #818cf8);
          position: absolute;
          right: 0;
          top: 0.1rem;
          font-size: 0.7rem;
        }

        @media (max-width: 768px) {
          .hero-section h1 { font-size: 2.2rem; }
          .guidance-grid { grid-template-columns: 1fr; }
          .guidance-page { padding: 0 5% 0; }
        }
      `}</style>
    </div>
  );
}
