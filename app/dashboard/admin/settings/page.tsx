'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminSettingsFullPage() {
  const [prompts, setPrompts] = useState({
    carsPrompt: '',
    generalSummary: ''
  });
  const [social, setSocial] = useState({
    facebook: '',
    instagram: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
     try {
       const res = await fetch('/api/settings');
       const data = await res.json();
       if (data) {
         setSocial({ facebook: data.facebook || '', instagram: data.instagram || '' });
         setPrompts({ carsPrompt: data.carsPrompt || '', generalSummary: data.generalSummary || '' });
       }
     } catch (err) {
       console.error(err);
     }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...social, ...prompts })
      });
      alert('تم حفظ الإعدادات بنجاح');
    } catch (err) {
      alert('فشل الحفظ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar glass-panel">
        <div className="logo">
          <div className="logo-icon admin-bg-warning">A</div>
          <h2>إعدادات النظام</h2>
        </div>
        <nav className="side-nav">
          <Link href="/dashboard/admin" className="nav-item">العودة للرئيسية</Link>
          <Link href="/dashboard/admin/settings" className="nav-item active">الإعدادات والذكاء الاصطناعي</Link>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h2>تخصيص المنصة والذكاء الاصطناعي</h2>
        </header>

        <form onSubmit={handleSave} className="dashboard-grid mt-4">
          <div className="card glass-panel col-span-2">
            <h3>إعدادات Prompts الذكاء الاصطناعي (Gemini)</h3>
            <div className="flex-col gap-1 mt-1">
               <label className="text-secondary">برومبت اختبار CARS (Autism Assessment)</label>
               <textarea 
                 className="input-field glass-panel w-full min-h-150px"
                 value={prompts.carsPrompt}
                 onChange={(e) => setPrompts({ ...prompts, carsPrompt: e.target.value })}
                 placeholder="اكتب التعليمات هنا..."
               />
            </div>
            <div className="flex-col gap-1 mt-2">
               <label className="text-secondary">برومبت التلخيص العام للجلسات</label>
               <textarea 
                 className="input-field glass-panel w-full min-h-150px"
                 value={prompts.generalSummary}
                 onChange={(e) => setPrompts({ ...prompts, generalSummary: e.target.value })}
                 placeholder="اكتب التعليمات هنا..."
               />
            </div>
          </div>

          <div className="card glass-panel flex-col gap-1">
            <h3>روابط التواصل الاجتماعي</h3>
            <div className="flex-col">
               <label htmlFor="facebook" className="text-sm-secondary">Facebook</label>
               <input 
                 id="facebook"
                 type="url" 
                 className="input-field glass-panel w-full" 
                 value={social.facebook}
                 onChange={(e) => setSocial({ ...social, facebook: e.target.value })}
                 placeholder="https://facebook.com/..."
               />
            </div>
            <div className="flex-col mt-1">
               <label htmlFor="instagram" className="text-sm-secondary">Instagram</label>
               <input 
                 id="instagram"
                 type="url" 
                 className="input-field glass-panel w-full" 
                 value={social.instagram}
                 onChange={(e) => setSocial({ ...social, instagram: e.target.value })}
                 placeholder="https://instagram.com/..."
               />
            </div>
            
            <button 
              type="submit" 
              className="btn-gradient hero-btn mt-2"
              disabled={saving}
            >
              {saving ? 'جاري الحفظ...' : 'حفظ كافة الإعدادات'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
