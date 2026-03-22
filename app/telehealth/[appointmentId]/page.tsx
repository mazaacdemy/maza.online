"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TelehealthRoom({ params }: { params: { appointmentId: string } }) {
  const [hasJoined, setHasJoined] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  // Simulated effect
  useEffect(() => {
    if (hasJoined) {
      // Here usually you initialize WebRTC / Agora / Zoom Client
      console.log("Initialized Video Call SDK for room: ", params.appointmentId);
    }
  }, [hasJoined, params.appointmentId]);

  if (!hasJoined) {
    return (
      <div className="join-screen">
        <div className="bg-blur"></div>
        <div className="glass-panel text-center" style={{ maxWidth: '500px', width: '100%', padding: '3rem' }}>
          <h2 style={{ marginBottom: '1rem', color: '#818cf8' }}>جلسة تخاطب أونلاين</h2>
          <p style={{ color: '#cbd5e1', marginBottom: '2rem' }}>
            أنت على وشك الانضمام إلى غرفة الجلسة. تأكد من أن الكاميرا والميكروفون يعملان بشكل جيد.
          </p>
          <div className="preview-box">المنظور الأمامي (تجريبي)</div>
          
          <div className="controls" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', margin: '2rem 0' }}>
            <button className={`control-btn ${!micOn ? 'off' : ''}`} onClick={() => setMicOn(!micOn)}>
              {micOn ? '🎤 ميكروفون مفعل' : '🔇 ميكروفون معطل'}
            </button>
            <button className={`control-btn ${!camOn ? 'off' : ''}`} onClick={() => setCamOn(!camOn)}>
              {camOn ? '📹 كاميرا مفعلة' : '🚫 كاميرا معطلة'}
            </button>
          </div>
          
          <button className="btn-gradient" style={{ width: '100%', padding: '1rem', fontSize: '1.2rem' }} onClick={() => setHasJoined(true)}>
            انضمام للجلسة
          </button>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          .join-screen { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #0f172a; direction: rtl; }
          .glass-panel { background: rgba(30, 41, 59, 0.6); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; z-index: 10; }
          .preview-box { background: rgba(0,0,0,0.5); width: 100%; height: 250px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #64748b; border: 1px dashed rgba(255,255,255,0.2); }
          .control-btn { background: rgba(99, 102, 241, 0.1); color: #818cf8; border: 1px solid #6366f1; padding: 0.8rem 1.5rem; border-radius: 50px; cursor: pointer; transition: 0.3s; }
          .control-btn.off { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-color: #ef4444; }
          .btn-gradient { background: linear-gradient(135deg, #6366f1, #a855f7); color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; }
          .bg-blur { position: fixed; width: 60vw; height: 60vw; background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 60%); z-index: 0; }
        `}} />
      </div>
    );
  }

  return (
    <div className="room-container">
      <header className="room-header">
        <div className="room-info">
          <h2>جلسة تخاطب وتنمية مهارات</h2>
          <span className="live-badge">مباشر • 00:00</span>
        </div>
      </header>
      
      <main className="video-grid">
        <div className="main-video glass">
          <div className="video-placeholder">كاميرا الأخصائي/الطفل</div>
          <div className="name-tag">الأخصائي: أحمد</div>
        </div>
        
        <div className="self-video glass">
          <div className="video-placeholder">كاميرتك</div>
          <div className="name-tag">أنت</div>
        </div>
      </main>
      
      <footer className="room-footer glass">
        <div className="controls">
          <button className={`round-btn ${!micOn ? 'danger' : ''}`} onClick={() => setMicOn(!micOn)}>🎤</button>
          <button className={`round-btn ${!camOn ? 'danger' : ''}`} onClick={() => setCamOn(!camOn)}>📹</button>
          <button className="round-btn">💬</button>
          <button className="round-btn">📤</button>
          <Link href="/dashboard/parent" className="round-btn end-call">☎️ إنهاء</Link>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .room-container { display: flex; flex-direction: column; height: 100vh; background: #0f172a; direction: rtl; color: white; overflow: hidden; }
        .glass { background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); }
        .room-header { padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .live-badge { background: rgba(239, 68, 68, 0.2); color: #f87171; padding: 0.3rem 0.8rem; border-radius: 50px; font-size: 0.85rem; border: 1px solid rgba(239,68,68,0.3); }
        .video-grid { flex: 1; padding: 2rem; display: grid; grid-template-columns: 3fr 1fr; gap: 2rem; position: relative; }
        .main-video { border-radius: 20px; position: relative; overflow: hidden; display: flex; }
        .self-video { border-radius: 20px; position: absolute; bottom: 3rem; right: 3rem; width: 250px; height: 180px; display: flex; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .video-placeholder { flex: 1; display: flex; align-items: center; justify-content: center; background: #000; color: #64748b; }
        .name-tag { position: absolute; bottom: 1rem; left: 1rem; background: rgba(0,0,0,0.6); padding: 0.4rem 1rem; border-radius: 8px; font-size: 0.9rem; }
        .room-footer { padding: 1.5rem; display: flex; justify-content: center; }
        .controls { display: flex; gap: 1rem; }
        .round-btn { width: 50px; height: 50px; border-radius: 50%; border: none; background: rgba(255,255,255,0.1); color: white; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: 0.3s; }
        .round-btn:hover { background: rgba(255,255,255,0.2); transform: scale(1.05); }
        .round-btn.danger { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239,68,68,0.5); }
        .end-call { background: #ef4444; width: auto; padding: 0 1.5rem; border-radius: 25px; }
        .end-call:hover { background: #dc2626; }
      `}} />
    </div>
  );
}
