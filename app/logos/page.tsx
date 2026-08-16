'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoItem {
  name: string;
  url: string;
  type: 'image' | 'video';
  size: number;
}

export default function LogosGalleryPage() {
  const [logos, setLogos] = useState<LogoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    async function fetchLogos() {
      try {
        const res = await fetch('/api/logos');
        if (res.ok) {
          const data = await res.json();
          setLogos(data);
        }
      } catch (err) {
        console.error('Failed to fetch logos:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogos();
  }, []);

  const filteredLogos = logos.filter((logo) =>
    filter === 'all' ? true : logo.type === filter
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-color)] text-[var(--text-primary)]">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-8"></div>
        <div className="text-2xl font-black">جاري تحميل الشعارات...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)]">
      <section className="s-surface s-section-grand bg-[var(--bg-color)]">
        <div className="s-container">
          <div className="text-center mb-16">
            <h1 className="s-title-h1 mb-4">معرض الشعارات (Logos Gallery)</h1>
            <p className="text-lg opacity-70 max-w-2xl mx-auto">
              تصفح جميع الشعارات والصور والفيديوهات المتاحة في المشروع
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${filter === 'all' ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--surface-muted)] hover:bg-[var(--surface)]'}`}
            >
              الكل ({logos.length})
            </button>
            <button
              onClick={() => setFilter('image')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${filter === 'image' ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--surface-muted)] hover:bg-[var(--surface)]'}`}
            >
              الصور ({logos.filter(l => l.type === 'image').length})
            </button>
            <button
              onClick={() => setFilter('video')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${filter === 'video' ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--surface-muted)] hover:bg-[var(--surface)]'}`}
            >
              الفيديوهات ({logos.filter(l => l.type === 'video').length})
            </button>
          </div>

          <div className="flex justify-end mb-8">
            <div className="flex gap-2 bg-[var(--surface-muted)] p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-[var(--accent-primary)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                title="عرض شبكة"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-[var(--accent-primary)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                title="عرض قائمة"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="s-services-grid-v2 gap-8">
              {filteredLogos.map((logo, index) => (
                <div key={logo.name} className="s-adaptive-card group relative overflow-hidden">
                  <div className="aspect-square overflow-hidden rounded-xl bg-[var(--surface-muted)] relative">
                    {logo.type === 'image' ? (
                      <Image
                        src={logo.url}
                        alt={logo.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <video
                        src={logo.url}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <h3 className="font-semibold text-lg truncate">{logo.name.replace(/\.[^/.]+$/, '')}</h3>
                      <p className="text-sm opacity-80">{formatSize(logo.size)} &#8226; {logo.type === 'image' ? 'صورة' : 'فيديو'}</p>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${logo.type === 'image' ? 'bg-green-500/90' : 'bg-blue-500/90'}`}>
                        {logo.type === 'image' ? 'صورة' : 'فيديو'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => window.open(logo.url, '_blank')}
                      className="px-4 py-2 text-sm font-medium text-[var(--accent-primary)] hover:underline flex items-center justify-center gap-1 mx-auto"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                      عرض بالحجم الكامل
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--text-secondary)] text-sm">
                    <th className="py-4 px-6 font-semibold">معاينة</th>
                    <th className="py-4 px-6 font-semibold">الاسم</th>
                    <th className="py-4 px-6 font-semibold">النوع</th>
                    <th className="py-4 px-6 font-semibold">الحجم</th>
                    <th className="py-4 px-6 font-semibold">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogos.map((logo, index) => (
                    <tr key={logo.name} className="border-b border-[var(--border)] hover:bg-[var(--surface-muted)]">
                      <td className="py-4 px-6">
                        {logo.type === 'image' ? (
                          <Image src={logo.url} alt={logo.name} width={60} height={60} className="rounded-lg object-cover" />
                        ) : (
                          <video src={logo.url} width={60} height={60} className="rounded-lg object-cover" muted preload="metadata" />
                        )}
                      </td>
                      <td className="py-4 px-6 font-medium">{logo.name.replace(/\.[^/.]+$/, '')}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${logo.type === 'image' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                          {logo.type === 'image' ? 'صورة' : 'فيديو'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[var(--text-secondary)]">{formatSize(logo.size)}</td>
                      <td className="py-4 px-6">
                        <a href={logo.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-[var(--accent-primary)] text-white rounded-lg text-sm hover:opacity-90 transition-opacity">
                          <svg className="w-4 h-4 inline-block align-middle ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                          عرض
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredLogos.length === 0 && (
            <div className="text-center py-16 text-[var(--text-secondary)]">
              <svg className="w-16 h-16 mx-auto opacity-30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p className="text-xl">لا توجد شعارات تطابق الفلتر المحدد</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}