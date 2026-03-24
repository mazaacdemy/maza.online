'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data) {
        setSettings({
          facebook: data.facebook || '',
          twitter: data.twitter || '',
          instagram: data.instagram || '',
          linkedin: data.linkedin || ''
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      
      const data = await res.json();
      if (res.ok) {
        setMessage('تم حفظ الإعدادات بنجاح!');
      } else {
        setMessage(data.error || 'حدث خطأ أثناء الحفظ.');
      }
    } catch (error) {
      setMessage('فشل الاتصال بالخادم.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar glass-panel">
        <div className="logo">
          <div className="logo-icon admin-bg-warning">A</div>
          <h2>إدارة ماذا</h2>
        </div>
        <nav className="side-nav">
          <Link href="/dashboard/admin" className="nav-item">لوحة القيادة</Link>
          <Link href="/dashboard/admin/settings" className="nav-item active">إعدادات المنصة (روابط السوشيال)</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h2>إعدادات المنصة العامة</h2>
        </header>

        <div className="card glass-panel mt-4 max-w-800px">
          <h3>تخصيص روابط التواصل الاجتماعي</h3>
          <p className="text-secondary mt-1 mb-2">
            سيتم عرض هذه الروابط في أسفل موقع Maza Online للزوار.
          </p>

          {message && (
            <div className={`p-1 mb-2 border-radius-sm ${message.includes('بنجاح') ? 'alert-success' : 'alert-error'}`}>
              {message}
            </div>
          )}

          {loading ? (
            <p>جاري تحميل الإعدادات...</p>
          ) : (
            <form onSubmit={handleSave} className="flex-col gap-1.5 mt-2">
              <div className="input-group">
                <label className="block text-secondary mb-0.5">رابط الفيسبوك (Facebook)</label>
                <input
                  type="url"
                  className="input-field glass-panel w-full"
                  placeholder="https://facebook.com/..."
                  value={settings.facebook}
                  onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="block text-secondary mb-0.5">رابط إنستجرام (Instagram)</label>
                <input
                  type="url"
                  className="input-field glass-panel w-full"
                  placeholder="https://instagram.com/..."
                  value={settings.instagram}
                  onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="block text-secondary mb-0.5">رابط تويتر (Twitter / X)</label>
                <input
                  type="url"
                  className="input-field glass-panel w-full"
                  placeholder="https://twitter.com/..."
                  value={settings.twitter}
                  onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="block text-secondary mb-0.5">رابط لينكد إن (LinkedIn)</label>
                <input
                  type="url"
                  className="input-field glass-panel w-full"
                  placeholder="https://linkedin.com/in/..."
                  value={settings.linkedin}
                  onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="btn-gradient hero-btn mt-2"
                disabled={saving}
              >
                {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
