'use client';

import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import ThemeToggle from '@/components/ThemeToggle';

export default function WelcomePage() {
  return (
    <div className="welcome-container">
      {/* Background with Animated Gradients */}
      <div className="bg-glow"></div>
      
      {/* Navigation */}
      <nav className="glass-nav">
        <div className="logo">ماذا (Maza)</div>
        <div className="nav-links">
          <Link href="/about" className="login-btn">من نحن</Link>
          <Link href="/contact" className="login-btn">اتصل بنا</Link>
          <Link href="/guidance" className="login-btn">ارشادات أسرية</Link>
          <Link href="/login" className="login-btn">دخول</Link>
          <ThemeToggle />
          <button className="join-btn">انضم إلينا</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <h1 className="hero-title">منصة <span>ماذا</span> الرقمية</h1>
        <p className="hero-subtitle">الحل الشامل لدعم الأسرة، الأطفال، والبالغين في رحلة التطور والتمكين النفسي.</p>
        <div className="hero-actions">
          <Link href="#categories" className="explore-btn">اكتشف الخدمات</Link>
        </div>
      </header>

      {/* Categories Section */}
      <section id="categories" className="categories-grid">
        {/* Category 1: Special Needs */}
        <div className="category-card glass">
          <div className="icon">♿</div>
          <h3>ذوي الاحتياجات الخاصة</h3>
          <p>دعم متخصص في التخاطب، تنمية المهارات، وتعديل السلوك عبر جلسات فردية وتقارير ذكاء اصطناعي دقيقة.</p>
        </div>

        {/* Category 2: Typical Kids */}
        <div className="category-card glass">
          <div className="icon">👶</div>
          <h3>الأطفال العاديين</h3>
          <p>تنمية المهارات الإبداعية، معالجة مشكلات التعلم، والتدريب على السلوكيات الإيجابية لجيل أقوى.</p>
        </div>

        {/* Category 3: Adults */}
        <div className="category-card glass">
          <div className="icon">👤</div>
          <h3>الكبار والبالغين</h3>
          <p>استشارات نفسية واجتماعية، دعم أكاديمي، وحلول للتحديات التي تواجهك في حياتك اليومية.</p>
        </div>
      </section>

      {/* Why Maza? Section */}
      <section className="features-section">
        <div className="feature-item glass">
          <h4>🤖 تقارير بالذكاء الاصطناعي</h4>
          <p>نستخدم تقنيات Google Gemini لتحليل الاختبارات وإصدار تقارير طبية وتربوية فورية.</p>
        </div>
        <div className="feature-item glass">
          <h4>🎥 جلسات أونلاين</h4>
          <p>تواصل مع أفضل الأخصائيين من منزلك عبر غرف جلسات افتراضية مؤمنة وفائقة الجودة.</p>
        </div>
        <div className="feature-item glass">
          <h4>🌍 دفع متعدد العملات</h4>
          <p>سواء كنت داخل مصر أو خارجها، ندعم الدفع بالجنيه المصري والدولار بكل سلاسة.</p>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .welcome-container {
          min-height: 100vh;
          background: var(--bg-color);
          color: var(--text-primary);
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          direction: rtl;
          overflow-x: hidden;
          position: relative;
        }

        .bg-glow {
          position: fixed;
          top: -20%;
          right: -10%;
          width: 60%;
          height: 80%;
          background: radial-gradient(circle, rgba(100, 50, 255, 0.15) 0%, transparent 70%);
          z-index: 0;
          filter: blur(80px);
        }

        .glass-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 10%;
          background: var(--glass-bg);
          backdrop-filter: blur(15px);
          border-bottom: 1px solid var(--glass-border);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .logo {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .nav-links {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }

        .login-btn {
          color: var(--text-primary);
          text-decoration: none;
          font-weight: 500;
          transition: 0.3s;
        }

        .join-btn {
          background: var(--accent-primary);
          color: #fff;
          padding: 0.6rem 1.5rem;
          border-radius: 50px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }

        .hero {
          text-align: center;
          padding: 8rem 10% 5rem;
          position: relative;
          z-index: 1;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 900;
          margin-bottom: 1.5rem;
        }

        .hero-title span {
          color: var(--accent-primary);
          text-shadow: 0 0 30px rgba(99, 102, 241, 0.3);
        }

        .hero-subtitle {
          font-size: 1.3rem;
          color: var(--text-secondary);
          max-width: 800px;
          margin: 0 auto 3rem;
          line-height: 1.6;
        }

        .explore-btn {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: #fff;
          padding: 1.2rem 3rem;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          font-size: 1.1rem;
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
          transition: 0.3s;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          padding: 5rem 10%;
          position: relative;
          z-index: 1;
        }

        .glass {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 2.5rem;
          transition: 0.4s;
        }

        .glass:hover {
          transform: translateY(-10px);
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(99, 102, 241, 0.3);
        }

        .category-card .icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
        }

        .category-card h3 {
          font-size: 1.6rem;
          margin-bottom: 1rem;
        }

        .category-card p {
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .features-section {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          padding: 2rem 10% 8rem;
          z-index: 1;
          position: relative;
        }

        .feature-item {
          flex: 1;
          min-width: 250px;
          padding: 1.5rem;
        }

        .feature-item h4 {
          margin-bottom: 0.8rem;
          font-size: 1.1rem;
        }

        .feature-item p {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .footer-glass {
          text-align: center;
          padding: 3rem;
          background: rgba(255, 255, 255, 0.01);
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          font-size: 0.9rem;
          opacity: 0.4;
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 2.5rem; }
          .hero-subtitle { font-size: 1rem; }
        }
      `}</style>
    </div>
  );
}
