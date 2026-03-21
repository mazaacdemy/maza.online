"use client";

import Link from "next/link";

export default function Booking() {
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
          <Link href="/booking" className="nav-item active">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            جدولة المواعيد
          </Link>
          <Link href="/telehealth" className="nav-item">
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
      <main className="main-content">
        <header className="topbar">
          <div className="search-bar glass-panel">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input type="text" placeholder="البحث في المواعيد..." />
          </div>
          <div className="user-profile">
            <button className="icon-btn glass-panel notification-btn">
              <span className="badge">1</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
            </button>
            <div className="profile-info glass-panel">
              <img src="https://i.pravatar.cc/100?img=11" alt="Profile" className="avatar" />
              <div className="text">
                <span className="name">د. مصطفى كمال</span>
              </div>
            </div>
          </div>
        </header>

        <div className="card glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>إدارة المواعيد والتقويم (Booking Calendar)</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-outline">اليوم</button>
              <button className="btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                مساحة جديدة المتاحة
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem', textAlign: 'center' }}>
            {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(day => (
              <div key={day} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', fontWeight: 'bold' }}>
                {day}
              </div>
            ))}
            
            {/* Calendar Grid Mockup */}
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} style={{ padding: '2rem 0', background: i === 15 ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.02)', border: i === 15 ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border)', borderRadius: '12px', minHeight: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem', color: i === 15 ? 'var(--accent-primary)' : 'var(--text-primary)', fontWeight: i === 15 ? 'bold' : 'normal' }}>{i + 1}</span>
                {i === 15 && (
                  <div style={{ fontSize: '0.7rem', padding: '0.3rem', background: 'var(--accent-secondary)', borderRadius: '4px', width: '80%' }}>
                    3 جلسات اليوم
                  </div>
                )}
                {i === 20 && (
                  <div style={{ fontSize: '0.7rem', padding: '0.3rem', background: 'var(--success)', borderRadius: '4px', width: '80%' }}>
                    1 تقييم AI
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
