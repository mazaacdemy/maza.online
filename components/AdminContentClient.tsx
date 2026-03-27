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
    hero_tag: 'نحن نهتم بمستقبل طفلك',
    f_title_1: '', f_desc_1: '', f_icon_1: '',
    f_title_2: '', f_desc_2: '', f_icon_2: '',
    f_title_3: '', f_desc_3: '', f_icon_3: '',
    stat_1_label: 'حالة تم تأهيلها', stat_1_value: '15000', stat_1_icon: '🎯',
    stat_2_label: 'أخصائي معتمد', stat_2_value: '80', stat_2_icon: '🏆',
    stat_3_label: 'محافظة نخدمها', stat_3_value: '27', stat_3_icon: '📍',
    stat_4_label: 'ساعة خبرة', stat_4_value: '25', stat_4_icon: '⏳',
    service_1_title: 'رعاية ذوي الهمم', service_1_desc: 'خطط تأهيلية متكاملة لتطوير المهارات الحياتية والاجتماعية بأحدث الأساليب العالمية.', service_1_img: '/assets/services/disability.png',
    service_2_title: 'دعم الأخصائيين', service_2_desc: 'أدوات مخصصة لتحسين جودة التشخيص والمتابعة الدقيقة للنتائج والتقارير.', service_2_img: '/assets/services/specialist.png',
    service_3_title: 'الإرشاد الأسري', service_3_desc: 'نحن ندعم الأسرة كشريك أساسي في رحلة التأهيل والنمو المتكامل للطفل.', service_3_img: '/assets/services/family.png',
    services_section_tag: 'حلولنا الحصرية', services_section_title: 'خدمات مصممة بدقة',
    about_tag: 'عقد من التميز', about_title: 'نقلة نوعية في التأهيل الرقمي',
    about_years_label: 'خبرتنا المتراكمة', about_years_value: '10 سنوات', about_years_desc: 'في رعاية وتمكين ذوي الهمم بأحدث المعايير الدولية',
    about_description: 'أكاديمية ماذا هي منصة تربوية وتأهيلية تسعى لتمكين ذوي الهمم وأسرهم عبر برامج مدروسة وفريق عمل متخصص.',
    about_btn_text: 'اكتشف كواليس العمل', about_home_img: '/assets/hero/parent_v11.png',
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
      <label htmlFor={key} className="text-[10px] uppercase tracking-widest opacity-60 font-bold mb-1 block">{label}</label>
      {type === 'text' ? (
        <input 
          id={key}
          title={label}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:border-indigo-500/50 transition-all" 
          value={content[key] || ''}
          onChange={(e) => updateField(key, e.target.value)}
          placeholder={`أدخل ${label}`}
        />
      ) : (
        <textarea 
          id={key}
          title={label}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm w-full min-h-[80px] focus:outline-none focus:border-indigo-500/50 transition-all resize-y" 
          value={content[key] || ''}
          onChange={(e) => updateField(key, e.target.value)}
          placeholder={`أدخل ${label}`}
        />
      )}
    </div>
  );

  const renderImageField = (label: string, key: string) => (
    <div className="flex-col gap-0.5 mt-1">
      <label htmlFor={key} className="text-[10px] uppercase tracking-widest opacity-60 font-bold mb-1 block">{label}</label>
      <div className="flex items-center gap-2">
        <div className="w-16 h-16 flex-shrink-0 bg-black/40 rounded-lg border border-white/10 overflow-hidden flex-center">
           {content[key] ? (
             <img src={content[key]} alt="Thumb" className="w-full h-full object-cover" />
           ) : (
             <span className="text-[10px] opacity-30">📁</span>
           )}
        </div>
        <div className="flex-1 flex flex-col gap-1">
            <input 
              id={key}
              title={label}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-[11px] w-full focus:outline-none" 
              value={content[key] || ''}
              onChange={(e) => updateField(key, e.target.value)}
              placeholder="رابط الصورة"
            />
            <div className="relative overflow-hidden btn-secondary inline-flex px-2 py-0.5 cursor-pointer rounded bg-white/5 text-[10px] hover:bg-white/10 transition-colors w-fit">
              <span>رفع صورة</span>
              <input 
                type="file" 
                title="Upload"
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={(e) => handleFileUpload(e, key)}
              />
            </div>
        </div>
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

      <div className="card glass-panel p-4 mt-2 border border-white/5 relative overflow-hidden">
        {activeTab === 'home' && (
          <div className="flex flex-col gap-6">
            <section className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <h3 className="text-indigo-400 font-black text-sm mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                <span>🏠</span> قسم "من نحن" — الصفحة الرئيسية
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderInputField('تاج العنوان', 'about_tag')}
                {renderInputField('العنوان الرئيسي', 'about_title')}
                {renderInputField('نص الزر', 'about_btn_text')}
                {renderInputField('تسمية سنوات الخبرة', 'about_years_label')}
                {renderInputField('قيمة سنوات الخبرة', 'about_years_value')}
                {renderInputField('وصف الخبرة', 'about_years_desc')}
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                  {renderInputField('نص الوصف', 'about_description', 'textarea')}
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                  {renderImageField('الصورة الجانبية', 'about_home_img')}
                </div>
              </div>
            </section>

            <section className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <h3 className="text-indigo-400 font-black text-sm mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                <span>🎯</span> عنوان قسم الخدمات
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInputField('التاج', 'services_section_tag')}
                {renderInputField('العنوان الرئيسي', 'services_section_title')}
              </div>
            </section>

            <section className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <h3 className="text-indigo-400 font-black text-sm mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                <span>🚀</span> القسم الترحيبي (Hero Master)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {renderInputField('نص التاج العلوى', 'hero_tag')}
                 {renderInputField('العنوان الرئيسي', 'welcome_title')}
                 <div className="md:col-span-2 lg:col-span-1">
                    {renderImageField('صورة الخلفية', 'home_hero_img')}
                 </div>
                 <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    {renderInputField('العنوان الفرعي', 'welcome_subtitle', 'textarea')}
                 </div>
              </div>
            </section>
            
            <section className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <h3 className="text-indigo-400 font-black text-sm mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                <span>📈</span> إحصائيات النجاح (World-Class Stats)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 {[1,2,3,4].map(num => (
                    <div key={num} className="bg-black/20 p-3 rounded-xl border border-white/5">
                       <p className="text-[10px] font-bold text-indigo-300 opacity-60 mb-2">إحصائية {num}</p>
                       {renderInputField('التسمية', `stat_${num}_label`)}
                       {renderInputField('القيمة', `stat_${num}_value`)}
                       {renderInputField('الأيقونة', `stat_${num}_icon`)}
                    </div>
                 ))}
              </div>
            </section>

            <section className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <h3 className="text-indigo-400 font-black text-sm mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                <span>🛠️</span> الخدمات الرئيسية (Services)
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                 {[1,2,3].map(num => (
                    <div key={num} className="bg-black/20 p-3 rounded-xl border border-white/5">
                       <p className="text-[10px] font-bold text-indigo-300 opacity-60 mb-2">الخدمة {num}</p>
                       {renderInputField('العنوان', `service_${num}_title`)}
                       {renderInputField('الوصف', `service_${num}_desc`, 'textarea')}
                       {renderImageField('الصورة', `service_${num}_img`)}
                    </div>
                 ))}
              </div>
            </section>

            <section className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <h3 className="text-indigo-400 font-black text-sm mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                <span>📝</span> ملخصات الأقسام
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 {renderInputField('ملخص "من نحن"', 'about_summary', 'textarea')}
                 {renderInputField('ملخص "خدماتنا"', 'services_summary', 'textarea')}
                 {renderInputField('ملخص "الأخصائيين"', 'specialist_summary', 'textarea')}
                 {renderInputField('ملخص "الكبار"', 'adult_summary', 'textarea')}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'slider' && <AdminSlider />}

        {['about', 'contact', 'guidance', 'policies', 'privacy'].includes(activeTab) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="md:col-span-2 flex flex-col gap-4">
                <h3 className="text-indigo-400 font-bold border-b border-white/10 pb-2">إعدادات صفحة {activeTab}</h3>
                {renderInputField('عنوان الصفحة', `${activeTab}_page_title`)}
                {renderInputField('وصف الصفحة التفصيلي', `${activeTab}_page_description`, 'textarea')}
             </div>
             <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                {renderImageField('صورة الصفحة', `${activeTab}_page_img`)}
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
