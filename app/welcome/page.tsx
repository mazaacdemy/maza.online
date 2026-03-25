'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Slide {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  link?: string;
  order: number;
}

export default function WelcomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showBanner, setShowBanner] = useState(false);
  const [cmsContent, setCmsContent] = useState<any>(null);
  const [slides, setSlides] = useState<Slide[]>([]);

  useEffect(() => {
    // Fetch CMS and Slides
    Promise.all([
      fetch('/api/admin/content').then(res => res.json()),
      fetch('/api/admin/slides').then(res => res.json())
    ]).then(([contentData, slidesData]) => {
      if (contentData && !contentData.error) setCmsContent(contentData);
      if (Array.isArray(slidesData)) {
        setSlides(slidesData);
      } else {
        // Fallback slides if DB is empty
        setSlides([
          {
            id: '1',
            image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1920",
            title: "مرحباً بكم يا أولياء الأمور",
            subtitle: "نحن هنا لمساعدتكم في متابعة تطور أطفالكم. احجز جلسات، تابع التقارير الذكية، وكن جزءاً من النجاح.",
            link: "/register?role=PARENT",
            order: 0
          }
        ]);
      }
    }).catch(e => console.error("Load Error:", e));

    const timer = setTimeout(() => setShowBanner(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(slideInterval);
  }, [slides.length]);

  const content = cmsContent || {};

  return (
    <div className="welcome-container-premium min-h-screen relative overflow-hidden bg-dark" dir="rtl">
      
      {/* Background Ambient Glows */}
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>

      {/* App Install Banner */}
      <div className={`app-install-banner-premium ${showBanner ? 'visible' : ''}`}>
        <div className="banner-content banner-glass-panel">
          <div className="banner-text">
            <span className="badge-new">NEW</span>
            <strong>تطبيق أكاديمية ماذا متاح الآن!</strong>
            <p className="text-secondary m-0 text-sm">تجربة أسرع وأكثر سلاسة على هاتفك.</p>
          </div>
          <div className="install-buttons">
            <button className="btn-install-premium" onClick={() => setShowBanner(false)}>تثبيت الآن</button>
            <button className="btn-close-banner" onClick={() => setShowBanner(false)}>✕</button>
          </div>
        </div>
      </div>

      {/* Hero Slider Section */}
      <section className="hero-slider-section">
        <div className="slider-wrapper">
          {slides.length > 0 ? (
            slides.map((slide, index) => (
              <div 
                key={slide.id} 
                className={`slide-premium slide-dynamic-${index} ${index === currentSlide ? 'active' : ''}`}
              >
                <div className="slide-overlay-gradient"></div>
                <div className="slide-content-premium container">
                  <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-12 h-full pt-16">
                    {/* Content Column (Logical Start in RTL, but we want it on the LEFT side of the girl) */}
                    <div className="hero-content-col md:w-1/2 text-right animate-slide-up">
                      <div className="badge-premium mb-6 inline-flex items-center gap-3">
                        <span className="w-8 h-[2px] bg-accent-primary"></span>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-primary">نحو مستقبل مشرق</span>
                      </div>
                      <h1 className="hero-main-title leading-[1.1] text-white mb-8">
                        {slide.title}
                      </h1>
                      <p className="hero-subtext text-xl opacity-70 mb-10 max-w-xl leading-relaxed font-light">
                        {slide.subtitle}
                      </p>
                      <div className="hero-actions flex flex-wrap gap-4">
                        <Link href={slide.link || '#'} className="btn-premium btn-premium-primary shadow-glow text-lg">
                          ابدأ الرحلة الآن <span className="mr-2">←</span>
                        </Link>
                        <Link href="/about" className="btn-premium btn-premium-outline text-lg">
                          تعرف على الأكاديمية
                        </Link>
                      </div>
                    </div>

                    {/* Visual Space (This will be on the RIGHT in RTL flex-row-reverse) */}
                    <div className="md:w-1/2 h-full hidden md:block"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
             <div className="slide-premium active bg-dark flex-center">
                <p className="color-white animate-pulse">جاري تحميل المحتوى البصري...</p>
             </div>
          )}
        </div>

        <style jsx>{`
          .welcome-container-premium {
            background-color: #050505;
            color: #ffffff;
            direction: rtl;
            overflow-x: hidden;
            font-family: 'Inter', system-ui, sans-serif;
          }
          .bg-dark { background-color: #050505; }
          
          /* Ambient Glows */
          .ambient-glow {
            position: absolute;
            width: 800px;
            height: 800px;
            border-radius: 50%;
            filter: blur(150px);
            opacity: 0.1;
            pointer-events: none;
            z-index: 0;
          }
          .glow-1 { top: -200px; left: -200px; background: var(--accent-primary); }
          .glow-2 { bottom: -200px; right: -200px; background: #4f46e5; }

          /* App Install Banner */
          .app-install-banner-premium {
            position: fixed;
            bottom: -120px;
            left: 0;
            width: 100%;
            z-index: 1000;
            padding: 1.5rem;
            transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .app-install-banner-premium.visible {
            transform: translateY(-120px);
          }
          .banner-glass-panel {
            background: rgba(255, 255, 255, 0.03);
            -webkit-backdrop-filter: blur(20px);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.25rem 2.5rem;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          }

          /* Hero Slider */
          .hero-slider-section {
            height: 100vh;
            min-height: 700px;
            width: 100%;
            position: relative;
            margin-top: -80px; /* Blend with navbar */
          }
          .slider-wrapper {
            height: 100%;
            width: 100%;
            position: relative;
            overflow: hidden;
          }
          .slide-premium {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            opacity: 0;
            visibility: hidden;
            transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1;
          }
          .slide-premium.active {
            opacity: 1;
            visibility: visible;
            z-index: 2;
          }
          .slide-overlay-gradient {
            position: absolute;
            inset: 0;
            background: linear-gradient(to left, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.85) 60%, #050505 100%);
            z-index: 1;
          }

          .hero-main-title {
            font-size: clamp(2.5rem, 6vw, 4.5rem);
            font-weight: 900;
            line-height: 1.1;
            margin-bottom: 2rem;
            background: linear-gradient(to bottom, #fff, rgba(255,255,255,0.8));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .hero-subtext {
            font-size: 1.25rem;
            color: rgba(255,255,255,0.6);
            line-height: 1.7;
            max-width: 600px;
          }

          .badge-premium {
            background: rgba(var(--accent-primary-rgb), 0.1);
            color: var(--accent-primary);
            padding: 6px 16px;
            border-radius: 30px;
            border: 1px solid rgba(var(--accent-primary-rgb), 0.2);
          }

          .shadow-glow {
            box-shadow: 0 10px 40px rgba(var(--accent-primary-rgb), 0.3);
          }

          /* Background Images */
          ${slides.map((slide, index) => `
            .slide-dynamic-${index} {
              background-image: url('${slide.image}');
            }
          `).join('\n')}

          /* Slider Nav */
          .slider-nav-premium {
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 15px;
            z-index: 20;
          }
          .nav-dot-premium {
            width: 40px;
            height: 4px;
            background: rgba(255,255,255,0.2);
            cursor: pointer;
            border-radius: 2px;
            transition: all 0.3s;
          }
          .nav-dot-premium.active {
            background: white;
            width: 60px;
          }

          /* Buttons */
          .btn-world-class {
            background: white;
            color: black;
            padding: 1rem 2.5rem;
            border-radius: 14px;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            display: inline-block;
          }
          .btn-world-class:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(255,255,255,0.2); }
          
          .btn-outline-world-class {
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 1rem 2.5rem;
            border-radius: 14px;
            font-weight: 700;
            text-decoration: none;
            margin-right: 1rem;
            -webkit-backdrop-filter: blur(10px);
            backdrop-filter: blur(10px);
            transition: all 0.3s;
          }
          .btn-outline-world-class:hover { background: rgba(255,255,255,0.1); border-color: white; }

          /* Services Grid */
          .premium-cards-grid {
            margin-top: 3rem;
          }
          .premium-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 32px;
            padding: 1rem;
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .premium-card:hover { 
            background: rgba(255,255,255,0.06); 
            transform: translateY(-10px);
            border-color: rgba(255,255,255,0.1);
          }
          .active-premium { border: 1px solid rgba(var(--accent-primary-rgb), 0.3); }

          .h-200 { height: 200px; }
          .text-gradient {
            background: linear-gradient(to left, #818cf8, #c084fc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .animate-slide-up {
            animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @media (max-width: 768px) {
            .hero-actions { display: flex; flex-direction: column; gap: 1rem; }
            .btn-outline-world-class { margin-right: 0; }
          }
        `}</style>

        {/* Custom Progress Navigation */}
        <div className="slider-nav-premium">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              className={`nav-dot-premium ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
            >
              <div className="dot-fill"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section with "World-Class" Cards */}
      <section className="services-section-premium section-spacing container">
        <div className="text-center mb-16 animate-slide-up">
          <div className="badge-premium mb-4">خدمات متخصصة</div>
          <h2 className="text-4xl md:text-5xl font-black mb-6">نحن نصنع <span className="text-accent-primary">المستقبل</span> لأطفالنا</h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            نجمع بين الخبرة البشرية العميقة وأحدث تكنولوجيا الذكاء الاصطناعي لتقديم رعاية متكاملة.
          </p>
        </div>

        <div className="premium-cards-grid grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Diagnostic Special Needs */}
          <div className="glass-card group flex flex-col overflow-hidden">
             <div className="relative h-64 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop" alt="Special Needs" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-60"></div>
             </div>
             <div className="p-8 flex-col gap-4">
                <h3 className="text-2xl font-bold mb-3">ذوي الاحتياجات الخاصة</h3>
                <p className="text-white/60 mb-6 leading-relaxed">
                  {content.about_summary || "نقدم لهم تقارير تقييم ذكية وجلسات متابعة تخاطب وسلوك مكثفة تحت إشراف نخبة من الأخصائيين."}
                </p>
                <Link href="/register?role=PARENT" className="text-accent-primary font-bold inline-flex items-center gap-2 group-hover:gap-4 transition-all">
                  اشترك الآن <span className="text-xl">←</span>
                </Link>
             </div>
          </div>

          {/* Child Skills Development */}
          <div className="glass-card group flex flex-col overflow-hidden border-accent-primary/20 bg-accent-primary/5">
             <div className="relative h-64 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800" alt="Typical Children" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-60"></div>
                <div className="absolute top-4 right-4 bg-accent-primary text-white text-xs font-bold px-3 py-1 rounded-full">الأكثر طلباً</div>
             </div>
             <div className="p-8 flex-col gap-4">
                <h3 className="text-2xl font-bold mb-3">تنمية مهارات الأطفال</h3>
                <p className="text-white/60 mb-6 leading-relaxed">
                  {content.specialist_summary || "نركز على تنمية المهارات الإبداعية، التركيز، والتفوق الدراسي عبر خطط تربوية مدروسة بعناية."}
                </p>
                <Link href="/register?role=PARENT" className="text-accent-primary font-bold inline-flex items-center gap-2 group-hover:gap-4 transition-all">
                  ابدأ الرحلة <span className="text-xl">←</span>
                </Link>
             </div>
          </div>

          {/* Adult Empowerment */}
          <div className="glass-card group flex flex-col overflow-hidden">
             <div className="relative h-64 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800" alt="Adults" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-60"></div>
             </div>
             <div className="p-8 flex-col gap-4">
                <h3 className="text-2xl font-bold mb-3">تمكين الكبار والبالغين</h3>
                <p className="text-white/60 mb-6 leading-relaxed">
                  {content.adult_summary || "استشارات نفسية ومهنية لدعم الاستقرار النفسي والإنتاجية في مواجهة تحديات الحياة المعاصرة."}
                </p>
                <Link href="/register?role=PARENT" className="text-accent-primary font-bold inline-flex items-center gap-2 group-hover:gap-4 transition-all">
                  احجز موعدك <span className="text-xl">←</span>
                </Link>
             </div>
          </div>
        </div>
      </section>

      {/* AI Features Highlight */}
      <section className="ai-highlight-section section-spacing container">
         <div className="glass-card p-0 overflow-hidden relative">
            <div className="flex flex-col md:flex-row-reverse items-stretch">
               <div className="md:w-1/2 relative min-h-[400px]">
                  <img 
                    src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200" 
                    alt="AI Technology" 
                    className="absolute inset-0 w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
                  />
                  <div className="absolute top-6 left-6 bg-accent-primary text-white text-xs font-bold px-4 py-2 rounded-full animate-pulse shadow-2xl">مدعوم بالذكاء الاصطناعي</div>
               </div>
               <div className="md:w-1/2 p-12 md:p-16 flex flex-col justify-center">
                  <h2 className="text-4xl font-black mb-8 leading-tight">تقنيات الغد، <br/><span className="text-accent-primary">بين يديك اليوم</span></h2>
                  <div className="space-y-8 mb-10">
                     <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">🤖</div>
                        <div>
                           <h4 className="font-bold text-xl mb-1">تقارير سريرية ذكية</h4>
                           <p className="text-white/50 leading-relaxed">توليد تقارير شاملة بناءً على مقاييس عالمية في ثوانٍ لتحسين دقة التشخيص.</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">📊</div>
                        <div>
                           <h4 className="font-bold text-xl mb-1">تحليل ديناميكي للنمو</h4>
                           <p className="text-white/50 leading-relaxed">مراقبة دقيقة لكل الجلسات برسوم بيانية توضح مدى التقدم المحقق أسبوعياً.</p>
                        </div>
                     </div>
                  </div>
                  <button className="btn-premium btn-premium-primary self-start text-lg px-10">استكشف النظام الآن</button>
               </div>
            </div>
         </div>
      </section>

      {/* Trust & Stats Section */}
      <section className="trust-section-premium section-spacing bg-white/[0.02]">
         <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
               <div className="text-center group">
                  <div className="text-4xl mb-4 w-20 h-20 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 mx-auto group-hover:scale-110 transition-transform">🔒</div>
                  <h4 className="font-bold text-lg mb-2">خصوصية تامة</h4>
                  <p className="text-sm text-white/40">بياناتك مشفرة ومحمية بالكامل وفق المعايير العالمية.</p>
               </div>
               <div className="text-center group">
                  <div className="text-4xl mb-4 w-20 h-20 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 mx-auto group-hover:scale-110 transition-transform">🌍</div>
                  <h4 className="font-bold text-lg mb-2">دعم عالمي</h4>
                  <p className="text-sm text-white/40">نخدمكم في أي مكان حول العالم عبر منصتنا السحابية.</p>
               </div>
               <div className="text-center group">
                  <div className="text-4xl mb-4 w-20 h-20 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 mx-auto group-hover:scale-110 transition-transform">👩‍⚕️</div>
                  <h4 className="font-bold text-lg mb-2">نخبة الأخصائيين</h4>
                  <p className="text-sm text-white/40">أفضل الكفاءات العربية في مجالات التأهيل والتربية الخاصة.</p>
               </div>
               <div className="text-center group">
                  <div className="text-4xl mb-4 w-20 h-20 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 mx-auto group-hover:scale-110 transition-transform">⚡</div>
                  <h4 className="font-bold text-lg mb-2">سرعة استثنائية</h4>
                  <p className="text-sm text-white/40">استجابة فائقة وجاهزية دائمة لدعم احتياجات طفلكم.</p>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
}
