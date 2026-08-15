'use client';

import React, { useState, useEffect } from 'react';

interface Question {
  id?: string;
  text: string;
  options: string[];
  correct: number;
}

const FALLBACK_QUESTIONS: Question[] = [
  { text: 'أنهى سن بيبدأ فيه الطفل يستجيب لأمر النهي "لأ"؟', options: ['من الولادة لشهرين', 'من 9 لـ11 شهر', 'من 3 سنين'], correct: 1 },
  { text: 'المناغاة (الأصوات الناعمة اللي الطفل بيصدرها) بتظهر عادة في أنهى فترة؟', options: ['من الولادة لشهرين', 'من سنة لسنة ونص', 'من 3 سنين'], correct: 0 },
  { text: 'الطفل بيبدأ يفهم كلمات المنع زي (بس، لا) في حوالي سن؟', options: ['6 شهور', 'سنة ونص لسنتين', '4 سنين'], correct: 1 },
  { text: 'استخدام جملة من 4-5 كلمات بيبقى متوقع من الطفل حوالي سن؟', options: ['سنتين', '3 سنين', '6 سنين'], correct: 1 },
  { text: 'فهم مفهوم الأمس والنهارده (الترتيب الزمني) بيتطور غالبًا في سن؟', options: ['سنة', '3 سنين', '5-6 سنين'], correct: 2 },
];

const POINTS_PER_Q = 10;
const MAX_DISCOUNT = 50;

export default function PointsQuizPage() {
  const [questions, setQuestions] = useState<Question[]>(FALLBACK_QUESTIONS);
  const [current, setCurrent] = useState(0);
  const [points, setPoints] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  // Save form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/quiz')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.questions) && data.questions.length > 0) {
          setQuestions(data.questions);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = questions.length;
  const item = questions[Math.min(current, total - 1)];
  const discount = Math.min(MAX_DISCOUNT, Math.round((points / Math.max(total * POINTS_PER_Q, 1)) * MAX_DISCOUNT));

  const selectAnswer = (idx: number) => {
    if (answered !== null) return;
    setAnswered(idx);
    if (idx === item.correct) setPoints(p => p + POINTS_PER_Q);
  };

  const next = () => {
    if (current + 1 < total) {
      setCurrent(c => c + 1);
      setAnswered(null);
    } else {
      setFinished(true);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!name.trim() || !phone.trim()) {
      setFormError('برجاء إدخال اسمك ورقم هاتفك لحفظ الخصم');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), points, discount }),
      });
      const data = await res.json();
      if (res.ok && data.success) setSaved(true);
      else setFormError(data.error || 'فشل الحفظ، حاول مرة أخرى');
    } catch (err) {
      setFormError('فشل الاتصال، حاول مرة أخرى');
    } finally {
      setSaving(false);
    }
  };

  const progressPct = ((current + (answered !== null ? 1 : 0)) / Math.max(total, 1)) * 100;

  return (
    <div className="bg-color-primary min-h-screen text-primary">
      <div className="immersive-header dynamic-bg">
        <div className="immersive-overlay"></div>
        <h1 className="immersive-title">اختبر معلوماتك</h1>
      </div>

      <style jsx>{`
        .dynamic-bg {
          background-image: url('/assets/hero/hero1.png');
        }
      `}</style>

      <main className="overlapping-content">
        <div className="quiz-wrap">
          <div className="hero-section">
            <h2>اختبر <span className="text-gradient">معلوماتك</span> واجمع نقاط</h2>
            <p className="subtitle">جاوب صح واجمع خصومات على منصة ماذا — أقصى خصم 50%</p>
          </div>

          {!finished ? (
            <div className="quiz-card glass-panel">
              <div className="quiz-top">
                <p>✦ اختبر معلوماتك</p>
                <p className="pts"><span className="pts-num">{loading ? '...' : points}</span> <span className="pts-label">نقطة</span></p>
              </div>

              <div className="track"><div className="bar" style={{ width: `${progressPct}%` }}></div></div>
              <p className="progress-label">{loading ? 'جاري التحميل...' : `سؤال ${Math.min(current + 1, total)} من ${total}`}</p>

              <div className="box">
                <p className="qtext">{item?.text}</p>
                <div className="q-options">
                  {item?.options.map((opt, idx) => {
                    let cls = 'opt-btn';
                    if (answered !== null) {
                      if (idx === item.correct) cls += ' correct';
                      else if (idx === answered) cls += ' wrong';
                      else cls += ' dim';
                    }
                    return (
                      <button key={idx} type="button" className={cls} disabled={answered !== null} onClick={() => selectAnswer(idx)}>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {answered !== null && (
                  <p className={`feedback ${answered === item.correct ? 'ok' : 'no'}`}>
                    {answered === item.correct ? '✓ إجابة صحيحة! +10 نقاط' : '✗ إجابة غير صحيحة'}
                  </p>
                )}

                {answered !== null && (
                  <button type="button" className="quiz-next" onClick={next}>
                    {current + 1 < total ? 'التالي' : 'شوف نتيجتك 🏆'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="quiz-done glass-panel">
              <div className="done-icon">🏆</div>
              <h3>خلصت الاختبار!</h3>
              <p className="sub">جمعت <b className="final-pts">{points}</b> نقطة</p>

              <div className="discount-box">
                <p className="label">قيمة الخصم اللي هتاخده على منصة ماذا</p>
                <p className="value">{discount}%</p>
                <p className="note">أقصى خصم ممكن تجمعه: 50% — مقدَّم من منصة ماذا مباشرة</p>
              </div>

              {saved ? (
                <p className="form-success">✓ اتضاف الخصم لحسابك على ماذا</p>
              ) : (
                <form className="save-form" onSubmit={handleSave}>
                  <div className="field row2">
                    <div>
                      <label>الاسم</label>
                      <input type="text" placeholder="اسمك الكامل" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div>
                      <label>رقم الهاتف (واتساب)</label>
                      <input type="tel" placeholder="01xxxxxxxxx" value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                  </div>
                  {formError && <p className="form-error">{formError}</p>}
                  <button type="submit" className="quiz-next" disabled={saving}>
                    {saving ? 'جاري الحفظ...' : 'استخدم الخصم دلوقتي'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .quiz-wrap { max-width: 600px; margin: 0 auto; }
        .quiz-card, .quiz-done { border-radius: 20px; padding: 2rem; }
        .quiz-top {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px;
        }
        .quiz-top p { margin: 0; font-size: 14px; font-weight: 500; }
        .pts { font-weight: 700; font-size: 16px; }
        .pts-num { color: var(--sys-primary); }
        .pts-label { font-size: 12px; opacity: 0.6; }
        .track {
          background: var(--sys-surface-muted); border-radius: 100px; padding: 4px; margin-bottom: 8px;
        }
        .bar {
          height: 6px; width: 0%; background: var(--sys-primary); border-radius: 100px;
          transition: width .3s;
        }
        .progress-label { font-size: 12px; opacity: 0.6; margin: 0 0 20px; }
        .box { padding: 0.5rem 0; }
        .qtext { font-weight: 500; font-size: 15px; margin: 0 0 16px; }
        .opt-btn {
          width: 100%; text-align: right;
          background: var(--sys-surface-muted); color: var(--sys-text-primary);
          border: 1px solid var(--sys-border-strong); border-radius: 10px;
          padding: 12px 14px; font-family: inherit; font-size: 14px; cursor: pointer; margin-bottom: 10px;
          transition: all 0.2s;
        }
        .opt-btn:hover:not(:disabled) { border-color: var(--sys-primary); }
        .opt-btn.correct { border-color: #10b981; background: rgba(16,185,129,0.15); color: #10b981; font-weight: 700; }
        .opt-btn.wrong { border-color: #ef4444; background: rgba(239,68,68,0.12); color: #ef4444; }
        .opt-btn.dim { opacity: 0.45; }
        .opt-btn:disabled { cursor: default; }
        .feedback { font-size: 13px; margin: 6px 0 0; font-weight: 700; }
        .feedback.ok { color: #10b981; }
        .feedback.no { color: #ef4444; }
        .quiz-next {
          width: 100%; background: var(--sys-primary); color: #fff;
          font-family: inherit; font-weight: 700; font-size: 15px; border: none;
          border-radius: 12px; padding: 14px; cursor: pointer; margin-top: 16px; transition: 0.3s;
        }
        .quiz-next:hover { opacity: 0.9; }
        .quiz-next:disabled { opacity: 0.7; cursor: not-allowed; }
        .done-icon { font-size: 40px; text-align: center; }
        .done h3 { font-weight: 700; font-size: 19px; margin: 12px 0 4px; text-align: center; }
        .done .sub { font-size: 14px; opacity: 0.7; margin: 0 0 18px; text-align: center; }
        .final-pts { color: var(--sys-primary); }
        .discount-box {
          background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.35);
          border-radius: 12px; padding: 14px 18px; margin-bottom: 18px; text-align: right;
        }
        .discount-box .label { font-size: 13px; opacity: 0.6; margin: 0 0 6px; }
        .discount-box .value { font-family: inherit; font-weight: 700; font-size: 22px; color: #10b981; margin: 0; }
        .discount-box .note { font-size: 11px; opacity: 0.6; margin: 6px 0 0; }
        label { font-size: 13px; opacity: 0.7; display: block; margin-bottom: 5px; }
        input {
          width: 100%; font-family: inherit; font-size: 14.5px; color: var(--sys-text-primary);
          border: 1px solid var(--sys-border-strong); border-radius: 10px; padding: 11px 14px;
          background: var(--sys-surface-muted); outline: none; transition: 0.3s;
        }
        input:focus { border-color: var(--sys-primary); }
        .field { margin-top: 16px; }
        .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .form-error { font-size: 13px; color: #e5644f; margin: 10px 0 0; }
        .form-success { font-size: 14px; color: #4fbf7a; text-align: center; font-weight: 700; }
        @media (max-width: 600px) { .row2 { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}