"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewPatientPage() {
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dateOfBirth, diagnosis })
      });
      const data = await res.json();
      
      if (data.success) {
        router.refresh(); // Refresh server component data
        router.push('/dashboard/parent/patients');
      } else {
        setError(data.error || 'فشلت عملية الإضافة');
      }
    } catch(err) {
      setError('تعذر الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="bg-blur"></div>
      
      <aside className="sidebar-glass">
        <h2 className="logo">ماذا</h2>
        <nav className="side-nav">
          <Link href="/dashboard/parent">الرئيسية</Link>
          <Link href="/dashboard/parent/patients" className="active">إدارة الأبناء</Link>
          <Link href="/telehealth">الجلسات القادمة</Link>
          <Link href="/report">التقارير</Link>
          <Link href="/welcome" style={{ marginTop: 'auto' }}>الخروج</Link>
        </nav>
      </aside>

      <main className="content">
        <header className="main-header">
          <h1>إضافة طفل جديد</h1>
          <Link href="/dashboard/parent/patients" className="btn-outline-small" style={{ textDecoration: 'none' }}>العودة للقائمة</Link>
        </header>

        <section className="glass mt-4" style={{ maxWidth: '600px' }}>
          {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label className="input-label">الاسم</label>
              <input type="text" required className="glass-input" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="input-label">تاريخ الميلاد</label>
              <input type="date" required className="glass-input" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} />
            </div>
            <div>
              <label className="input-label">التشخيص المبدئي (اختياري)</label>
              <input type="text" className="glass-input" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} placeholder="مثال: تأخر النطق" />
            </div>

            <button type="submit" className="btn-gradient mt-4" disabled={loading}>
              {loading ? 'جاري الحفظ...' : 'حفظ البيانات'}
            </button>
          </form>
        </section>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-container { display: flex; min-height: 100vh; background: #0f172a; color: #f8fafc; direction: rtl; }
        .bg-blur { position: fixed; width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%); z-index: 0; top: -10%; left: -10%; }
        .sidebar-glass { width: 250px; background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(20px); border-left: 1px solid rgba(255, 255, 255, 0.1); padding: 2.5rem; display: flex; flex-direction: column; gap: 3rem; z-index: 10; }
        .logo { font-size: 2rem; font-weight: 800; color: #6366f1; }
        .side-nav { display: flex; flex-direction: column; gap: 1rem; flex: 1; }
        .side-nav a { color: #94a3b8; text-decoration: none; padding: 1rem; border-radius: 12px; transition: 0.3s; }
        .side-nav a.active, .side-nav a:hover { background: rgba(99, 102, 241, 0.1); color: #818cf8; }
        .content { flex: 1; padding: 3rem; z-index: 1; overflow-y: auto; }
        .main-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .glass { background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 2rem; }
        .glass-input { width: 100%; padding: 1rem; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: white; outline: none; transition: 0.3s; font-family: inherit; }
        .glass-input:focus { border-color: #a855f7; background: rgba(15, 23, 42, 0.8); }
        .input-label { display: block; margin-bottom: 0.5rem; color: #94a3b8; font-size: 0.95rem; }
        .btn-gradient { background: linear-gradient(135deg, #6366f1, #a855f7); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 12px; cursor: pointer; font-weight: 600; text-align: center; }
        .btn-outline-small { background: transparent; color: #818cf8; border: 1px solid #6366f1; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; transition: 0.3s; display: inline-block; }
        .mt-4 { margin-top: 2rem; }
        .error-message { background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 1rem; border-radius: 12px; border: 1px solid rgba(239,68,68,0.3); }
      `}} />
    </div>
  );
}
