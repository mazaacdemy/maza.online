'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Slide {
  id?: string;
  image: string;
  title: string;
  subtitle?: string;
  link?: string;
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
      const res = await fetch('/api/admin/slides', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSlide),
      });

      if (res.ok) {
        toast.success(editingSlide.id ? 'تم التحديث' : 'تمت الإضافة');
        setEditingSlide(null);
        fetchSlides();
      }
    } catch (error) {
      toast.error('خطأ في الحفظ');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    try {
      const res = await fetch(`/api/admin/slides?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('تم الحذف');
        fetchSlides();
      }
    } catch (error) {
      toast.error('فشل الحذف');
    }
  };

  return (
    <div className="flex-col gap-2">
      <div className="flex-between items-center bg-card-glass p-2 rounded-lg">
        <h2 className="color-highlight m-0">إدارة السلايدر</h2>
        <button 
          className="btn-primary" 
          onClick={() => setEditingSlide({ image: '', title: '', subtitle: '', link: '', order: slides.length, active: true })}
        >
          + إضافة شريحة
        </button>
      </div>

      <div className="slides-grid-styled">
        {slides.map((slide) => (
          <div key={slide.id} className="card-glass p-1 flex-col gap-1 relative overflow-hidden group">
            <img src={slide.image} alt={slide.title} className="w-full h-150-object-cover rounded-md" />
            <div className="p-05">
              <h4 className="color-white m-0 text-md truncate">{slide.title}</h4>
              <p className="text-secondary text-xs truncate">{slide.subtitle}</p>
            </div>
            <div className="flex-gap-05 mt-auto">
              <button className="btn-icon-sm" onClick={() => setEditingSlide(slide)}>✏️</button>
              <button className="btn-icon-sm text-danger" onClick={() => slide.id && handleDelete(slide.id)}>🗑️</button>
            </div>
            {!slide.active && <div className="absolute inset-0 bg-black/60 flex-center color-white">غير نشط</div>}
          </div>
        ))}
      </div>

      {editingSlide && (
        <div className="modal-overlay flex-center p-2">
          <div className="modal-content glass-panel p-2 flex-col gap-1-w-100-max-w-500 animate-zoom-in">
            <h3 className="color-highlight m-0">{editingSlide.id ? 'تعديل شريحة' : 'إضافة شريحة'}</h3>
            
            <div className="input-group">
               <label htmlFor="slideImageInput" className="text-secondary text-sm">الصورة</label>
               <div className="upload-preview-square mb-1">
                  {editingSlide.image ? (
                    <img src={editingSlide.image} alt="Preview" className="w-full h-full object-cover rounded" />
                  ) : (
                    <div className="w-full h-full flex-center bg-dark-lighter color-white">لا توجد صورة</div>
                  )}
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

            <div className="input-group">
              <label htmlFor="slideTitleInput" className="text-secondary text-sm block mb-05">العنوان</label>
              <input 
                id="slideTitleInput"
                type="text" 
                className="cms-input" 
                placeholder="العنوان" 
                value={editingSlide.title} 
                onChange={e => setEditingSlide({ ...editingSlide, title: e.target.value })} 
                title="عنوان الشريحة"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="slideSubtitleInput" className="text-secondary text-sm block mb-05">الوصف</label>
              <textarea 
                id="slideSubtitleInput"
                className="cms-textarea" 
                placeholder="الوصف" 
                value={editingSlide.subtitle} 
                onChange={e => setEditingSlide({ ...editingSlide, subtitle: e.target.value })} 
                title="وصف الشريحة"
              />
            </div>

            <div className="input-group">
              <label htmlFor="slideLinkInput" className="text-secondary text-sm block mb-05">الرابط</label>
              <input 
                id="slideLinkInput"
                type="text" 
                className="cms-input" 
                placeholder="الرابط (مثال: /register)" 
                value={editingSlide.link} 
                onChange={e => setEditingSlide({ ...editingSlide, link: e.target.value })} 
                title="رابط الشريحة"
              />
            </div>
            
            <div className="flex-between">
              <label className="flex-items-center gap-05 color-white text-sm">
                <input 
                  type="checkbox" 
                  checked={editingSlide.active} 
                  onChange={e => setEditingSlide({ ...editingSlide, active: e.target.checked })} 
                />
                نشط
              </label>
              <div className="flex-gap-1">
                <button className="btn-secondary" onClick={() => setEditingSlide(null)}>إلغاء</button>
                <button className="btn-primary" onClick={handleSave}>حفظ</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .slides-grid-styled {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        .upload-preview-square {
          height: 150px;
          border: 2px dashed var(--accent-primary);
          border-radius: 8px;
          position: relative;
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          z-index: 1000;
          backdrop-filter: blur(5px);
        }
      `}</style>
    </div>
  );
}
