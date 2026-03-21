"use client";

import Link from "next/link";

export default function Telehealth() {
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
          <Link href="/telehealth" className="nav-item active">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
            غرف الجلسات الافتراضية
          </Link>
          <Link href="/report" className="nav-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            تقارير AI
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ display: 'flex', flexDirection: 'column' }}>
        <header className="topbar">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <span style={{ width: '12px', height: '12px', background: 'var(--success)', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px var(--success)' }}></span>
             غرفة التخاطب الافتراضية - الحالة: ياسين محمد
          </h2>
          <div className="timer glass-panel" style={{ padding: '0.5rem 1rem', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>
            24:15
          </div>
        </header>

        <div style={{ display: 'flex', gap: '1.5rem', flex: 1, marginTop: '1rem' }}>
          {/* Video Area */}
          <div style={{ flex: 3, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-panel" style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: '16px' }}>
              <iframe
                src="https://ahmed-maza-demo.daily.co/test-room"
                allow="camera; microphone; fullscreen; display-capture"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              ></iframe>
            </div>
          </div>

          {/* AI Notes Sidebar */}
          <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
              ملاحظات الجلسة وتغذية AI
            </h3>
            
            <textarea className="glass-panel" style={{ flex: 1, width: '100%', resize: 'none', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: 'none', color: 'var(--text-primary)', outline: 'none', lineHeight: '1.6' }} placeholder="اكتب ملاحظاتك أثناء الجلسة هنا. سيقوم مساعد Maza الذكي (Gemini) بتلخيصها لاحقاً وتضمينها في تقرير الحالة..."></textarea>
            
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
               <button className="btn-gradient" style={{ flex: 1 }}>حفظ الملاحظات للتقرير</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
