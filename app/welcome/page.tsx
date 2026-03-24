'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WelcomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showBanner, setShowBanner] = useState(false);

  // Slides configuration
  const slides = [
    {
      id: 0,
      bgClass: "bg-pos-center",
      image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1920",
      title: "مرحباً بكم يا أولياء الأمور",
      subtitle: "نحن هنا لمساعدتكم في متابعة تطور أطفالكم. احجز جلسات، تابع التقارير الذكية، وكن جزءاً من النجاح.",
      link: "/register?role=PARENT",
      cta: "ابدأ رحلة التطور"
    },
    {
      id: 1,
      bgClass: "bg-pos-center",
      image: "https://images.unsplash.com/photo-1544333314-bbd319f7e804?auto=format&fit=crop&q=80&w=1920",
      title: "إلى النخبة من الأخصائيين",
      subtitle: "طور عيادتك الرقمية معنا. قدم الجلسات عن بُعد، واستعن بالذكاء الاصطناعي في إصدار التقارير الطبية.",
      link: "/register?role=SPECIALIST",
      cta: "انضم كأخصائي"
    },
    {
      id: 2,
      bgClass: "bg-pos-center",
      image: "https://images.unsplash.com/photo-1574607383476-f517f260d30b?auto=format&fit=crop&q=80&w=1920",
      title: "للمراكز والمؤسسات التأهيلية",
      subtitle: "أدر فريقاً كاملاً من الأخصائيين، تابع حجوزات المركز، واستفد من نظام شامل متكامل.",
      link: "/register?role=CENTER",
      cta: "سجل مركزك الآن"
    },
    {
      id: 3,
      bgClass: "bg-pos-center",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1920",
      title: "استشارات دعم للبالغين",
      subtitle: "احصل على استشارات نفسية واجتماعية بسرية تامة وتغلب على تحدياتك اليومية.",
      link: "/register?role=PARENT",
      cta: "احجز استشارتك"
    }
  ];

  useEffect(() => {
    // Show PWA install banner after 3 seconds
    const timer = setTimeout(() => setShowBanner(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto slide every 6 seconds
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, [slides.length]);

  return (
    <div className="welcome-container bg-color-primary min-h-screen relative overflow-hidden text-primary">
      
      {/* App Install Banner */}
      <div className={`app-install-banner ${showBanner ? 'visible' : ''}`}>
        <div className="banner-text">
          <strong>📱 تطبيق أكاديمية ماذا متاح الآن!</strong>
          <p className="text-secondary m-0 text-sm">قم بتثبيت التطبيق على الشاشة الرئيسية لتجربة أسرع وأفضل.</p>
        </div>
        <div className="install-buttons">
          <button className="btn-install" onClick={() => setShowBanner(false)}>تثبيت على الموبايل</button>
          <a href="https://play.google.com/store/apps/details?id=com.maza.app" target="_blank" rel="noopener noreferrer" className="btn-store">
            📥 تحميل التطبيق
          </a>
          <button className="btn-close-styled cursor-pointer" onClick={() => setShowBanner(false)}>✕</button>
        </div>
      </div>

      {/* Full Screen Hero Slider */}
      <div className="slider-container">
        {slides.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`slide ${index === currentSlide ? 'active' : ''} ${slide.bgClass} slide-bg-${index}`}
          >
            <div className="slide-overlay"></div>
            <div className="slide-content">
              <h2 className="slide-title">{slide.title}</h2>
              <p className="slide-subtitle">{slide.subtitle}</p>
              <div className="slide-actions">
                <Link href={slide.link} className="btn-gradient hero-btn">
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Navigation Dots */}
        <div className="slider-nav">
          {slides.map((_, idx) => (
            <button 
              key={idx} 
              className={`slider-dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <section id="categories" className="categories-grid-styled">
        <div className="text-center w-full mb-4 col-span-3">
          <h2 className="section-title-large">من <span className="hero-title-highlight">نخدم؟</span></h2>
        </div>

        <div className="category-card glass overflow-hidden category-card-styled card-border-bottom-purple">
          <img src="https://images.unsplash.com/photo-1594608661623-aa0bd3a07d9d?auto=format&fit=crop&q=80&w=800" alt="ذوي الاحتياجات الخاصة" className="category-img" />
          <h3 className="category-title">ذوي الاحتياجات الخاصة</h3>
          <p className="text-secondary line-height-18">نقدم لهم تقارير تقييم ذكية وجلسات متابعة تخاطب وسلوك مكثفة.</p>
        </div>

        <div className="category-card glass overflow-hidden category-card-styled card-border-bottom-purple">
          <img src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800" alt="الأطفال العاديين" className="category-img" />
          <h3 className="category-title">الأطفال العاديين</h3>
          <p className="text-secondary line-height-18">نركز على تنمية المهارات الإبداعية، التركيز، والتفوق الدراسي.</p>
        </div>

        <div className="category-card glass overflow-hidden category-card-styled card-border-bottom-purple">
          <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800" alt="الكبار والبالغين" className="category-img" />
          <h3 className="category-title">الكبار والبالغين</h3>
          <p className="text-secondary line-height-18">استشارات نفسية ومهنية ومهنية لدعم الاستقرار النفسي والإنتاجية.</p>
        </div>
      </section>

      {/* Why Maza? Section */}
      <section className="features-grid border-top-glass">
        <div className="feature-box glass">
          <div className="feature-icon">🤖</div>
          <h4 className="feature-title text-accent-primary">تقارير ذكاء اصطناعي</h4>
          <p className="text-secondary line-height-18">تقنيات متقدمة لتحليل الاختبارات وتلخيص الجلسات لإصدار تقارير طبية وتربوية فورية تساعدك في متابعة التطور.</p>
        </div>
        <div className="feature-box glass">
          <div className="feature-icon">🎥</div>
          <h4 className="feature-title text-accent-secondary">غرف Telehealth آمنة</h4>
          <p className="text-secondary line-height-18">تواصل مع أفضل الأخصائيين من منزلك عبر غرف افتراضية عالية الدقة والسرية وتدعم جميع الأجهزة الذكية والأجهزة المحمولة.</p>
        </div>
        <div className="feature-box glass">
          <div className="feature-icon">💳</div>
          <h4 className="feature-title text-success">دفع متعدد وسلس</h4>
          <p className="text-secondary line-height-18">مدعوم ببوابات عالمية ليتيح لك الدفع المحلي أو الدولي بناءً على موقعك الجغرافي بكل سهولة وأمان تام.</p>
        </div>
      </section>
    </div>
  );
}
