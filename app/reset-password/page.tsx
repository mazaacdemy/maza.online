'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function RedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const token = searchParams.get('token');
    router.replace(`/auth/reset-password?token=${token}`);
  }, [router, searchParams]);

  return (
    <div className="flex-center min-h-screen text-secondary">
      جاري تحويلك... (Redirecting...)
    </div>
  );
}

export default function ResetRedirect() {
  return (
    <Suspense fallback={<div>جاري التحميل...</div>}>
      <RedirectContent />
    </Suspense>
  );
}
