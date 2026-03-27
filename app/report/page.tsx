"use client";

import Link from "next/link";
import './report.css';

export default function CaseReport() {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
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
            التقارير
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
        <div className="card glass-panel rp-card">
          <div className="rp-card-header">
            <div className="rp-card-header-text">
              <h1 className="text-gradient">تقرير التقييم الشامل</h1>
              <p>تاريخ التقييم: 20 مارس 2026 | أداة التقييم: مقياس جيليام 3</p>
            </div>
            <div className="rp-card-actions">
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

          <div className="rp-body">
            {/* Patient Info Sidebar */}
            <div className="glass-panel rp-patient-info">
              <h3>بيانات الحالة</h3>
              <div className="rp-field">
                <span className="rp-field-label">الاسم:</span>
                <p className="rp-field-value">ياسين محمد عبدالله</p>
              </div>
              <div className="rp-field">
                <span className="rp-field-label">العمر والتاريخ:</span>
                <p className="rp-field-value">5 سنوات و 3 أشهر</p>
              </div>
              <div className="rp-field">
                <span className="rp-field-label">التشخيص المبدئي:</span>
                <p className="rp-field-value"><span className="tag tag-behavior">طيف توحد (مستوى 1)</span></p>
              </div>
              <div className="rp-reliability">
                <h4>نسبة الاعتمادية</h4>
                <div className="rp-progress-bar">
                  <div className="rp-progress-fill"></div>
                </div>
                <p className="rp-progress-label">65% يحتاج دعم في التواصل</p>
              </div>
            </div>

            {/* Report Blocks */}
            <div className="rp-blocks">
              <div className="glass-panel rp-block">
                <h3 className="rp-block-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                  ملخص التقييم التخصصي
                </h3>
                <p className="rp-block-text">
                  يُظهر &quot;ياسين&quot; تحسناً ملحوظاً في التواصل البصري مقارنة بالتقييم السابق لتاريخ يناير 2026.
                  ورغم ذلك، تظل الاستجابة للأوامر المركبة (خطوتين فأكثر) تُمثل تحدياً يتطلب تدخلاً مكثفاً.
                  الطفل يستخدم الكلمات المفردة بنسبة 70% للتعبير عن احتياجاته، وافتقر لاستخدام الجملة المكونة من كلمتين في المواقف غير النمطية.
                </p>
              </div>

              <div className="glass-panel rp-block rp-block-success">
                <h3>نقاط القوة</h3>
                <ul className="rp-block-list">
                  <li>القدرة على التعرف على الألوان الأساسية ومطابقتها.</li>
                  <li>تنفيذ الأوامر البسيطة (المكونة من خطوة واحدة) بنجاح 80%.</li>
                  <li>استخدام التأشير (Pointing) للتعبير عن الرغبات بصورة واضحة.</li>
                </ul>
              </div>

              <div className="glass-panel rp-block rp-block-warning">
                <h3>نقاط الاحتياج (الضعف)</h3>
                <ul className="rp-block-list">
                  <li>صعوبة في توظيف الانتباه المشترك لفترات تزيد عن دقيقة واحدة.</li>
                  <li>ظهور بعض السلوكيات التكرارية (الرفرفة) عند الإثارة المفرطة.</li>
                  <li>تأخر في تكوين جملة من 3 كلمات للتعبير التلقائي.</li>
                </ul>
              </div>

              <div className="glass-panel rp-block rp-block-plan">
                <h3>الخطة العلاجية المقترحة (IEP Draft)</h3>
                <div className="rp-goal">
                  <h4>الهدف طويل المدى 1:</h4>
                  <p>أن يستخدم ياسين جملة مكونة من كلمتين لطلب الأشياء أو التعبير الرفض باستقلالية بنسبة 80% خلال 3 أشهر.</p>
                </div>
                <div className="rp-means">
                  <h4>الوسائل والأنشطة:</h4>
                  <ul className="rp-means-list">
                    <li>اللعب التخيلي الموجه (أدوات المطبخ، السيارات) لتحفيز النطق الموقفي.</li>
                    <li>تأخير الاستجابة لطلبات الطفل بالإشارة لإجباره على المحاولة اللفظية (طريقة PECS).</li>
                  </ul>
                </div>
                <button className="btn-gradient mt-4">اعتماد الخطة العلاجية وإرسالها لولي الأمر</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
