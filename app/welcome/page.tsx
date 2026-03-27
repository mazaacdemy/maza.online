'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Slide {
  id: string | number;
  image: string;
  title: string;
  subtitle?: string;
  link: string;
  btnText: string;
}

const defaultSlides: Slide[] = [
  {
    id: 'def1',
    image: '/assets/hero/parent_v11.png',
    title: 'تمكين طفلك يبدأ بخبراتنا',
    subtitle: 'سجل الآن كولي أمر لتستفيد من برامج تأهيلية متكاملة مصممة خصيصاً لطفلك.',
    link: '/register',
    btnText: 'تسجيل ولي أمر'
  },
  {
    id: 'def2',
    image: '/assets/hero/specialist_v11.png',
    title: 'مجتمع الأخصائيين المعتمدين',
    subtitle: 'انضم لنخبة الأخصائيين واستخدم أدواتنا المتطورة في المتابعة والتشخيص.',
    link: '/register',
    btnText: 'تسجيل أخصائي'
  },
  {
    id: 'def3',
    image: '/assets/hero/center_v11.png',
    title: 'حلول رقمية للمراكز المتخصصة',
    subtitle: 'قم بإدارة مركزك بكفاءة عالية وتابع تقدم جميع الحالات في منصة واحدة.',
    link: '/register',
    btnText: 'تسجيل مركز متخصص'
  },
  {
    id: 'def4',
    image: '/assets/hero/consult_v11.png',
    title: 'استشارة شخصية من الخبراء',
    subtitle: 'احجز جلستك الآن مع طاقم خبراء متميز للحصول على توجيه دقيق ومدروس.',
    link: '/contact',
    btnText: 'طلب استشارة شخصية'
  }
];

export default function WelcomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const [slidesRes, settingsRes] = await Promise.all([
          fetch('/api/admin/slides'),
          fetch('/api/admin/settings')
        ]);
        
        let slidesData = [];
        let settingsData = [];
        
        if (slidesRes.ok) slidesData = await slidesRes.json();
        if (settingsRes.ok) settingsData = await settingsRes.json();
        
        const settingsObj: any = {};
        if (Array.isArray(settingsData)) {
          settingsData.forEach((s: any) => { settingsObj[s.key] = s.value; });
        }
        
        if (slidesData && slidesData.length > 0) {
          setSlides(slidesData);
        }
        setSettings(settingsObj);
      } catch (err) {
        console.warn("API Fetch failed, using fail-safe defaults", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide(p => (p + 1) % slides.length);
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
    <div className="s-root" dir="rtl">
      
      {/* Hero Master - 100vh */}
      <section className="s-hero-adaptive">
        <div className="s-slider">
          {slides.map((slide, idx) => (
            <div key={slide.id} 
              className={`s-slide ${idx === currentSlide ? 'active' : ''}`}
              style={{ 
                visibility: idx === currentSlide ? 'visible' : 'hidden',
                pointerEvents: idx === currentSlide ? 'auto' : 'none',
                zIndex: idx === currentSlide ? 50 : 0
              }}
            >
              <div className="s-slide-img" style={{ backgroundImage: `url(${slide.image})` }}></div>
               <div className="s-container h-full flex items-center relative z-[1000]">
                  <div className="s-glass-card" style={{ 
                    opacity: 1, 
                    visibility: 'visible', 
                    display: 'block', 
                    position: 'relative', 
                    zIndex: 1001,
                    background: 'rgba(15, 23, 42, 0.8) !important',
                    backdropFilter: 'blur(20px) !important'
                  }}>
                     <h1 className="s-title-h1" style={{ opacity: 1, visibility: 'visible', color: '#ffffff' }}>{slide.title}</h1>
                     <p className="s-title-p" style={{ opacity: 1, visibility: 'visible', color: '#ffffff' }}>{slide.subtitle}</p>
                     <div className="mt-[55px]">
                        <Link href={slide.link} className="maza-hero-btn">
                          {slide.btnText || "اكتشف المزيد"}
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
        
        <button className="s-nav-btn right" onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)}>
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
        <button className="s-nav-btn left" onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}>
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
      </section>

      {/* About Section - Restored and Padded */}
      <section className="s-surface s-section-grand relative overflow-hidden">
        <div className="s-container">
           <div className="s-bento-dual">
            <div className="anim-up">
               <div className="s-tag mb-8">رسالتنا السامية</div>
               <h2 className="s-title-h2 mb-12">نقلة نوعية في <span className="text-indigo-600">التأهيل</span> الرقمي</h2>
               <p className="text-2xl opacity-70 leading-relaxed mb-24">
                  أكاديمية ماذا هي منصة تربوية وتأهيلية تسعى لتمكين ذوي الهمم وأسرهم عبر برامج مدروسة وفريق عمل متخصص. نحن نؤمن بالقدرات اللامحدودة لكل طفل ونعمل على صقلها بأفضل المعايير الدولية.
               </p>
               <div>
                  <Link href="/about" className="maza-hero-btn">اكتشف كواليس العمل</Link>
               </div>
            </div>
            
            <div className="relative anim-pop p-0 overflow-hidden group min-h-[600px] rounded-[60px] border-none shadow-2xl">
               <img src="/assets/hero/parent_4k.png" className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-110" alt="About Maza" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-20 right-20 left-20 flex flex-col items-end text-white text-right">
                   <div className="flex items-center gap-4 mb-4">
                      <span className="h-[2px] w-12 bg-indigo-500"></span>
                      <span className="text-xl font-bold tracking-widest uppercase opacity-80">خبرتنا المتراكمة</span>
                   </div>
                   <h3 className="text-6xl font-black mb-6 leading-none">
                      10 <span className="text-3xl font-bold opacity-60">سنوات</span>
                   </h3>
                   <p className="text-2xl font-medium opacity-90 border-r-4 border-indigo-600 pr-8">
                      في رعاية وتمكين ذوي الهمم بأحدث المعايير الدولية
                   </p>
                </div>
            </div>
         </div>
        </div>
      </section>

      {/* Services Section - Restored Cards, No Borders */}
       <section className="s-surface-muted s-section-grand relative overflow-hidden">
         <div className="s-container flex flex-col items-center justify-center min-h-[50vh]">
            <div className="text-center mb-32 anim-up">
               <span className="s-tag">حلولنا الحصرية</span>
               <h2 className="s-title-h2 mt-8">خدمات مصممة <span className="text-indigo-600">بدقة</span></h2>
            </div>
            
            <div className="s-services-grid-v2">
              {[
                { i: "/assets/services/disability.png", t: "رعاية ذوي الهمم", d: "خطط تأهيلية متكاملة لتطوير المهارات الحياتية والاجتماعية بأحدث الأساليب العالمية." },
                { i: "/assets/services/specialist.png", t: "دعم الأخصائيين", d: "أدوات مخصصة لتحسين جودة التشخيص والمتابعة الدقيقة للنتائج والتقارير." },
                { i: "/assets/services/family.png", t: "الإرشاد الأسري", d: "نحن ندعم الأسرة كشريك أساسي في رحلة التأهيل والنمو المتكامل للطفل." }
              ].map((f, i) => (
                <div key={i} className="s-adaptive-card p-12 text-right anim-up border-none shadow-none bg-slate-50 dark:bg-white/5" style={{ animationDelay: `${i * 0.2}s` }}>
                   <div className="mb-10 w-40 h-40 overflow-hidden rounded-2xl mx-auto md:ml-0 md:mr-auto">
                      <img src={f.i} alt={f.t} className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500" />
                   </div>
                   <h3 className="text-4xl font-black mb-6 mt-8">{f.t}</h3>
                   <p className="opacity-70 leading-relaxed text-2xl">{f.d}</p>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* Stats Section - Refined Spacing */}
      <section className="s-surface s-section-grand relative overflow-hidden">
        <div className="s-container relative z-10">
            <div className="s-stats-grid">
               {[
                 { l: "حالة تم تأهيلها", v: 15000, p: "+", i: "🎯" },
                 { l: "أخصائي معتمد", v: 80, p: "+", i: "🏆" },
                 { l: "محافظة نخدمها", v: 27, p: "", i: "📍" },
                 { l: "ساعة خبرة", v: 25, p: "k+", i: "⏳" }
               ].map((s, i) => (
                 <div key={i} className="text-center md:text-right anim-up" style={{ animationDelay: `${i * 0.2}s` }}>
                    <div className="mb-12 opacity-10" style={{ fontSize: '100px', lineHeight: 1 }}>{s.i}</div>
                    <div className="text-7xl font-black text-indigo-600 mb-6 flex items-center justify-center md:justify-start">
                       <span>{s.v}</span>
                       <span className="ml-2">{s.p}</span>
                    </div>
                    <div className="text-2xl font-bold opacity-50 uppercase tracking-widest">{s.l}</div>
                 </div>
               ))}
            </div>
        </div>
      </section>

      <style jsx>{`
        .s-root { font-family: 'Cairo', sans-serif; background: #ffffff; color: #1e293b; overflow-x: hidden; transition: background 0.5s, color 0.5s; }
        :global([data-theme='dark']) .s-root { background: #0f172a; color: #f1f5f9; }
        .s-container { max-width: 1400px; margin: 0 auto; padding: 0 40px; }
        .s-section-grand { padding-top: 50px !important; padding-bottom: 50px !important; }
        .s-surface { background: #ffffff; transition: background 0.5s; }
        :global([data-theme='dark']) .s-surface { background: #0f172a; }
        .s-surface-muted { background: #f1f5f9; transition: background 0.5s; }
        :global([data-theme='dark']) .s-surface-muted { background: #1e293b; }

        .s-hero-adaptive { height: 100vh; position: relative; overflow: hidden; background: #000; }
        .s-slider { height: 100%; position: relative; }
        .s-slide { position: absolute; inset: 0; opacity: 0; visibility: hidden; transition: 1.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .s-slide.active { opacity: 1; visibility: visible; }
        .s-slide-img { position: absolute; inset: 0; background-size: cover; background-position: center; z-index: 1; filter: brightness(0.65); transform: scale(1.1); transition: 10s linear; }
        .active .s-slide-img { transform: scale(1); }
        
        .s-glass-card { z-index: 1001; padding: 60px; max-width: 850px; color: #ffffff !important; text-align: right; opacity: 1 !important; visibility: visible !important; }
        .s-m-box { width: 60px; height: 60px; background: #6366f1; color: white; display: flex; align-items: center; justify-content: center; border-radius: 16px; font-weight: 950; font-size: 1.8rem; box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4); }
        .s-tag { color: #818cf8; font-weight: 950; text-transform: uppercase; letter-spacing: 4px; font-size: 1rem; margin-bottom: 2rem; }
        
        .s-title-h1 { font-size: clamp(3.5rem, 6vw, 5.5rem); font-weight: 950; line-height: 1.1; margin-bottom: 2.5rem; text-shadow: 0 5px 20px rgba(0,0,0,0.6); color: #ffffff !important; opacity: 1 !important; }
        .s-title-h2 { font-size: clamp(2.8rem, 5vw, 4.5rem); font-weight: 950; line-height: 1.2; }
        .s-title-p { font-size: 1.8rem; opacity: 1 !important; line-height: 1.8; max-width: 750px; text-shadow: 0 2px 10px rgba(0,0,0,0.5); color: #ffffff !important; }

        .maza-hero-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.7rem 1.8rem;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #ffffff !important;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
          box-shadow: 0 10px 25px rgba(99, 102, 241, 0.2);
          transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 1px solid rgba(255,255,255,0.25);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .maza-hero-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: all 0.6s;
        }
        .maza-hero-btn:hover {
          transform: translateY(-5px) scale(1.03);
          box-shadow: 0 15px 35px rgba(99, 102, 241, 0.35);
          border-color: rgba(255,255,255,0.5);
        }
        .maza-hero-btn:hover::before {
          left: 100%;
        }

        .s-nav-btn { position: absolute; top: 50%; translate: 0 -50%; width: 90px; height: 90px; border-radius: 50%; background: rgba(255,255,255,0.03); color: white; border: 1px solid rgba(255,255,255,0.1); z-index: 500; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.5s; backdrop-filter: blur(10px); }
        .s-nav-btn:hover { background: #6366f1; transform: translateY(-50%) scale(1.1); border-color: #6366f1; box-shadow: 0 0 40px rgba(99, 102, 241, 0.5); }
        .s-nav-btn.right { right: 60px; }
        .s-nav-btn.left { left: 60px; }

        .s-bento-dual { display: grid; grid-template-columns: 1fr 1fr; gap: 100px; align-items: center; }
        .s-services-grid-v2 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 60px; margin: 40px 0; width: 100%; }
        .s-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 80px; }

        .s-adaptive-card { border-radius: 60px; transition: 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .s-adaptive-card:hover { transform: translateY(-15px); }

        .anim-up { animation: up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .anim-pop { animation: pop 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; }
        @keyframes up { from { opacity: 0; transform: translateY(80px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pop { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }

        @media (max-width: 768px) {
           .s-container { padding: 0 30px; }
           .s-bento-dual, .s-stats-grid, .s-services-grid-v2 { grid-template-columns: 1fr !important; gap: 40px; }
           .s-glass-card { text-align: center; margin: 0 auto; padding: 30px; }
           .s-nav-btn { width: 60px; height: 60px; }
           .s-title-h1 { font-size: 3rem; }
           .s-title-p { font-size: 1.4rem; }
        }
      `}</style>
    </div>
  );
}
