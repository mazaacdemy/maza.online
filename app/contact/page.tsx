'use client';

import React from 'react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <>
      <div className="immersive-header bg-contact-hero">
        <div className="immersive-overlay"></div>
        <h1 className="immersive-title">تواصل معنا</h1>
      </div>

      <main className="overlapping-content">
        <section className="contact-grid">
          <div className="contact-info">
            <h2>يسرنا سماع صوتك</h2>
            <p>نحن هنا للمساعدة، سواء كنت أخصائياً، ولي أمر، أو متدرباً جديداً.</p>
            
            <div className="info-items">
              <div className="info-item">
                <strong>البريد الإلكتروني:</strong>
                <p>support@maza-online.com</p>
              </div>
              <div className="info-item">
                <strong>الموقع:</strong>
                <p>القاهرة، مصر (وعبر الإنترنت عالمياً)</p>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
              <label>الاسم بالكامل</label>
              <input type="text" placeholder="اكتب اسمك هنا" />
            </div>
            <div className="input-group">
              <label>البريد الإلكتروني</label>
              <input type="email" placeholder="example@mail.com" />
            </div>
            <div className="input-group">
              <label>الرسالة</label>
              <textarea placeholder="كيف يمكننا مساعدتك؟" rows={5}></textarea>
            </div>
            <button type="submit" className="submit-btn highlight-btn">إرسال الرسالة</button>
          </form>
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
        .logo { font-size: 1.5rem; font-weight: 800; }
        
        .content { padding: 4rem; border-radius: 24px; }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }
        .contact-info h2 { font-size: 2.5rem; margin-bottom: 1rem; color: var(--accent-primary); }
        .info-items { margin-top: 3rem; display: flex; flex-direction: column; gap: 2rem; }
        .info-item strong { display: block; margin-bottom: 0.3rem; }
        .info-item p { color: var(--text-secondary); }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          background: rgba(255, 255, 255, 0.02);
          padding: 2.5rem;
          border-radius: 20px;
          border: 1px solid var(--glass-border);
        }
        .input-group label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; }
        .input-group input, .input-group textarea {
          width: 100%;
          padding: 1rem;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          color: var(--text-primary);
        }
        .submit-btn { width: 100%; padding: 1.2rem; margin-top: 1rem; }

        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr; gap: 3rem; }
        }
      `}</style>
    </>
  );
}
