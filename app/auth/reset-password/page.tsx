'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('رمز استعادة كلمة المرور مفقود.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setError(data.error || 'حدث خطأ ما');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {message && <div className="p-1 glass-panel text-success text-center mt-1">{message}. جارٍ تحويلك لصفحة الدخول...</div>}
      {error && <div className="p-1 glass-panel text-error text-center mt-1">{error}</div>}

      {!message && token && (
        <form onSubmit={handleSubmit} className="flex-col gap-1.5 mt-2">
          <div className="flex-col gap-0.5">
            <label className="text-sm-secondary">كلمة المرور الجديدة</label>
            <input 
              required
              type="password" 
              className="input-field glass-panel w-full" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex-col gap-0.5">
            <label className="text-sm-secondary">تأكيد كلمة المرور</label>
            <input 
              required
              type="password" 
              className="input-field glass-panel w-full" 
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full py-1 text-lg mt-1"
          >
            {isLoading ? 'جاري التغيير...' : 'تحديث كلمة المرور'}
          </button>
        </form>
      )}
    </>
  );
}

export default function ResetPassword() {
  return (
    <main className="login-wrapper">
      <div className="card glass-panel login-card animate-fade-in max-w-450">
        <div className="flex-col gap-1 text-center">
          <div className="logo text-2xl font-bold color-accent-primary">ماذا (Maza)</div>
          <h2 className="text-xl">تعيين كلمة مرور جديدة</h2>
          <p className="text-sm-secondary">أدخل كلمة المرور الجديدة الخاصة بك أدناه.</p>
        </div>

        <Suspense fallback={<div className="text-center mt-2 text-secondary">جاري التحميل...</div>}>
          <ResetPasswordForm />
        </Suspense>

        <div className="text-center mt-2">
          <Link href="/login" className="text-sm-secondary hover:text-primary underline">
            العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
      <style jsx>{`
        .max-w-450 {
          max-width: 450px;
          margin: 0 auto;
        }
      `}</style>
    </main>
  );
}
