'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer-container glass-panel">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="logo">ماذا (Maza)</div>
          <p>الحل التقني المتكامل لتمكين الأسرة والطفل والبالغ عبر الذكاء الاصطناعي.</p>
        </div>
        
        <div className="footer-links">
          <h4>المنصة</h4>
          <Link href="/about">من نحن</Link>
          <Link href="/contact">اتصل بنا</Link>
          <Link href="/guidance">ارشادات أسرية</Link>
        </div>

        <div className="footer-links">
          <h4>القانونية</h4>
          <Link href="/policies">سياسة الاستخدام</Link>
          <Link href="/privacy">سياسة الخصوصية</Link>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2026 منصة ماذا - جميع الحقوق محفوظة</p>
      </div>

      <style jsx>{`
        .footer-container {
          margin-top: 5rem;
          padding: 4rem 10% 2rem;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border-top: 1px solid var(--glass-border);
          color: var(--text-primary);
        }
        .footer-content {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }
        .footer-brand .logo {
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 1rem;
          color: var(--accent-primary);
        }
        .footer-brand p {
          color: var(--text-secondary);
          max-width: 400px;
          line-height: 1.6;
        }
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .footer-links h4 {
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }
        .footer-links a {
          color: var(--text-secondary);
          text-decoration: none;
          transition: 0.3s;
        }
        .footer-links a:hover {
          color: var(--accent-primary);
        }
        .footer-bottom {
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid var(--glass-border);
          font-size: 0.9rem;
          color: var(--text-secondary);
          opacity: 0.7;
        }
        @media (max-width: 768px) {
          .footer-content { grid-template-columns: 1fr; gap: 2rem; text-align: center; }
          .footer-brand p { margin: 0 auto; }
        }
      `}</style>
    </footer>
  );
}
