'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminSlider from '@/components/AdminSlider';

type TabType = 'home' | 'about' | 'contact' | 'guidance' | 'policies' | 'privacy' | 'slider';

export default function AdminContentClient() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [content, setContent] = useState<Record<string, string>>({
    welcome_title: '',
    welcome_subtitle: '',
    home_hero_img: '',
    about_summary: '',
    services_summary: '',
    about_page_title: 'من نحن',
    about_page_description: '',
    about_page_img: '',
    contact_page_title: 'اتصل بنا',
    contact_page_description: '',
    contact_page_img: '',
    guidance_page_title: 'ارشادات أسرية',
    guidance_page_description: '',
    guidance_page_img: '',
    policies_page_title: 'الشروط والسياسات',
    policies_page_description: '',
    policies_page_img: '',
    privacy_page_title: 'سياسة الخصوصية',
    privacy_page_description: '',
    privacy_page_img: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/admin/content')
      .then(res => res.json())
      .then(data => {
        if(data && !data.error) setContent(prev => ({ ...prev, ...data }));
      })
      .catch(e => console.error(e))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
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

  const updateField = (key: string, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'cms');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        updateField(key, data.url);
        toast.success('تم رفع الصورة بنجاح');
      }
    } catch (error) {
      toast.error('فشل رفع الصورة');
    }
  };

  const renderInputField = (label: string, key: string, type: 'text' | 'textarea' = 'text') => (
    <div className="flex-col gap-0.5 mt-1">
      <label htmlFor={key} className="text-sm-secondary font-bold mb-05">{label}</label>
      {type === 'text' ? (
        <input 
          id={key}
          title={label}
          className="cms-input" 
          value={content[key] || ''}
          onChange={(e) => updateField(key, e.target.value)}
          placeholder={`أدخل ${label}`}
        />
      ) : (
        <textarea 
          id={key}
          title={label}
          className="cms-textarea" 
          value={content[key] || ''}
          onChange={(e) => updateField(key, e.target.value)}
          placeholder={`أدخل ${label}`}
        />
      )}
    </div>
  );

  const renderImageField = (label: string, key: string) => (
    <div className="flex-col gap-0.5 mt-1">
      <label htmlFor={key} className="text-sm-secondary font-bold mb-05">{label}</label>
      <div className="flex row gap-1 items-center">
        <input 
          id={key}
          title={label}
          className="cms-input flex-1" 
          value={content[key] || ''}
          onChange={(e) => updateField(key, e.target.value)}
          placeholder="رابط الصورة أو ارفع واحدة"
        />
        <div className="relative overflow-hidden btn-secondary px-2 py-0-5 cursor-pointer rounded-lg border border-primary/20 hover:bg-white/10 transition-colors flex-center">
          <span className="text-sm">رفع 📁</span>
          <input 
            type="file" 
            title="Upload file"
            aria-label={`تغيير صورة ${label}`}
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={(e) => handleFileUpload(e, key)}
          />
        </div>
      </div>
      <div className="image-preview-container bg-black/20 rounded-xl mt-1 border border-white/5 h-200 flex-center overflow-hidden">
        {content[key] ? (
          <img src={content[key]} alt={`Preview for ${label}`} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
        ) : (
          <span className="text-secondary text-xs opacity-50">لا توجد صورة محددة</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex-col gap-2 p-2">
      <div className="flex row justify-between items-center mb-2">
        <div>
          <h2 className="text-3xl font-bold color-white">إدارة محتوى الموقع</h2>
          <p className="text-sm-secondary">تحكم كامل في النصوص والصور عبر المنصة</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isLoading}
          className="btn-world-class px-3 py-1 text-sm shadow-lg-glow"
        >
          {isLoading ? 'جاري الحفظ...' : 'حفظ التغيرات النهائية'}
        </button>
      </div>

      <div className="cms-tabs overflow-x-auto pb-1">
        {[
          { id: 'home', label: 'الرئيسية' },
          { id: 'slider', label: 'السلايدر' },
          { id: 'about', label: 'من نحن' },
          { id: 'contact', label: 'اتصل بنا' },
          { id: 'guidance', label: 'إرشادات' },
          { id: 'policies', label: 'الشروط' },
          { id: 'privacy', label: 'الخصوصية' }
        ].map(tab => (
          <button 
            key={tab.id}
            className={`cms-tab-btn ${activeTab === tab.id ? 'active' : ''}`} 
            onClick={() => setActiveTab(tab.id as TabType)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card glass-panel p-2 mt-1">
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex-col gap-1">
              <h3 className="color-accent-primary font-bold border-b border-white/5 pb-1">القسم الترحيبي (Hero)</h3>
              {renderInputField('العنوان الرئيسي', 'welcome_title')}
              {renderInputField('العنوان الفرعي', 'welcome_subtitle', 'textarea')}
              {renderImageField('صورة الخلفية الرئيسية', 'home_hero_img')}
            </div>
            <div className="flex-col gap-1">
              <h3 className="color-accent-primary font-bold border-b border-white/5 pb-1">ملخصات الأقسام</h3>
              {renderInputField('ملخص "من نحن"', 'about_summary', 'textarea')}
              {renderInputField('ملخص "خدماتنا"', 'services_summary', 'textarea')}
              {renderInputField('ملخص "الأخصائيين"', 'specialist_summary', 'textarea')}
              {renderInputField('ملخص "الكبار"', 'adult_summary', 'textarea')}
            </div>
          </div>
        )}

        {activeTab === 'slider' && <AdminSlider />}

        {['about', 'contact', 'guidance', 'policies', 'privacy'].includes(activeTab) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
             <div className="flex-col gap-1">
               <h3 className="color-accent-primary font-bold border-b border-white/5 pb-1 caps">إعدادات صفحة {activeTab}</h3>
               {renderInputField('عنوان الصفحة', `${activeTab}_page_title`)}
               {renderInputField('وصف الصفحة التفصيلي', `${activeTab}_page_description`, 'textarea')}
             </div>
             <div className="flex-col gap-1">
               {renderImageField('صورة الصفحة المعروضة', `${activeTab}_page_img`)}
             </div>
          </div>
        )}
      </div>

      <div className="alert-info glass-panel mt-2 p-1 border-l-4 border-accent-primary bg-accent-primary/5">
        <p className="text-sm color-white opacity-80">💡 نصيحة: استخدم صوراً عالية الجودة (1920x1080) للسلايدر لتحقيق أفضل مظهر بصري.</p>
      </div>
    </div>
  );
}
