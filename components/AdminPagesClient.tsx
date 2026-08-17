'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

type PageType = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  heroImage: string | null;
  createdAt: string;
  updatedAt: string;
  sections: SectionType[];
};

type SectionType = {
  id: string;
  pageId: string;
  title: string | null;
  content: string | null;
  image: string | null;
  type: string;
  order: number;
};

export default function AdminPagesClient() {
  const [pages, setPages] = useState<PageType[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const selected = pages.find(p => p.id === selectedId);

  const loadPages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/pages');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPages(data);
        if (!selectedId && data.length > 0) setSelectedId(data[0].id);
      }
    } catch (e) {
      console.error(e);
      toast.error('فشل تحميل الصفحات');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadPages(); }, []);

  const updatePageField = (field: 'title' | 'description' | 'heroImage', value: string) => {
    setPages(prev => prev.map(p => p.id === selectedId ? { ...p, [field]: value } : p));
  };

  const updateSectionField = (id: string, field: 'title' | 'content' | 'image' | 'type', value: string) => {
    setPages(prev => prev.map(p => p.id === selectedId ? {
      ...p,
      sections: p.sections.map(s => s.id === id ? { ...s, [field]: value } : s),
    } : p));
  };

  const addSection = () => {
    setPages(prev => prev.map(p => p.id === selectedId ? {
      ...p,
      sections: [...p.sections, { id: `tmp-${Date.now()}`, pageId: selectedId, title: 'قسم جديد', content: '', image: null, type: 'text', order: p.sections.length }],
    } : p));
  };

  const removeSection = (id: string) => {
    setPages(prev => prev.map(p => p.id === selectedId ? {
      ...p,
      sections: p.sections.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i })),
    } : p));
  };

  const moveSection = (index: number, dir: -1 | 1) => {
    setPages(prev => prev.map(p => p.id === selectedId ? {
      ...p,
      sections: p.sections.map((s, i) => {
        if (i === index) return { ...p.sections[index + dir], order: index };
        if (i === index + dir) return { ...p.sections[index], order: index + dir };
        return s;
      }).sort((a, b) => a.order - b.order),
    } : p));
  };

  const createPage = async () => {
    const slug = prompt('أدخل معرف الصفحة (slug) بالإنجليزية، مثال: contact');
    if (!slug) return;
    const title = prompt('أدخل عنوان الصفحة (بالعربية)');
    if (!title) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: slug.trim(), title }),
      });
      if (res.ok) {
        toast.success('تم إنشاء الصفحة');
        await loadPages();
      } else {
        toast.error('فشل إنشاء الصفحة');
      }
    } catch (e) {
      toast.error('خطأ في الاتصال');
    } finally {
      setSaving(false);
    }
  };

  const deletePage = async () => {
    if (!selected) return;
    if (!window.confirm(`هل أنت متأكد من حذف صفحة "${selected.title}" وأقسامها؟`)) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages?id=${selected.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('تم حذف الصفحة');
        setSelectedId('');
        await loadPages();
      } else {
        toast.error('فشل حذف الصفحة');
      }
    } catch (e) {
      toast.error('خطأ في الاتصال');
    } finally {
      setSaving(false);
    }
  };

  const saveSection = async (s: SectionType) => {
    const payload = {
      id: s.id,
      pageId: s.pageId,
      title: s.title,
      content: s.content,
      image: s.image,
      type: s.type,
      order: s.order,
    };
    const isNew = s.id.startsWith('tmp-');
    const res = await fetch('/api/admin/sections', {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isNew ? { ...payload, id: undefined } : payload),
    });
    return res;
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const pageRes = await fetch('/api/admin/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selected.id, slug: selected.slug, title: selected.title, description: selected.description, heroImage: selected.heroImage }),
      });
      if (!pageRes.ok) throw new Error('page');

      for (const s of selected.sections) {
        const res = await saveSection(s);
        if (!res.ok) throw new Error('section');
      }

      toast.success('تم حفظ جميع التعديلات بنجاح');
      await loadPages();
    } catch (e) {
      toast.error('فشل حفظ التعديلات');
    } finally {
      setSaving(false);
    }
  };

  const renderField = (label: string, value: string, onChange: (v: string) => void, textarea = false) => (
    <div className="flex-col gap-0.5 mt-1">
      <label className="text-[10px] uppercase tracking-widest opacity-60 font-bold mb-1 block">{label}</label>
      {textarea ? (
        <textarea
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm w-full min-h-[80px] focus:outline-none focus:border-indigo-500/50 transition-all resize-y"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:border-indigo-500/50 transition-all"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );

  return (
    <div className="flex-col gap-2 p-2">
      <div className="flex row justify-between items-center mb-2">
        <div>
          <h2 className="text-3xl font-bold color-white">إدارة صفحات الموقع (CMS)</h2>
          <p className="text-sm-secondary">كل صفحة تحتوي أقسامًا مرتبة — تحكم كامل بالمحتوى الديناميكي</p>
        </div>
        <div className="flex gap-2">
          <button onClick={createPage} disabled={saving} className="btn-world-class px-3 py-1 text-sm shadow-lg-glow">
            {saving ? '...' : '+ صفحة جديدة'}
          </button>
          <button onClick={handleSave} disabled={saving || !selected} className="btn-world-class px-3 py-1 text-sm shadow-lg-glow">
            {saving ? 'جاري الحفظ...' : 'حفظ كل التعديلات'}
          </button>
        </div>
      </div>

      {isLoading && pages.length === 0 ? (
        <div className="text-center opacity-60 py-10">جاري تحميل الصفحات...</div>
      ) : pages.length === 0 ? (
        <div className="text-center opacity-60 py-10">لا توجد صفحات بعد. أنشئ أول صفحة.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Pages list */}
          <div className="card glass-panel p-3 border border-white/5">
            <h3 className="text-indigo-400 font-black text-sm mb-3 border-b border-white/10 pb-2">الصفحات</h3>
            <div className="flex flex-col gap-1">
              {pages.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`text-right px-3 py-2 rounded-lg text-sm transition-all ${selectedId === p.id ? 'bg-indigo-500/20 border border-indigo-500/40' : 'bg-white/5 hover:bg-white/10 border border-transparent'}`}
                >
                  <div className="font-bold">{p.title}</div>
                  <div className="text-[10px] opacity-50" dir="ltr">/{p.slug} · {p.sections.length} قسم</div>
                </button>
              ))}
            </div>
          </div>

          {/* Editor */}
          {selected && (
            <div className="lg:col-span-3 flex flex-col gap-4">
              <section className="card glass-panel p-4 border border-white/5">
                <h3 className="text-indigo-400 font-black text-sm mb-3 border-b border-white/10 pb-2 flex items-center gap-2">
                  <span>📄</span> بيانات الصفحة
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('العنوان', selected.title, v => updatePageField('title', v))}
                  {renderField('معرف الصفحة (slug)', selected.slug, v => updatePageField('title', v))}
                  <div className="md:col-span-2">{renderField('الوصف', selected.description || '', v => updatePageField('description', v), true)}</div>
                  {renderField('رابط الصورة العلوية (hero)', selected.heroImage || '', v => updatePageField('heroImage', v))}
                  <div className="md:col-span-2 flex items-end">
                    <button onClick={deletePage} className="btn-secondary inline-flex px-3 py-1.5 rounded bg-red-500/15 text-red-300 text-xs hover:bg-red-500/25 transition-colors">
                      حذف الصفحة وأقسامها
                    </button>
                  </div>
                </div>
              </section>

              <section className="card glass-panel p-4 border border-white/5">
                <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                  <h3 className="text-indigo-400 font-black text-sm flex items-center gap-2">
                    <span>🧩</span> أقسام الصفحة ({selected.sections.length})
                  </h3>
                  <button onClick={addSection} className="btn-secondary inline-flex px-3 py-1 rounded bg-indigo-500/15 text-indigo-300 text-xs hover:bg-indigo-500/25 transition-colors">
                    + إضافة قسم
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {selected.sections.map((s, idx) => (
                    <div key={s.id} className="bg-black/20 p-3 rounded-xl border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-indigo-300 opacity-60">القسم {idx + 1} · النوع: {s.type}</span>
                        <div className="flex gap-1">
                          <button onClick={() => moveSection(idx, -1)} disabled={idx === 0} className="px-2 py-0.5 rounded bg-white/5 text-[10px] hover:bg-white/10 disabled:opacity-30">↑</button>
                          <button onClick={() => moveSection(idx, 1)} disabled={idx === selected.sections.length - 1} className="px-2 py-0.5 rounded bg-white/5 text-[10px] hover:bg-white/10 disabled:opacity-30">↓</button>
                          <button onClick={() => removeSection(s.id)} className="px-2 py-0.5 rounded bg-red-500/15 text-red-300 text-[10px] hover:bg-red-500/25">✕</button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {renderField('عنوان القسم', s.title || '', v => updateSectionField(s.id, 'title', v))}
                        {renderField('النوع (text/card/list/hero)', s.type, v => updateSectionField(s.id, 'type', v))}
                        <div className="md:col-span-2">{renderField('المحتوى', s.content || '', v => updateSectionField(s.id, 'content', v), true)}</div>
                        {renderField('صورة (اختياري)', s.image || '', v => updateSectionField(s.id, 'image', v))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      )}

      <div className="alert-info glass-panel mt-2 p-1 border-l-4 border-accent-primary bg-accent-primary/5">
        <p className="text-sm color-white opacity-80">💡 أضف أقسامًا جديدة لكل صفحة، وأعد ترتيبها بالأسهم، ثم اضغط "حفظ كل التعديلات".</p>
      </div>
    </div>
  );
}
