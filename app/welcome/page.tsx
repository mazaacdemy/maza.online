/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './welcome.css';

interface Slide {
  id: string | number;
  image: string;
  title: string;
  subtitle?: string;
  link: string;
  btnText: string;
}

interface Stat {
  l: string;
  v: string;
  p: string;
  i: string;
}

interface Service {
  i: string;
  t: string;
  d: string;
}

const defaultSlides: Slide[] = [
  { id: 'def1', image: '/assets/hero/parent_v11.png', title: 'تمكين طفلك يبدأ بخبراتنا', subtitle: 'سجل الآن كولي أمر لتستفيد من برامج تأهيلية متكاملة مصممة خصيصاً لطفلك.', link: '/register', btnText: 'تسجيل ولي أمر' },
  { id: 'def2', image: '/assets/hero/specialist_v11.png', title: 'مجتمع الأخصائيين المعتمدين', subtitle: 'انضم لنخبة الأخصائيين واستخدم أدواتنا المتطورة في المتابعة والتشخيص.', link: '/register', btnText: 'تسجيل أخصائي' },
  { id: 'def3', image: '/assets/hero/center_v11.png', title: 'حلول رقمية للمراكز المتخصصة', subtitle: 'قم بإدارة مركزك بكفاءة عالية وتابع تقدم جميع الحالات في منصة واحدة.', link: '/register', btnText: 'تسجيل مركز متخصص' },
  { id: 'def4', image: '/assets/hero/consult_v11.png', title: 'استشارة شخصية من الخبراء', subtitle: 'احجز جلستك الآن مع طاقم خبراء متميز للحصول على توجيه دقيق ومدروس.', link: '/contact', btnText: 'طلب استشارة شخصية' }
];

const defaultStats: Stat[] = [
  { l: "حالة تم تأهيلها", v: "15000", p: "+", i: "🎯" },
  { l: "أخصائي معتمد", v: "80", p: "+", i: "🏆" },
  { l: "محافظة نخدمها", v: "27", p: "", i: "📍" },
  { l: "ساعة خبرة", v: "25", p: "k+", i: "⏳" }
];

const defaultServices: Service[] = [
  { i: "/assets/services/disability.png", t: "رعاية ذوي الهمم", d: "خطط تأهيلية متكاملة لتطوير المهارات الحياتية والاجتماعية بأحدث الأساليب العالمية." },
  { i: "/assets/services/specialist.png", t: "دعم الأخصائيين", d: "أدوات مخصصة لتحسين جودة التشخيص والمتابعة الدقيقة للنتائج والتقارير." },
  { i: "/assets/services/family.png", t: "الإرشاد الأسري", d: "نحن ندعم الأسرة كشريك أساسي في رحلة التأهيل والنمو المتكامل للطفل." }
];

export default function WelcomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [stats, setStats] = useState<Stat[]>(defaultStats);
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [loading, setLoading] = useState(true);
  const [cmsContent, setCmsContent] = useState<Record<string, string>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [slidesRes, contentRes] = await Promise.all([
          fetch('/api/admin/slides'),
          fetch('/api/admin/content')
        ]);

        if (slidesRes.ok) {
          const slidesData = await slidesRes.json();
          if (slidesData && slidesData.length > 0) setSlides(slidesData);
        }

        if (contentRes.ok) {
          const contentData = await contentRes.json();
          if (contentData) {
            const dynamicStats: Stat[] = [];
            for (let i = 1; i <= 4; i++) {
              if (contentData[`stat_${i}_label`] || contentData[`stat_${i}_value`]) {
                dynamicStats.push({
                  l: contentData[`stat_${i}_label`] || '',
                  v: contentData[`stat_${i}_value`] || '',
                  p: i === 1 || i === 2 ? '+' : i === 4 ? 'k+' : '',
                  i: contentData[`stat_${i}_icon`] || '✨'
                });
              }
            }
            if (dynamicStats.length > 0) setStats(dynamicStats);

            const dynamicServices: Service[] = [];
            for (let i = 1; i <= 3; i++) {
              if (contentData[`service_${i}_title`]) {
                dynamicServices.push({
                  t: contentData[`service_${i}_title`],
                  d: contentData[`service_${i}_desc`] || '',
                  i: contentData[`service_${i}_img`] || '/assets/services/disability.png'
                });
              }
            }
            if (dynamicServices.length > 0) setServices(dynamicServices);

            // Store full CMS content for direct field access
            setCmsContent(contentData);
          }
        }
      } catch (err) {
        console.warn("CMS Fetch failed", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-8"></div>
      <div className="text-2xl font-black">جاري تحضير التحفة الفنية...</div>
    </div>
  );

  return (
    <div className="s-root" dir="rtl" ref={containerRef}>

      <section className="s-hero-adaptive">
        <div className="s-slider">
          {slides.map((slide, idx) => (
            <div key={idx} className={`s-slide ${idx === currentSlide ? 'active' : ''}`}>
              {/* Dynamic background handled via standard data attribute or controlled injection in CSS */}
              <div
                className="s-slide-img"
                data-bg={slide.image}
                // Using double brackets to ensure it's not a template string in standard JSX if possible
                {...({ style: { '--slide-bg': `url(${slide.image})` } } as any)}
              ></div>
              <div className="s-container h-full flex items-center relative s-hero-content-layer">
                <div className="s-hero-content">
                  <h1 className="s-title-h1">{slide.title}</h1>
                  <p className="s-title-p">{slide.subtitle}</p>
                  <div className="mt-[95px]">
                    <Link href={slide.link} className="maza-hero-btn" title={slide.btnText || "اكتشف المزيد"}>
                      {slide.btnText || "اكتشف المزيد"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="s-nav-btn right" onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)} title="السابق">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
        <button className="s-nav-btn left" onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)} title="التالي">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
      </section>

      <section className="s-surface s-section-grand relative overflow-hidden">
        <div className="s-container">
          <div className="s-bento-dual">
            <div className="anim-up">
              <div className="s-tag mb-8">{cmsContent.about_tag || 'عقد من التميز'}</div>
              <h2 className="s-title-h2 mb-12">{cmsContent.about_title || 'نقلة نوعية في التأهيل الرقمي'}</h2>
              <div className="bg-indigo-600/10 p-12 rounded-3xl border border-indigo-500/20 backdrop-blur-xl mb-12 text-right">
                <div className="text-sm font-bold text-indigo-400 mb-2 uppercase tracking-widest">{cmsContent.about_years_label || 'خبرتنا المتراكمة'}</div>
                <div className="text-6xl font-black mb-4">{cmsContent.about_years_value || '10 سنوات'}</div>
                <div className="text-2xl opacity-90 leading-relaxed font-black">{cmsContent.about_years_desc || 'في رعاية وتمكين ذوي الهمم بأحدث المعايير الدولية'}</div>
              </div>
              <p className="text-2xl opacity-70 leading-relaxed mb-8">
                {cmsContent.about_description || 'أكاديمية ماذا هي منصة تربوية وتأهيلية تسعى لتمكين ذوي الهمم وأسرهم عبر برامج مدروسة وفريق عمل متخصص.'}
              </p>
              <div className="s-about-btn-wrapper">
                <Link href="/about" className="maza-hero-btn" title={cmsContent.about_btn_text || 'اكتشف كواليس العمل'}>
                  {cmsContent.about_btn_text || 'اكتشف كواليس العمل'}
                </Link>
              </div>
            </div>
            <div className="relative anim-pop p-0 overflow-hidden group min-h-[600px] rounded-[60px] border-none shadow-2xl">
              <img src={cmsContent.about_home_img || '/assets/hero/parent_v11.png'} alt="About Maza" className="w-full h-full object-cover grayscale-[0.2] transition-all duration-1000 scale-105 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="s-surface-muted s-section-grand relative overflow-hidden">
        <div className="s-container">
          <div className="text-center mb-60 anim-up">
            <span className="s-tag">{cmsContent.services_section_tag || 'حلولنا الحصرية'}</span>
            <h2 className="s-title-h2 mt-8">{cmsContent.services_section_title || 'خدمات مصممة بدقة'}</h2>
          </div>
          <div className="s-services-grid-v2">
            {services.map((f, i) => (
              <div key={i} className="s-adaptive-card p-12 text-right anim-up border-none shadow-none bg-slate-50 dark:bg-white/5" {...({ style: { '--delay': `${i * 0.2}s` } } as any)}>
                <div className="mb-10 w-40 h-40 overflow-hidden rounded-2xl mx-auto md:ml-0 md:mr-auto relative">
                  <img src={f.i} alt={f.t} className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-4xl font-black mb-6 mt-8">{f.t}</h3>
                <p className="opacity-70 leading-relaxed text-2xl">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="s-surface s-section-grand relative overflow-hidden">
        <div className="s-container relative z-10">
          <div className="s-stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="text-center md:text-right anim-up" {...({ style: { '--delay': `${i * 0.3}s` } } as any)}>
                <div className="s-stat-icon-bg mb-12 opacity-20">{s.i}</div>
                <div className="s-stat-value">
                  <span>{s.v}</span>
                  <span className="ml-2">{s.p}</span>
                </div>
                <div className="s-stat-label">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
