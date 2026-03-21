"use client";

import Link from "next/link";

export default function CaseReport() {
  return (
    <div className="dashboard-container">
      {/* Sidebar - Same as Dashboard */}
      <aside className="sidebar glass-panel">
        <div className="logo">
          <div className="logo-icon">M</div>
          <h2>ماذا <span>(Maza)</span></h2>
        </div>
        <nav className="side-nav">
          <Link href="/" className="nav-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            الرئيسية
          </Link>
          <Link href="/booking" className="nav-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            جدولة المواعيد
          </Link>
          <Link href="/telehealth" className="nav-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
            غرف الجلسات الافتراضية
          </Link>
          <Link href="/report" className="nav-item active">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            تقارير AI
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div className="search-bar glass-panel">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input type="text" placeholder="ابحث داخل التقرير..." />
          </div>
          <div className="user-profile">
            <div className="profile-info glass-panel">
              <img src="https://i.pravatar.cc/100?img=11" alt="Profile" className="avatar" />
              <div className="text">
                <span className="name">د. مصطفى كمال</span>
              </div>
            </div>
          </div>
        </header>

        {/* Report Container */}
        <div className="card glass-panel" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
            <div>
              <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>تقرير التقييم الشامل (مولد بالذكاء الاصطناعي)</h1>
              <p style={{ color: 'var(--text-secondary)' }}>تاريخ التقييم: 20 مارس 2026 | أداة التقييم: مقياس جيليام 3</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-outline">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                تعديل يدوي
              </button>
              <button className="btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                تصدير PDF
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            {/* Patient Info Sidebar */}
            <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-secondary)' }}>بيانات الحالة</h3>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>الاسم:</span>
                <p style={{ fontWeight: 'bold' }}>ياسين محمد عبدالله</p>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>العمر والتاريخ:</span>
                <p style={{ fontWeight: 'bold' }}>5 سنوات و 3 أشهر</p>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>التشخيص المبدئي:</span>
                <p style={{ fontWeight: 'bold' }}><span className="tag tag-behavior">طيف توحد (مستوى 1)</span></p>
              </div>
              <div style={{ marginTop: '2rem' }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>نسبة الاعتمادية</h4>
                <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px' }}>
                  <div style={{ width: '65%', backgroundColor: 'var(--accent-primary)', height: '100%', borderRadius: '4px' }}></div>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>65% يحتاج دعم في التواصل</p>
              </div>
            </div>

            {/* AI Generated Report Blocks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                  ملخص الذكاء الاصطناعي (Gemini Analysis)
                </h3>
                <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                  يُظهر "ياسين" تحسناً ملحوظاً في التواصل البصري مقارنة بالتقييم السابق لتاريخ يناير 2026. 
                  ورغم ذلك، تظل الاستجابة للأوامر المركبة (خطوتين فأكثر) تُمثل تحدياً يتطلب تدخلاً مكثفاً. 
                  الطفل يستخدم الكلمات المفردة بنسبة 70% للتعبير عن احتياجاته، وافتقر لاستخدام الجملة المكونة من كلمتين في المواقف غير النمطية.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--success)' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--success)' }}>نقاط القوة</h3>
                <ul style={{ listStylePosition: 'inside', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  <li>القدرة على التعرف على الألوان الأساسية ومطابقتها.</li>
                  <li>تنفيذ الأوامر البسيطة (المكونة من خطوة واحدة) بنجاح 80%.</li>
                  <li>استخدام التأشير (Pointing) للتعبير عن الرغبات بصورة واضحة.</li>
                </ul>
              </div>

              <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--warning)' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--warning)' }}>نقاط الاحتياج (الضعف)</h3>
                <ul style={{ listStylePosition: 'inside', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  <li>صعوبة في توظيف الانتباه المشترك لفترات تزيد عن دقيقة واحدة.</li>
                  <li>ظهور بعض السلوكيات التكرارية (الرفرفة) عند الإثارة المفرطة.</li>
                  <li>تأخر في تكوين جملة من 3 كلمات للتعبير التلقائي.</li>
                </ul>
              </div>

              <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), transparent)' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>الخطة العلاجية المقترحة (IEP Draft)</h3>
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>الهدف طويل المدى 1:</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>أن يستخدم ياسين جملة مكونة من كلمتين لطلب الأشياء أو التعبير الرفض باستقلالية بنسبة 80% خلال 3 أشهر.</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>الوسائل والأنشطة:</h4>
                  <ul style={{ listStylePosition: 'inside', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                     <li>اللعب التخيلي الموجه (أدوات المطبخ، السيارات) لتحفيز النطق الموقفي.</li>
                     <li>تأخير الاستجابة لطلبات الطفل بالإشارة لإجباره على المحاولة اللفظية (طريقة PECS).</li>
                  </ul>
                </div>
                <button className="btn-gradient mt-4" style={{ marginTop: '1.5rem' }}>اعتماد الخطة العلاجية وإرسالها لولي الأمر</button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
