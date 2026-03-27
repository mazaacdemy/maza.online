'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Slide {
  id?: string;
  image: string;
  title: string;
  subtitle?: string;
  link?: string;
  btnText: string;
  order: number;
  active: boolean;
}

export default function AdminSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const res = await fetch('/api/admin/slides');
      const data = await res.json();
      setSlides(data);
    } catch (error) {
      toast.error('فشل تحميل الشرائح');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'slides');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      return data.url;
    } catch (error) {
      toast.error('فشل رفع الصورة');
      return null;
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;

    const method = editingSlide.id ? 'PUT' : 'POST';
    try {
      // Ensure btnText has a default
      const finalSlide = { ...editingSlide, btnText: editingSlide.btnText || "اكتشف المزيد" };
      const res = await fetch('/api/admin/slides', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalSlide),
      });

      if (res.ok) {
        toast.success(editingSlide.id ? 'تم تحديث الشريحة بنجاح' : 'تمت إضافة الشريحة بنجاح');
        setEditingSlide(null);
        fetchSlides();
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء الحفظ');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الشريحة نهائياً؟')) return;
    try {
      const res = await fetch(`/api/admin/slides?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('تم الحذف بنجاح');
        fetchSlides();
      }
    } catch (error) {
      toast.error('فشل الحذف');
    }
  };

  return (
    <div className="flex-col gap-2 p-1">
      <div className="flex-between items-center bg-slate-800/50 p-4 rounded-2xl border border-white/10 backdrop-blur-md mb-8">
        <h2 className="text-2xl font-black color-highlight m-0 flex items-center gap-3">
           <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
           إدارة محتوى السلايدر
        </h2>
        <button 
          className="maza-hero-btn !py-2 !px-6" 
          onClick={() => setEditingSlide({ image: '', title: '', subtitle: '', link: '', btnText: 'اكتشف المزيد', order: slides.length, active: true })}
          title="إضافة شريحة جديدة"
        >
          + إضافة شريحة
        </button>
      </div>

      <div className="slides-grid-styled">
        {slides.map((slide) => (
          <div key={slide.id} className="card-glass p-2 flex-col gap-1 relative overflow-hidden group border border-white/5 hover:border-indigo-500/30 transition-all">
            <div className="w-full h-48 overflow-hidden rounded-xl bg-slate-900 mb-2">
               <img src={slide.image} alt={slide.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="p-1">
              <h4 className="color-white m-0 text-lg font-bold truncate mb-1">{slide.title}</h4>
              <p className="text-secondary text-sm truncate opacity-60">{slide.subtitle}</p>
              <div className="mt-4 flex items-center gap-2 text-xs opacity-50">
                 <span className="px-2 py-1 bg-white/5 rounded-md">{slide.btnText}</span>
                 <span className="truncate">{slide.link}</span>
              </div>
            </div>
            <div className="flex-gap-1 mt-4 border-t border-white/5 pt-4">
              <button 
                className="flex-1 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 color-white rounded-lg transition-colors text-sm font-bold" 
                onClick={() => setEditingSlide(slide)}
                title="تعديل"
              >
                تعديل البيانات
              </button>
              <button 
                className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 rounded-lg transition-colors text-sm" 
                onClick={() => slide.id && handleDelete(slide.id)}
                title="حذف"
              >
                🗑️
              </button>
            </div>
            {!slide.active && <div className="absolute inset-0 bg-black/80 flex-center color-white font-black z-20">غير نشط</div>}
          </div>
        ))}
      </div>

      {editingSlide && (
        <div className="modal-overlay flex-center p-4">
          <div className="modal-content glass-panel p-8 flex-col gap-4 w-full max-w-xl animate-zoom-in rounded-[40px] border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex-between items-center mb-4">
               <h3 className="text-3xl font-black color-highlight m-0">{editingSlide.id ? 'تعديل الشريحة' : 'إضافة شريحة جديدة'}</h3>
               <button className="text-white opacity-40 hover:opacity-100 text-2xl" onClick={() => setEditingSlide(null)}>✕</button>
            </div>
            
            <div className="input-group">
               <label htmlFor="slideImageInput" className="text-white/60 text-sm font-bold mb-2 block text-right">صورة الشريحة (4K Wide)</label>
               <div className="upload-preview-square mb-2 group cursor-pointer relative">
                  {editingSlide.image ? (
                    <img src={editingSlide.image} alt="Preview" className="w-full h-full object-cover rounded-2xl border-2 border-indigo-500/20" />
                  ) : (
                    <div className="w-full h-full flex-center bg-slate-900/50 color-white border-2 border-dashed border-white/10 rounded-2xl">
                       انقر أو اسحب لرفع الصورة
                    </div>
                  )}
                  <div className="absolute inset-0 bg-indigo-600/40 opacity-0 group-hover:opacity-100 flex-center transition-opacity rounded-2xl">
                     <span className="text-white font-bold">تغيير الصورة</span>
                  </div>
                  <input 
                    id="slideImageInput"
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await handleUpload(file);
                        if (url) setEditingSlide({ ...editingSlide, image: url });
                      }
                    }}
                    title="تحميل صورة الشريحة"
                  />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="input-group">
                <label htmlFor="slideTitleInput" className="text-white/60 text-sm font-bold block mb-2 text-right">العنوان الرئيسي</label>
                <input 
                  id="slideTitleInput"
                  type="text" 
                  className="cms-input" 
                  placeholder="مثال: تمكين طفلك..." 
                  value={editingSlide.title} 
                  onChange={e => setEditingSlide({ ...editingSlide, title: e.target.value })} 
                  title="عنوان الشريحة"
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="slideBtnTextInput" className="text-white/60 text-sm font-bold block mb-2 text-right">نص الزر (Caption)</label>
                <input 
                  id="slideBtnTextInput"
                  type="text" 
                  className="cms-input" 
                  placeholder="مثال: سجل الآن" 
                  value={editingSlide.btnText} 
                  onChange={e => setEditingSlide({ ...editingSlide, btnText: e.target.value })} 
                  title="نص الزر"
                />
              </div>
            </div>
            
            <div className="input-group">
              <label htmlFor="slideSubtitleInput" className="text-white/60 text-sm font-bold block mb-2 text-right">الوصف التفصيلي</label>
              <textarea 
                id="slideSubtitleInput"
                className="cms-textarea h-24" 
                placeholder="أدخل وصفاً جذاباً وقصيراً..." 
                value={editingSlide.subtitle} 
                onChange={e => setEditingSlide({ ...editingSlide, subtitle: e.target.value })} 
                title="وصف الشريحة"
              />
            </div>

            <div className="input-group">
              <label htmlFor="slideLinkInput" className="text-white/60 text-sm font-bold block mb-2 text-right">رابط التوجيه (Link)</label>
              <input 
                id="slideLinkInput"
                type="text" 
                className="cms-input" 
                placeholder="مثال: /register" 
                value={editingSlide.link} 
                onChange={e => setEditingSlide({ ...editingSlide, link: e.target.value })} 
                title="رابط الشريحة"
              />
            </div>
            
            <div className="flex-between items-center mt-4 bg-white/5 p-4 rounded-2xl">
              <label className="flex-items-center gap-2 color-white text-sm font-bold cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 accent-indigo-500"
                  checked={editingSlide.active} 
                  onChange={e => setEditingSlide({ ...editingSlide, active: e.target.checked })} 
                />
                ظهور الشريحة في الموقع
              </label>
              <div className="flex-gap-1">
                <button className="px-6 py-2 text-white/40 hover:text-white transition-colors font-bold" onClick={() => setEditingSlide(null)}>تراجع</button>
                <button className="maza-hero-btn !py-2 !px-10" onClick={handleSave}>حفظ الشريحة</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .slides-grid-styled {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2.5rem;
        }
        .upload-preview-square {
          height: 240px;
          position: relative;
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.95);
          z-index: 10000;
          backdrop-filter: blur(15px);
        }
        .animate-zoom-in {
          animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .cms-input, .cms-textarea {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 12px 16px;
          color: white;
          outline: none;
          transition: all 0.3s;
        }
        .cms-input:focus, .cms-textarea:focus {
           border-color: #6366f1;
           background: rgba(255,255,255,0.08);
           box-shadow: 0 0 15px rgba(99, 102, 241, 0.2);
        }
      `}</style>
    </div>
  );
}
  );
}
