'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
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
    <main className="login-wrapper">
      <div className="card glass-panel login-card animate-fade-in content-width">
        <div className="flex-col gap-1 text-center">
          <div className="logo text-2xl font-bold color-accent-primary">ماذا (Maza)</div>
          <h2 className="text-xl">استعادة كلمة المرور</h2>
          <p className="text-sm-secondary">أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.</p>
        </div>

        {message && <div className="p-1 glass-panel text-success text-center mt-1">{message}</div>}
        {error && <div className="p-1 glass-panel text-error text-center mt-1">{error}</div>}

        <form onSubmit={handleSubmit} className="flex-col gap-1.5 mt-2">
          <div className="flex-col gap-0.5">
            <label className="text-sm-secondary">البريد الإلكتروني</label>
            <input 
              required
              type="email" 
              className="input-field glass-panel w-full" 
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full py-1 text-lg mt-1"
          >
            {isLoading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
          </button>
        </form>

        <div className="text-center mt-2">
          <Link href="/login" className="text-sm-secondary hover:text-primary underline">
            العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
      <style jsx>{`
        .content-width {
          max-width: 450px;
          margin: 0 auto;
        }
      `}</style>
    </main>
  );
}
