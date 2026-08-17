'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

type Listing = {
  id: string;
  slug: string;
  name: string;
  type: string;
  phone: string | null;
  city: string;
  description: string | null;
  services: string | null;
  image: string | null;
  featured: boolean;
  approved: boolean;
  views: number;
  createdAt: string;
};

export default function DirectoryPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    fetch('/api/directory')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setListings(data);
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const cities = Array.from(new Set(listings.map(l => l.city).filter(Boolean))).sort();

  const filtered = listings.filter(l => {
    if (city && l.city !== city) return false;
    if (type && l.type !== type) return false;
    return true;
  });

  const featured = filtered.filter(l => l.featured);
  const regular = filtered.filter(l => !l.featured);

  const renderCard = (l: Listing) => (
    <Link
      href={`/directory/${l.slug}`}
      key={l.id}
      className="card glass-panel p-4 border border-white/5 hover:border-indigo-500/40 transition-all block"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xl flex-shrink-0">
            {l.image ? <img src={l.image} alt={l.name} className="w-full h-full object-cover rounded-xl" /> : (l.type === 'center' ? '🏥' : '👩‍⚕️')}
          </div>
          <div>
            <h3 className="font-bold text-sm">{l.name}</h3>
            <p className="text-[11px] opacity-60">{l.city}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {l.featured && <span className="badge-star text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">⭐ مميز</span>}
          <span className="text-[10px] opacity-40">{l.type === 'center' ? 'مركز / عيادة' : 'أخصائي'}</span>
        </div>
      </div>

      <p className="text-xs opacity-70 mt-3 line-clamp-2 leading-relaxed">
        {l.description || 'لا يوجد وصف بعد'}
      </p>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
        <span className="text-[10px] opacity-50">👁 {l.views} مشاهدة</span>
        <span className="btn-secondary inline-flex px-3 py-1 rounded bg-indigo-500/15 text-indigo-300 text-xs">عرض التفاصيل</span>
      </div>
    </Link>
  );

  return (
    <div className="bg-color-primary min-h-screen text-primary">
      <div className="immersive-header dynamic-bg">
        <div className="immersive-overlay"></div>
        <h1 className="immersive-title">دليل المراكز والأخصائيين</h1>
      </div>

      <style jsx>{`
        .dynamic-bg {
          background-image: url('/assets/hero/hero1.png');
        }
      `}</style>

      <main className="overlapping-content">
        <div className="directory-wrap max-w-5xl mx-auto">
          <div className="hero-section text-center mb-6">
            <h2 className="text-2xl font-black">اعثر على <span className="text-gradient">الأفضل</span></h2>
            <p className="subtitle opacity-70 text-sm mt-2">
              مراكز وأخصائيين موثوقين في كل المحافظات — التفاصيل الكاملة لأعضاء منصة ماذا
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50"
            >
              <option value="">كل المدن</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50"
            >
              <option value="">كل الأنواع</option>
              <option value="center">مراكز وعيادات</option>
              <option value="specialist">أخصائيين</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center opacity-60 py-10">جاري التحميل...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center opacity-60 py-10">
              <p>لا توجد نتائج بعد.</p>
              <Link href="/advertise" className="inline-block mt-3 text-indigo-400 text-sm underline">سجّل مركزك أو نفسك الآن مجانًا</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {featured.length > 0 && (
                <div>
                  <h3 className="text-amber-300 font-bold text-sm mb-3 flex items-center gap-2">⭐ إعلانات مميزة</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featured.map(renderCard)}
                  </div>
                </div>
              )}
              <div className={featured.length > 0 ? 'mt-4' : ''}>
                {featured.length > 0 && <h3 className="font-bold text-sm mb-3 opacity-70">جميع الإعلانات</h3>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regular.map(renderCard)}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
