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
    <div className="welcome-container-premium min-h-screen relative overflow-hidden bg-dark">
      
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
                  <div className="content-inner animate-slide-up">
                    <h1 className="hero-main-title">{slide.title}</h1>
                    <p className="hero-subtext">{slide.subtitle}</p>
                    <div className="hero-actions">
                      <Link href={slide.link || '#'} className="btn-world-class shadow-glow">
                        ابدأ الرحلة الآن
                      </Link>
                      <Link href="/about" className="btn-outline-world-class">
                        تعرف علينا أكثر
                      </Link>
                    </div>
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
          }
          .bg-dark { background-color: #050505; }
          
          /* Ambient Glows */
          .ambient-glow {
            position: absolute;
            width: 600px;
            height: 600px;
            border-radius: 50%;
            filter: blur(120px);
            opacity: 0.15;
            pointer-events: none;
            z-index: 1;
          }
          .glow-1 { top: -100px; left: -100px; background: var(--accent-primary); }
          .glow-2 { bottom: -100px; right: -100px; background: #6366f1; }

          /* App Install Banner */
          .app-install-banner-premium {
            position: fixed;
            bottom: -100px;
            left: 0;
            width: 100%;
            z-index: 1000;
            padding: 1.5rem;
            transition: bottom 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .app-install-banner-premium.visible { bottom: 0; }
          .banner-glass-panel {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 2.5rem;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          }
          .badge-new {
            background: var(--accent-primary);
            color: white;
            padding: 2px 8px;
            border-radius: 6px;
            font-size: 0.7rem;
            font-weight: 800;
            display: inline-block;
            margin-bottom: 0.5rem;
          }

          /* Hero Slider */
          .hero-slider-section {
            height: 100vh;
            width: 100%;
            position: relative;
          }
          .slider-wrapper {
            height: 100%;
            width: 100%;
            position: relative;
            overflow: hidden;
          }
          .slide-premium {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center;
            opacity: 0;
            transition: opacity 1.5s ease-in-out, transform 2s ease-out;
            transform: scale(1.1);
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .slide-premium.active {
            opacity: 1;
            transform: scale(1.0);
            z-index: 2;
          }
          .slide-overlay-gradient {
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8));
          }
          .slide-content-premium {
            position: relative;
            z-index: 10;
            text-align: center;
            max-width: 900px;
          }
          .hero-main-title {
            font-size: clamp(2.5rem, 8vw, 5rem);
            font-weight: 900;
            line-height: 1.1;
            margin-bottom: 1.5rem;
            letter-spacing: -0.02em;
          }
          .hero-subtext {
            font-size: 1.25rem;
            color: rgba(255,255,255,0.7);
            margin-bottom: 2.5rem;
            line-height: 1.6;
          }
          .shadow-glow { box-shadow: 0 0 30px rgba(var(--accent-primary-rgb), 0.4); }

          /* Background Images Loop via Prop (or fallback to style-jsx) */
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
            backdrop-filter: blur(10px);
            transition: all 0.3s;
          }
          .btn-outline-world-class:hover { background: rgba(255,255,255,0.1); border-color: white; }

          /* Services Grid */
          .premium-cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
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
      <section className="services-section-premium container py-4">
        <div className="section-header-center mb-4">
          <span className="section-tag bg-accent-primary/20 color-accent-primary">خدماتنا</span>
          <h2 className="section-title-premium text-4xl font-bold mt-1">نحن نصنع <span className="text-gradient">المستقبل</span> لأطفالنا</h2>
          <p className="section-subtitle text-secondary mt-1">منصة متكاملة تجمع بين الخبرة البشرية وأحدث تقنيات الذكاء الاصطناعي.</p>
        </div>

        <div className="premium-cards-grid grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="premium-card group glass-morph">
             <div className="card-image-wrapper overflow-hidden rounded-t-2xl h-200">
                <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop" alt="Special Needs" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
             </div>
             <div className="card-body p-2 flex-col gap-1">
                <h3 className="text-xl font-bold">ذوي الاحتياجات الخاصة</h3>
                <p className="text-secondary line-height-18">{content.about_summary || "نقدم لهم تقارير تقييم ذكية وجلسات متابعة تخاطب وسلوك مكثفة."}</p>
                <Link href="/register?role=PARENT" className="card-link color-accent-primary font-bold">اشترك الآن <span>→</span></Link>
             </div>
          </div>

          <div className="premium-card group glass-morph active-premium relative">
             <div className="card-image-wrapper overflow-hidden rounded-t-2xl h-200">
                <img src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800" alt="Typical Children" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
             </div>
             <div className="card-body p-2 flex-col gap-1">
                <h3 className="text-xl font-bold">تنميـة مهـارات الأطفـال</h3>
                <p className="text-secondary line-height-18">{content.specialist_summary || "نركز على تنمية المهارات الإبداعية، التركيز، والتفوق الدراسي عبر خطط مدروسة."}</p>
                <Link href="/register?role=PARENT" className="card-link color-accent-primary font-bold">ابدأ الرحلة <span>→</span></Link>
             </div>
             <div className="absolute top-1 right-1 bg-accent-primary color-white px-1 py-0-5 rounded-full text-xs font-bold shadow-lg">الأكثر طلباً</div>
          </div>

          <div className="premium-card group glass-morph">
             <div className="card-image-wrapper overflow-hidden rounded-t-2xl h-200">
                <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800" alt="Adults" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
             </div>
             <div className="card-body p-2 flex-col gap-1">
                <h3 className="text-xl font-bold">تمكيـن الكبـار والبالغيـن</h3>
                <p className="text-secondary line-height-18">{content.adult_summary || "استشارات نفسية ومهنية لدعم الاستقرار النفسي والإنتاجية في الحياة المعاصرة."}</p>
                <Link href="/register?role=PARENT" className="card-link color-accent-primary font-bold">احجز موعدك <span>→</span></Link>
             </div>
          </div>
        </div>
      </section>

      {/* AI Features Highlight */}
      <section className="ai-highlight-section container py-4">
         <div className="glass-panel p-4 flex flex-col md:flex-row-reverse items-center gap-4 overflow-hidden relative border border-white/10 rounded-3xl">
            <div className="ai-image-side relative flex-1 w-full">
               <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-blue-600 color-white px-2 py-1 rounded-full text-sm font-bold animate-pulse shadow-xl z-10">AI Powered</div>
               <img 
                 src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200" 
                 alt="AI Technology" 
                 className="rounded-2xl shadow-2xl w-full h-full object-cover"
               />
            </div>
            <div className="ai-content-side flex-1 flex-col gap-2">
               <h2 className="text-3xl font-bold color-white">تقنيات الذكاء الاصطناعي <br/>في خدمتك دائمـاً</h2>
               <div className="feature-list-premium flex-col gap-2">
                  <div className="feature-item-premium flex items-start gap-1">
                     <span className="text-2xl">🤖</span>
                     <div>
                        <h4 className="font-bold color-white">تقارير سريرية فورية</h4>
                        <p className="text-secondary text-sm">توليد تقارير شاملة بناءً على مقاييس عالمية في ثوانٍ معدودة لتوفير الوقت والجهد.</p>
                     </div>
                  </div>
                  <div className="feature-item-premium flex items-start gap-1">
                     <span className="text-2xl">📊</span>
                     <div>
                        <h4 className="font-bold color-white">تحليل مسار التطور</h4>
                        <p className="text-secondary text-sm">مراقبة دقيقة لكل الجلسات برسوم بيانية تفاعلية توضح مدى التقدم المحقق أسبوعياً.</p>
                     </div>
                  </div>
               </div>
               <button className="btn-gradient px-3 py-1 mt-1 rounded-xl font-bold shadow-lg-glow w-fit">اكتشف القوة الآن</button>
            </div>
         </div>
      </section>

      {/* Why Choose Us Icons */}
      <section className="trust-section-premium py-6 bg-dark-lighter/30">
         <div className="container grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="trust-item flex-col items-center gap-1">
               <div className="text-4xl mb-1 bg-white/5 w-16 h-16 flex-center rounded-full mx-auto border border-white/10 group-hover:bg-accent-primary/20 transition-all">🔒</div>
               <h4 className="font-bold color-white">خصوصية تامة</h4>
               <p className="text-xs text-secondary">بياناتك مشفرة ومحمية بالكامل</p>
            </div>
            <div className="trust-item flex-col items-center gap-1">
               <div className="text-4xl mb-1 bg-white/5 w-16 h-16 flex-center rounded-full mx-auto border border-white/10">🌍</div>
               <h4 className="font-bold color-white">دعم عالمي</h4>
               <p className="text-xs text-secondary">نخدمكم في أي مكان حول العالم</p>
            </div>
            <div className="trust-item flex-col items-center gap-1">
               <div className="text-4xl mb-1 bg-white/5 w-16 h-16 flex-center rounded-full mx-auto border border-white/10">👩‍⚕️</div>
               <h4 className="font-bold color-white">نخبة الأخصائيين</h4>
               <p className="text-xs text-secondary">أفضل الكفاءات في مجالات التأهيل</p>
            </div>
            <div className="trust-item flex-col items-center gap-1">
               <div className="text-4xl mb-1 bg-white/5 w-16 h-16 flex-center rounded-full mx-auto border border-white/10">⚡</div>
               <h4 className="font-bold color-white">سرعة فائقة</h4>
               <p className="text-xs text-secondary">واجهة سلسة وأداء استثنائي</p>
            </div>
         </div>
      </section>

    </div>
  );
}
