'use client';

import React, { useState } from 'react';

export default function JobsPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [spec, setSpec] = useState('');
  const [degree, setDegree] = useState('');
  const [degreeSpec, setDegreeSpec] = useState('');
  const [years, setYears] = useState('');
  const [isFresh, setIsFresh] = useState(false);
  const [training, setTraining] = useState('no');
  const [trainingWhere, setTrainingWhere] = useState('');
  const [cv, setCv] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name.trim() || !phone.trim() || !spec.trim()) {
      setError('برجاء ملء الاسم ورقم الهاتف والتخصص أولاً');
      return;
    }

    setSubmitting(true);
    try {
      let cvUrl: string | null = null;
      if (cv) {
        const fd = new FormData();
        fd.append('file', cv, cv.name);
        fd.append('category', 'cv');
        const upRes = await fetch('/api/upload', { method: 'POST', body: fd });
        const upData = await upRes.json();
        if (upData.url) cvUrl = upData.url;
      }

      const res = await fetch('/api/leads/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          specialty: spec.trim(),
          degree: degree || null,
          degreeSpec: degreeSpec.trim() || null,
          years: years !== '' ? Number(years) : null,
          isFresh,
          hasTraining: training === 'yes',
          trainingWhere: trainingWhere.trim() || null,
          cvUrl,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setName(''); setPhone(''); setSpec(''); setDegree(''); setDegreeSpec('');
        setYears(''); setIsFresh(false); setTraining('no'); setTrainingWhere(''); setCv(null);
      } else {
        setError(data.error || 'فشل التقديم، حاول مرة أخرى');
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
        <h1 className="immersive-title">قدم لوظيفة</h1>
      </div>

      <style jsx>{`
        .dynamic-bg {
          background-image: url('/assets/hero/hero1.png');
        }
      `}</style>

      <main className="overlapping-content">
        <div className="jobs-wrap">
          <div className="hero-section">
            <h2>انضم إلى <span className="text-gradient">فريق ماذا</span></h2>
            <p className="subtitle">وظيفة عامة — لايف سكيلز وماذا</p>
          </div>

          <form className="jobs-card glass-panel" onSubmit={handleSubmit}>
            <div className="field">
              <label>الاسم بالكامل</label>
              <input type="text" placeholder="مثال: مروة أحمد سيد" value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="field">
              <label>رقم الهاتف (واتساب)</label>
              <input type="tel" placeholder="01xxxxxxxxx" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>

            <div className="field">
              <label>التخصص العميق</label>
              <input type="text" placeholder="مثال: أخصائي تربية خاصة - تخصص توحد" value={spec} onChange={e => setSpec(e.target.value)} />
            </div>

            <div className="field row2">
              <div>
                <label>أعلى مؤهل دراسي</label>
                <select value={degree} onChange={e => setDegree(e.target.value)}>
                  <option value="">اختر</option>
                  <option value="bachelor">بكالوريوس</option>
                  <option value="diploma">دبلومة عليا</option>
                  <option value="master">ماجستير</option>
                  <option value="phd">دكتوراه</option>
                </select>
              </div>
              <div>
                <label>تخصص المؤهل</label>
                <input type="text" placeholder="مثال: تخاطب" value={degreeSpec} onChange={e => setDegreeSpec(e.target.value)} />
              </div>
            </div>

            <div className="field">
              <label>عدد سنوات الخبرة</label>
              <input type="number" min="0" placeholder="0" value={years} onChange={e => setYears(e.target.value)} />
            </div>

            <label className="checkbox-row">
              <input type="checkbox" checked={isFresh} onChange={e => setIsFresh(e.target.checked)} /> حديث تخرج
            </label>

            {isFresh && (
              <div className="fresh-fields">
                <div>
                  <label>هل حصلت على تدريب عملي؟</label>
                  <select value={training} onChange={e => setTraining(e.target.value)}>
                    <option value="no">لا</option>
                    <option value="yes">نعم</option>
                  </select>
                </div>
                {training === 'yes' && (
                  <div>
                    <label>فين كان التدريب؟</label>
                    <input type="text" placeholder="اسم الجهة أو المركز" value={trainingWhere} onChange={e => setTrainingWhere(e.target.value)} />
                  </div>
                )}
              </div>
            )}

            <div className="field">
              <label>رفع السيرة الذاتية (CV)</label>
              <input type="file" onChange={e => setCv(e.target.files?.[0] || null)} />
              {cv && <p className="cv-name">✓ {cv.name}</p>}
            </div>

            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">✓ تم استلام طلبك بنجاح</p>}

            <button type="submit" className="maza-hero-btn w-full justify-center !mt-2" disabled={submitting}>
              {submitting ? 'جاري التقديم...' : 'تقدم لوظيفة'}
            </button>
          </form>
        </div>
      </main>

      <style jsx>{`
        .jobs-wrap {
          max-width: 600px;
          margin: 0 auto;
        }
        .jobs-card {
          border-radius: 20px;
          padding: 2.25rem;
        }
        label { font-size: 13.5px; color: var(--sys-text-secondary); display: block; margin-bottom: 5px; }
        input, select {
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
        input:focus, select:focus {
          border-color: var(--sys-primary);
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--sys-primary) 15%, transparent);
        }
        input[type="checkbox"] { width: 16px; height: 16px; }
        input[type="file"] { padding: 10px; }
        .field { margin-bottom: 16px; }
        .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 8px;
          border-top: 1px solid var(--sys-border-strong);
          padding-top: 14px;
          margin-bottom: 6px;
          cursor: pointer;
          font-size: 14px;
          color: var(--sys-text-primary);
        }
        .fresh-fields {
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: var(--sys-surface-muted);
          border: 1px solid var(--sys-border-strong);
          border-radius: 12px;
          padding: 14px;
          margin-bottom: 16px;
        }
        .cv-name { font-size: 12px; color: #4fbf7a; margin: 6px 0 0; }
        .form-error { font-size: 13px; color: #e5644f; margin: 0 0 10px; }
        .form-success { font-size: 13.5px; color: #4fbf7a; text-align: center; margin-top: 10px; }
        button[disabled] { opacity: 0.7; cursor: not-allowed; }
        @media (max-width: 600px) {
          .row2 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}