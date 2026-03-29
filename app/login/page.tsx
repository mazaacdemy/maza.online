"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function Login() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // 1. Aggressive auto-redirect if already logged in
  useEffect(() => {
    if (status === "authenticated" && session) {
      console.log("Login: Authenticated state detected. Forcing redirect...");
      const role = (session.user as any)?.role?.toUpperCase();
      
      // If role is present, use it. Otherwise, default to admin for diagnostic purposes
      let targetPath = "/dashboard/admin";
      if (role === "SPECIALIST") targetPath = "/dashboard/specialist";
      else if (role === "PARENT") targetPath = "/dashboard/parent";
      
      console.log("Login: Auto-redirecting to:", targetPath);
      window.location.href = targetPath;
    }
  }, [status, session]);

  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const urlMessage = searchParams?.get('verified') ? 'تم تأكيد حسابك بنجاح! يمكنك الآن تسجيل الدخول.' : searchParams?.get('registered') ? 'تم التسجيل بنجاح! راجع بريدك الإلكتروني لتأكيد الحساب.' : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log("Login: signIn result", result);

    if (result?.error) {
      setLoading(false);
      setError(result.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      return;
    }
    
    try {
      // Explicit manual redirect is faster than waiting for useSession reactive pulse
      console.log("Login: Fetching fresh session...");
      const sessRes = await fetch("/api/auth/session");
      if (!sessRes.ok) throw new Error("فشل في استرداد بيانات الجلسة");
      
      const json = await sessRes.json();
      console.log("Login: Session JSON:", json);
      
      const role = (json?.user as any)?.role?.toUpperCase();
      console.log("Login: Detected role:", role);
      
      if (!role) {
        console.warn("Login: Role not found in session immediately. Waiting...");
        // Special case: sometimes session takes a moment to propagate
        toast.success("تم التحقق، جاري تحضير لوحة التحكم...");
        setTimeout(() => {
          window.location.href = "/dashboard/admin";
        }, 1500);
        return;
      }

      if (role === "ADMIN" || role === "SUPER_ADMIN") {
        console.log("Login: Redirecting to Admin Dashboard");
        window.location.href = "/dashboard/admin";
      } else if (role === "SPECIALIST") {
        console.log("Login: Redirecting to Specialist Dashboard");
        window.location.href = "/dashboard/specialist";
      } else {
        console.log("Login: Redirecting to Parent Dashboard");
        window.location.href = "/dashboard/parent";
      }
    } catch (err: any) {
      console.error("Login: Redirect error:", err);
      toast.error("حدث خطأ أثناء التوجه للوحة التحكم. يرجى إعادة المحاولة.");
      setLoading(false);
    }
    
    // Final failsafe cleanup
    setTimeout(() => setLoading(false), 5000);
  };

  return (
    <div className="login-wrapper">
      <div className="card glass-panel login-card">
        <div className="logo text-center mb-2 flex-center justify-center">
          <div className="logo-icon">M</div>
          <h2>ماذا <span>(Maza)</span></h2>
        </div>

        <h3 className="text-center mb-1-5 text-primary">تسجيل الدخول للمنصة</h3>

        {error && <div className="alert-error text-center mb-1">{error}</div>}
        {urlMessage && !error && <div className="alert-success text-center mb-1">{urlMessage}</div>}

        <form onSubmit={handleSubmit} className="flex-col gap-1-5">
          <div className="input-group">
            <label htmlFor="emailInput" className="form-label mb-05">البريد الإلكتروني</label>
            <input
              id="emailInput"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              className="glass-panel w-full p-0-8 bg-input-glass outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="passwordInput" className="form-label mb-05">كلمة المرور</label>
            <div className="password-wrapper">
              <input
                id="passwordInput"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="أدخل كلمة المرور"
                required
                className="glass-panel w-full p-0-8 bg-input-glass outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="text-left mb-1">
            <Link href="/forgot-password" className="text-sm text-secondary hover:text-primary underline">
              نسيت كلمة المرور؟
            </Link>
          </div>

          <button
            type="submit"
            className={`btn-gradient mt-1-5 p-0-8 text-lg ${loading ? 'btn-loading' : ''}`}
            disabled={loading}
          >
            {loading ? "جارٍ التحقق..." : "تسجيل الدخول"}
          </button>
        </form>

        {status === "authenticated" && (
          <div className="text-center mt-2">
            <p className="mb-1 text-success">أنت مسجل الدخول بالفعل</p>
            <button 
              onClick={() => {
                const role = (session?.user as any)?.role?.toUpperCase();
                let target = "/dashboard/admin";
                if (role === "SPECIALIST") target = "/dashboard/specialist";
                else if (role === "PARENT") target = "/dashboard/parent";
                window.location.href = target;
              }}
              className="btn-primary w-full p-0-8"
            >
              توجه إلى لوحة التحكم الآن
            </button>
          </div>
        )}

        <div className="text-center mt-2 text-sm text-secondary">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="link-accent-bold">
            سجل الآن
          </Link>
        </div>
      </div>
    </div>
  );
}
