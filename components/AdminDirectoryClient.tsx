'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

type Listing = {
  id: string;
  slug: string;
  name: string;
  type: string;
  phone: string;
  city: string;
  description: string | null;
  services: string | null;
  image: string | null;
  featured: boolean;
  approved: boolean;
  views: number;
  createdAt: string;
};

export default function AdminDirectoryClient() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/directory');
      const data = await res.json();
      if (Array.isArray(data)) setListings(data);
    } catch (e) {
      console.error(e);
      toast.error('فشل تحميل الإعلانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleField = async (id: string, field: 'approved' | 'featured', value: boolean) => {
    try {
      const res = await fetch('/api/admin/directory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, [field]: value }),
      });
      if (res.ok) {
        setListings(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
        toast.success(value ? 'تم التفعيل' : 'تم الإلغاء');
      } else {
        toast.error('فشل التحديث');
      }
    } catch (e) {
      toast.error('خطأ في الاتصال');
    }
  };

  const remove = async (id: string, name: string) => {
    if (!window.confirm(`حذف "${name}" نهائيًا؟`)) return;
    try {
      const res = await fetch(`/api/admin/directory?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setListings(prev => prev.filter(l => l.id !== id));
        toast.success('تم الحذف');
      } else {
        toast.error('فشل الحذف');
      }
    } catch (e) {
      toast.error('خطأ في الاتصال');
    }
  };

  const filtered = listings.filter(l => {
    if (filter === 'pending') return !l.approved;
    if (filter === 'approved') return l.approved;
    return true;
  });

  return (
    <div className="flex-col gap-2 p-2">
      <div className="flex row justify-between items-center mb-2 flex-wrap gap-2">
        <div>
          <h2 className="text-3xl font-bold color-white">دليل المراكز والأخصائيين</h2>
          <p className="text-sm-secondary">قبول وتمييز الإعلانات التي تظهر في /directory</p>
        </div>
        <div className="flex gap-1">
          {(['all', 'pending', 'approved'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs rounded-lg transition-all ${filter === f ? 'bg-indigo-500/30 border border-indigo-500/50' : 'bg-white/5 hover:bg-white/10 border border-transparent'}`}
            >
              {f === 'all' ? 'الكل' : f === 'pending' ? 'قيد المراجعة' : 'مقبول'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center opacity-60 py-10">جاري التحميل...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center opacity-60 py-10">لا توجد إعلانات</div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(l => (
            <div key={l.id} className="card glass-panel p-4 border border-white/5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                    {l.type === 'center' ? '🏥' : '👩‍⚕️'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm flex items-center gap-2">
                      {l.name}
                      {l.featured && <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">⭐ مميز</span>}
                    </h3>
                    <p className="text-[11px] opacity-60">{l.city} · {l.type === 'center' ? 'مركز' : 'أخصائي'} · <span dir="ltr">{l.phone}</span></p>
                    <p className="text-[10px] opacity-40 mt-0.5">👁 {l.views} مشاهدة · <span dir="ltr">/{l.slug}</span></p>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {!l.approved && (
                    <button onClick={() => toggleField(l.id, 'approved', true)} className="btn-secondary inline-flex px-3 py-1 rounded bg-emerald-500/15 text-emerald-300 text-xs hover:bg-emerald-500/25 transition-colors">
                      ✓ قبول ونشر
                    </button>
                  )}
                  {l.approved && (
                    <button onClick={() => toggleField(l.id, 'approved', false)} className="btn-secondary inline-flex px-3 py-1 rounded bg-white/5 text-white/60 text-xs hover:bg-white/10 transition-colors">
                      إخفاء
                    </button>
                  )}
                  <button onClick={() => toggleField(l.id, 'featured', !l.featured)} className={`btn-secondary inline-flex px-3 py-1 rounded text-xs transition-colors ${l.featured ? 'bg-amber-500/25 text-amber-300 hover:bg-amber-500/35' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
                    {l.featured ? '⭐ مميز' : 'تمييز'}
                  </button>
                  <a href={`/directory/${l.slug}`} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex px-3 py-1 rounded bg-indigo-500/15 text-indigo-300 text-xs hover:bg-indigo-500/25 transition-colors">
                    عرض
                  </a>
                  <button onClick={() => remove(l.id, l.name)} className="btn-secondary inline-flex px-3 py-1 rounded bg-red-500/15 text-red-300 text-xs hover:bg-red-500/25 transition-colors">
                    حذف
                  </button>
                </div>
              </div>
              {l.description && (
                <p className="text-xs opacity-60 mt-3 line-clamp-2">{l.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
