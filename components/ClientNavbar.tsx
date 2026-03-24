'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function ClientNavbar({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav className="glass-panel sticky-navbar flex-between">
      <div className="flex-center-gap-1">
        <div className="logo-icon nav-logo-icon">M</div>
        <Link href="/" className="nav-logo-text">أكاديمية ماذا</Link>
      </div>
      
      <button className="hamburger-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
        <span className={isOpen ? 'open' : ''}></span>
        <span className={isOpen ? 'open' : ''}></span>
        <span className={isOpen ? 'open' : ''}></span>
      </button>

      <div className={`nav-links ${isOpen ? 'mobile-open' : ''}`}>
        <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>الرئيسية</Link>
        <Link href="/about" className={`nav-link ${pathname === '/about' ? 'active' : ''}`}>من نحن</Link>
        <Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}>تواصل معنا</Link>
        <Link href="/guidance" className={`nav-link ${pathname === '/guidance' ? 'active' : ''}`}>إرشادات أسرية</Link>
        <Link href="/policies" className={`nav-link ${pathname === '/policies' ? 'active' : ''}`}>الشروط والسياسات</Link>
        <Link href="/privacy" className={`nav-link ${pathname === '/privacy' ? 'active' : ''}`}>سياسة الخصوصية</Link>
        
        {user ? (
          <Link 
             href={
               user.role === 'ADMIN' ? '/dashboard/admin' : 
               user.role === 'SPECIALIST' ? '/dashboard/specialist' : 
               user.role === 'CENTER' ? '/dashboard/center' : 
               '/dashboard/parent'
             } 
             className="btn-outline btn-sys-padding"
          >
            لوحة التحكم
          </Link>
        ) : (
          <Link href="/login" className="btn-primary btn-sys-padding-lg">
            تسجيل الدخول
          </Link>
        )}
      </div>
    </nav>
  );
}
