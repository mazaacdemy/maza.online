'use client';

import React, { useState } from 'react';

type AccountType = 'center' | 'specialist';

export default function AdvertisePage() {
  const [accountType, setAccountType] = useState<AccountType>('center');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name.trim() || !phone.trim() || !city.trim()) {
      setError('برجاء ملء الاسم ورقم الهاتف والمدينة أولاً');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/leads/advertise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          type: accountType,
          phone: phone.trim(),
          city: city.trim(),
          description: desc.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setName(''); setPhone(''); setCity(''); setDesc('');
      } else {
        setError(data.error || 'فشل التسجيل، حاول مرة أخرى');
      }
    } catch (err) {
      setError('فشل الاتصال، حاول مرة أخرى');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-color-primary min-h-screen text-primary">
      <div className="immersive-header dynamic-bg">
        <div className="immersive-overlay"></div>
        <h1 className="immersive-title">اعلن معنا</h1>
      </div>

      <style jsx>{`
        .dynamic-bg {
          background-image: url('/assets/hero/hero1.png');
        }
      `}</style>

      <main className="overlapping-content">
        <div className="advertise-wrap">
          <div className="hero-section">
            <h2>سجّل <span className="text-gradient">مركزك</span> أو نفسك كأخصائي</h2>
            <p className="subtitle">سجّل مركزك أو نفسك كأخصائي على منصة ماذا، وخلي الناس تلاقيك</p>
          </div>

          <div className="options-grid">
            <button
              type="button"
              className={`advertise-opt ${accountType === 'center' ? 'selected' : ''}`}
              onClick={() => setAccountType('center')}
            >
              <p className="opt-name">مركز أو عيادة</p>
              <p className="opt-desc">للمراكز اللي بتقدم خدمات علاجية أو تأهيلية</p>
            </button>
            <button
              type="button"
              className={`advertise-opt featured ${accountType === 'specialist' ? 'selected' : ''}`}
              onClick={() => setAccountType('specialist')}
            >
              <span className="badge">الأكثر شيوعًا</span>
              <p className="opt-name">أخصائي مستقل</p>
              <p className="opt-desc">تخاطب، سلوك، تنمية مهارات، وغيرها</p>
            </button>
          </div>

          <div className="promo-note">
            <p className="promo-title">🎁 عرض التسجيل المبكر</p>
            <p className="promo-body">
              تسجيل مجاني للدفعة الأولى من المراكز والأخصائيين — عشان نبني قاعدة تقييمات حقيقية بسرعة. الأسعار العادية تتفعل بعد كده.
            </p>
          </div>

          <form className="advertise-card glass-panel" onSubmit={handleSubmit}>
            <div className="field">
              <label>اسم المركز / الاسم الكامل</label>
              <input
                type="text"
                placeholder="مثال: مركز التطور أو د. سارة محمود"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="field row2">
              <div>
                <label>نوع الحساب</label>
                <select value={accountType} onChange={e => setAccountType(e.target.value as AccountType)}>
                  <option value="center">مركز / عيادة</option>
                  <option value="specialist">أخصائي مستقل</option>
                </select>
              </div>
              <div>
                <label>رقم الهاتف (واتساب)</label>
                <input type="tel" placeholder="01xxxxxxxxx" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>المدينة</label>
              <input type="text" placeholder="مثال: القاهرة" value={city} onChange={e => setCity(e.target.value)} />
            </div>
            <div className="field">
              <label>وصف مختصر للخدمات المقدمة</label>
              <textarea rows={3} placeholder="مثال: جلسات تخاطب فردية وجماعية للأطفال من سن 3 سنوات" value={desc} onChange={e => setDesc(e.target.value)} />
            </div>

            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">✓ تم التسجيل، هنتواصل معاك قريب</p>}

            <button type="submit" className="maza-hero-btn w-full justify-center !mt-2" disabled={submitting}>
              {submitting ? 'جاري التسجيل...' : 'سجّل الآن مجانًا'}
            </button>
          </form>
        </div>
      </main>

      <style jsx>{`
        .advertise-wrap {
          max-width: 640px;
          margin: 0 auto;
        }
        .options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 22px;
        }
        .advertise-opt {
          background: var(--sys-surface-glass);
          border: 1px solid var(--sys-border-strong);
          border-radius: 16px;
          padding: 18px 20px;
          position: relative;
          text-align: right;
          cursor: pointer;
          color: var(--sys-text-primary);
          font-family: inherit;
          transition: all 0.3s;
        }
        .advertise-opt.featured {
          border: 2px solid var(--sys-primary);
        }
        .advertise-opt.selected {
          background: var(--sys-primary);
          color: #fff;
        }
        .badge {
          position: absolute;
          top: -11px;
          right: 16px;
          background: var(--sys-primary);
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          padding: 3px 12px;
          border-radius: 100px;
        }
        .opt-name { font-weight: 700; font-size: 15px; margin: 0 0 4px; }
        .opt-desc { font-size: 13px; opacity: 0.75; margin: 0; line-height: 1.6; }
        .promo-note {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          border-radius: 12px;
          padding: 14px 18px;
          margin-bottom: 22px;
        }
        .promo-title { font-weight: 700; font-size: 14px; color: #10b981; margin: 0 0 6px; }
        .promo-body { font-size: 13.5px; margin: 0; line-height: 1.7; }
        .advertise-card {
          border-radius: 20px;
          padding: 2rem;
        }
        label { font-size: 13.5px; color: var(--sys-text-secondary); display: block; margin-bottom: 5px; }
        input, select, textarea {
          width: 100%;
          font-family: inherit;
          font-size: 14.5px;
          color: var(--sys-text-primary);
          border: 1px solid var(--sys-border-strong);
          border-radius: 10px;
          padding: 11px 14px;
          background: var(--sys-surface-muted);
          outline: none;
          transition: 0.3s;
        }
        input:focus, select:focus, textarea:focus {
          border-color: var(--sys-primary);
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--sys-primary) 15%, transparent);
        }
        .field { margin-bottom: 16px; }
        .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .form-error { font-size: 13px; color: #e5644f; margin: 0 0 10px; }
        .form-success { font-size: 13.5px; color: #4fbf7a; text-align: center; margin-top: 10px; }
        button[disabled] { opacity: 0.7; cursor: not-allowed; }
        @media (max-width: 600px) {
          .options-grid { grid-template-columns: 1fr; }
          .row2 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}