'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PWABanner() {
  const [showBanner, setShowBanner] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    console.log("PWABanner: Component Mounted");
    const handlePrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowBanner(false);
    }
  };

  return (
    <div className="s-pwa-banner-row">
      <div className="s-container h-full s-pwa-flex">
        <div className="s-pwa-left">
          <span className="s-pill-mini">تطبيق الأكاديمية</span>
          <p className="s-pwa-text text-white">يمكنك تثبيت تطبيق ماذا الآن للوصول السريع والآمن</p>
        </div>
        <div className="s-pwa-right">
          <Link 
            href="https://play.google.com/store/apps/details?id=com.maza.academy" 
            target="_blank"
            className="s-btn-google py-2 px-6 bg-slate-800 text-white rounded-lg font-bold text-[0.65rem] hover:bg-slate-700 transition flex items-center gap-2 border border-white/10"
          >
            <span>🤖</span>
            Google Play
          </Link>
          <button 
            onClick={handleInstallClick} 
            className="s-btn-install py-2 px-6 bg-indigo-600 text-white rounded-lg font-bold text-[0.65rem] hover:bg-indigo-500 transition shadow-[0_5px_15px_rgba(99,102,241,0.3)] whitespace-nowrap flex items-center gap-2"
          >
            <span>📥</span>
            {deferredPrompt ? "تثبيت PWA" : "تثبيت سريع"}
          </button>
          <button onClick={() => setShowBanner(false)} className="text-white/40 hover:text-white transition text-xl px-2 shrink-0">✕</button>
        </div>
      </div>

      <style jsx>{`
        .s-pwa-banner-row { 
          height: 60px; 
          background: #0f172a; 
          color: white; 
          border-top: 1px solid rgba(255,255,255,0.1); 
          display: flex;
          align-items: center;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 10000;
          overflow: hidden;
          box-shadow: 0 -10px 40px rgba(0,0,0,0.5);
        }
        .s-container { max-width: 1400px; margin: 0 auto; padding: 0 40px; width: 100%; }
        .s-pwa-flex { display: flex !important; flex-direction: row !important; flex-wrap: nowrap !important; align-items: center !important; justify-content: space-between !important; gap: 20px !important; width: 100% !important; }
        .s-pwa-left { display: flex !important; flex-direction: row !important; flex-wrap: nowrap !important; align-items: center !important; gap: 16px !important; min-width: 0 !important; flex: 1 !important; }
        .s-pwa-right { display: flex !important; flex-direction: row !important; flex-wrap: nowrap !important; align-items: center !important; gap: 16px !important; flex-shrink: 0 !important; }
        .s-pwa-text { font-size: 0.85rem !important; font-weight: 800 !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; margin: 0 !important; opacity: 0.9; }
        .s-pill-mini { background: rgba(99, 102, 241, 0.2); color: #818cf8; padding: 4px 10px; border-radius: 6px; font-size: 0.6rem; font-weight: 950; text-transform: uppercase; }
        @media (max-width: 768px) {
          .s-pwa-text { display: none; }
        }
      `}</style>
    </div>
  );
}
