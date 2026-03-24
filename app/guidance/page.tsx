'use client';

import React from 'react';
import Link from 'next/link';

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
    <div className="bg-color-primary min-h-screen text-primary">
      <div className="immersive-header bg-guidance-hero">
        <div className="immersive-overlay"></div>
        <h1 className="immersive-title">إرشادات <span className="immersive-title-gradient">أسرية</span></h1>
      </div>

      <main className="overlapping-content">
        <header className="hero-section">
          <div className="hero-badge">💡 الدليل المعرفي</div>
          <h2>دليل <span className="text-gradient">ماذا</span> للإرشاد الأسري</h2>
          <p className="subtitle">نقف بجانبكم بالمعرفة والخبرة لنبني معاً مستقبلاً أفضل لأطفالنا وللمجتمع.</p>
        </header>

        <div className="guidance-grid">
          {cards.map((card, index) => {
            const accentClass = index === 0 ? 'indigo' : index === 1 ? 'emerald' : index === 2 ? 'amber' : 'pink';
            return (
              <section
                key={card.title}
                className={`guidance-card card-${index} glass guidance-card-${accentClass}`}
              >
                <div className="card-top">
                  <div className="icon-wrap">
                    <span className="icon">{card.icon}</span>
                  </div>
                  <h3 className={`card-title font-bold text-lg text-accent-${accentClass}`}>{card.title}</h3>
                </div>
                <ul className="list-no-bullets-mt">
                  {card.tips.map((tip, i) => (
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
