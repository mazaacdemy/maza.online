'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function AdminContent() {
  const [content, setContent] = useState({
    welcome_title: 'أكاديمية ماذا تمكنك من مهاراتك',
    welcome_subtitle: 'نحن نؤمن بأن كل طفل يستحق الفرصة للتعلم والنمو بطريقة تناسبه.',
    about_text: 'الحل التقني المتكامل لتمكين الأسرة والطفل والبالغ عبر الذكاء الاصطناعي.',
    services_text: 'نقدم مجموعة شاملة من الخدمات التشخیصية والعلاجية المصممة بعناية.',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/content')
      .then(res => res.json())
      .then(data => {
        if(data && !data.error) setContent(prev => ({ ...prev, ...data }));
      })
      .catch(e => console.error(e));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      if (res.ok) {
         toast.success('تم حفظ التعديلات بنجاح');
      } else {
         toast.error('حدث خطأ أثناء الحفظ');
      }
    } catch (error) {
       toast.error('فشل الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-col gap-2 p-2">
      <div className="flex row space-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إدارة محتوى الموقع</h2>
          <p className="text-sm-secondary">تحكم في النصوص الرئيسية التي تظهر للمستخدمين</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isLoading}
          className="btn-primary px-2 py-0-5"
        >
          {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-1">
        <div className="card glass-panel flex-col gap-1">
          <h3 className="color-accent-primary">القسم الترحيبي (Hero Section)</h3>
          <div className="flex-col gap-0.5">
            <label htmlFor="welcome_title" className="text-sm-secondary">العنوان الرئيسي</label>
            <input 
              id="welcome_title"
              className="input-field glass-panel w-full" 
              value={content.welcome_title}
              onChange={(e) => setContent({ ...content, welcome_title: e.target.value })}
              placeholder="أدخل العنوان الرئيسي"
            />
          </div>
          <div className="flex-col gap-0.5 mt-1">
            <label htmlFor="welcome_subtitle" className="text-sm-secondary">العنوان الفرعي</label>
            <textarea 
              id="welcome_subtitle"
              className="input-field glass-panel w-full min-h-[100px]" 
              value={content.welcome_subtitle}
              onChange={(e) => setContent({ ...content, welcome_subtitle: e.target.value })}
              placeholder="أدخل العنوان الفرعي"
            />
          </div>
        </div>

        <div className="card glass-panel flex-col gap-1">
          <h3 className="color-accent-primary">الأقسام التعريفية</h3>
          <div className="flex-col gap-0.5">
            <label htmlFor="about_text" className="text-sm-secondary">نص "من نحن" المختصر</label>
            <textarea 
              id="about_text"
              className="input-field glass-panel w-full min-h-[100px]" 
              value={content.about_text}
              onChange={(e) => setContent({ ...content, about_text: e.target.value })}
              placeholder="أدخل نص من نحن"
            />
          </div>
          <div className="flex-col gap-0.5 mt-1">
            <label htmlFor="services_text" className="text-sm-secondary">نص قسم "خدماتنا"</label>
            <textarea 
              id="services_text"
              className="input-field glass-panel w-full min-h-[100px]" 
              value={content.services_text}
              onChange={(e) => setContent({ ...content, services_text: e.target.value })}
              placeholder="أدخل نص الخدمات"
            />
          </div>
        </div>
      </div>

      <div className="alert-info glass-panel mt-1">
        <p className="text-sm">ملاحظة: هذه التغييرات تنعكس فوراً على الصفحة الرئيسية لجميع الزوار.</p>
      </div>
    </div>
  );
}
