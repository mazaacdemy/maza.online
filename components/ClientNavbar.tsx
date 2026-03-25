'use client';

import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function ClientNavbar({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
    setShowProfileMenu(false);
  }, [pathname]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') return '/dashboard/admin';
    if (user.role === 'SPECIALIST') return '/dashboard/specialist';
    if (user.role === 'CENTER') return '/dashboard/center';
    return '/dashboard/parent';
  };

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
          <div className="profile-dropdown-container" ref={dropdownRef}>
            <button 
              className="nav-profile-link-btn" 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="user-avatar-small overflow-hidden flex-center">
                {(user as any).profileImage ? (
                  <img src={(user as any).profileImage} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name ? user.name[0].toUpperCase() : 'U'
                )}
              </div>
              <span className="user-name-nav">{user.name || 'المستخدم'}</span>
              <span className="dropdown-arrow">▼</span>
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown-menu glass-panel animate-fade-in">
                <div className="dropdown-header">
                  <p className="dropdown-user-name">{user.name}</p>
                  <p className="dropdown-user-role">{user.role}</p>
                </div>
                <div className="dropdown-divider"></div>
                <Link href={getDashboardLink()} className="dropdown-item">
                  لوحة التحكم
                </Link>
                <Link href="/dashboard/settings" className="dropdown-item">
                  إعدادات الحساب
                </Link>
                <div className="dropdown-divider"></div>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })} 
                  className="dropdown-item text-danger"
                >
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="btn-primary btn-sys-padding-lg">
            تسجيل الدخول
          </Link>
        )}
      </div>
    </nav>
  );
}
