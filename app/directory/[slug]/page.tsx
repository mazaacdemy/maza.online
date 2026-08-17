'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';

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
  views: number;
  createdAt: string;
};

export default function ListingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>('');
  const [listing, setListing] = useState<Listing | null>(null);
  const [locked, setLocked] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { status } = useSession();

  useEffect(() => {
    params.then(p => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/directory/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.listing) {
          setListing(data.listing);
          setLocked(data.locked);
        } else {
          setError(data.error || 'غير موجود');
        }
      })
      .catch(() => setError('فشل التحميل'))
      .finally(() => setLoading(false));
  }, [slug, status]);

  const services = listing?.services ? JSON.parse(listing.services) : [];

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen opacity-60">جاري التحميل...</div>;
  }

  if (error || !listing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center">
        <p className="opacity-70">{error || 'صفحة غير موجودة'}</p>
        <Link href="/directory" className="text-indigo-400 text-sm underline">العودة للدليل</Link>
      </div>
    );
  }

  const isCenter = listing.type === 'center';

  return (
    <div className="bg-color-primary min-h-screen text-primary">
      <div className="immersive-header dynamic-bg">
        <div className="immersive-overlay"></div>
        <h1 className="immersive-title">{listing.name}</h1>
      </div>

      <style jsx>{`
        .dynamic-bg {
          background-image: url('${listing.image || (isCenter ? '/assets/cms/about_hero.png' : '/assets/hero/hero1.png')}');
        }
      `}</style>

      <main className="overlapping-content max-w-4xl mx-auto">
        <div className="flex flex-col gap-4">
          {/* Breadcrumb */}
          <div className="text-[11px] opacity-50">
            <Link href="/directory" className="hover:opacity-100">الدليل</Link>
            {' / '}
            <span>{listing.city}</span>
          </div>

          {/* Header card */}
          <div className="card glass-panel p-5 border border-white/5">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl flex-shrink-0">
                  {listing.image ? <img src={listing.image} alt={listing.name} className="w-full h-full object-cover rounded-2xl" /> : (isCenter ? '🏥' : '👩‍⚕️')}
                </div>
                <div>
                  <h2 className="text-xl font-black flex items-center gap-2">
                    {listing.name}
                    {listing.featured && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">⭐ مميز</span>}
                  </h2>
                  <p className="text-xs opacity-60 mt-1">{isCenter ? 'مركز / عيادة' : 'أخصائي'} · {listing.city}</p>
                  <p className="text-[11px] opacity-40 mt-1">👁 {listing.views} مشاهدة</p>
                </div>
              </div>
            </div>

            {listing.description && (
              <p className="text-sm leading-relaxed opacity-80 mt-5 whitespace-pre-wrap">{listing.description}</p>
            )}

            {services.length > 0 && (
              <div className="mt-5">
                <h3 className="text-xs font-bold opacity-60 mb-2">الخدمات:</h3>
                <div className="flex flex-wrap gap-2">
                  {services.map((s: string, i: number) => (
                    <span key={i} className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact card — THE LOGIN WALL */}
          <div className="card glass-panel p-5 border border-indigo-500/30 relative overflow-hidden">
            {locked ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">🔒</div>
                <h3 className="text-lg font-black">رقم التواصل مخفي</h3>
                <p className="text-xs opacity-60 mt-2 max-w-sm mx-auto leading-relaxed">
                  سجّل دخولك مجانًا لتتمكن من رؤية رقم التواصل والتفاصيل الكاملة للتواصل مباشرة مع {isCenter ? 'المركز' : 'الأخصائي'}.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center mt-5">
                  <button
                    onClick={() => signIn()}
                    className="maza-hero-btn px-6 py-2.5 text-sm"
                  >
                    تسجيل الدخول / التسجيل مجانًا
                  </button>
                  <a
                    href="/register"
                    className="btn-secondary inline-flex items-center justify-center px-6 py-2.5 text-sm rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
                  >
                    إنشاء حساب جديد
                  </a>
                </div>
                <p className="text-[10px] opacity-40 mt-4">التسجيل مجاني 100% — بدون أي رسوم</p>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">📞</div>
                <h3 className="text-lg font-black">رقم التواصل متاح</h3>
                <a
                  href={`https://wa.me/2${listing.phone?.replace(/^0/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 maza-hero-btn px-8 py-3 text-sm"
                >
                  <span>💬</span>
                  <span dir="ltr">{listing.phone}</span>
                </a>
                <p className="text-[11px] opacity-50 mt-3">اضغط للتواصل عبر واتساب مباشرة</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
