'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setImage((session.user as any).profileImage || '');
    }
  }, [session]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'profiles');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setImage(data.url);
        toast.success('تم رفع الصورة بنجاح');
      }
    } catch (error) {
      toast.error('فشل رفع الصورة');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, profileImage: image }),
      });
      
      if (res.ok) {
        await updateSession({ name, profileImage: image });
        toast.success('تم تحديث البيانات بنجاح');
      } else {
        toast.error('فشل تحديث البيانات');
      }
    } catch (error) {
      toast.error('خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  if (!session) return <div className="p-4 text-center">جاري التحميل...</div>;

  return (
    <main className="dashboard-container min-h-screen">
      <div className="card glass-panel max-w-600-mx-auto p-4 flex-col gap-2">
        <h1 className="text-primary-no-margin color-highlight mb-2">إعدادات الحساب</h1>
        
        <div className="flex-col gap-1 items-center mb-2">
           <div className="user-avatar-large mb-1 relative group">
              {image ? (
                <img src={image} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full flex-center bg-accent-primary color-white text-3xl font-bold">
                  {name ? name[0].toUpperCase() : 'U'}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 rounded-full flex-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="color-white text-xs">تغيير الصورة</span>
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </div>
           </div>
           {uploading && <p className="text-secondary text-xs">جاري الرفع...</p>}
        </div>

        <div className="input-group">
          <label htmlFor="nameInput" className="text-secondary mb-05 block text-sm">الأسم بالكامل</label>
          <input 
            id="nameInput"
            type="text" 
            className="cms-input" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            placeholder="أدخل أسمك"
            title="الأسم بالكامل"
          />
        </div>

        <div className="input-group">
          <label htmlFor="emailInput" className="text-secondary mb-05 block text-sm">البريد الإلكتروني</label>
          <input 
            id="emailInput"
            type="email" 
            className="cms-input opacity-50 cursor-not-allowed" 
            value={session.user.email || ''} 
            disabled 
            title="البريد الإلكتروني (غير قابل للتعديل)"
          />
        </div>

        <button 
          className="highlight-btn mt-2" 
          onClick={handleSave}
          disabled={loading || uploading}
        >
          {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>

      <style jsx>{`
        .user-avatar-large {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 3px solid var(--accent-primary);
          overflow: hidden;
          background: var(--bg-card);
        }
      `}</style>
    </main>
  );
}
