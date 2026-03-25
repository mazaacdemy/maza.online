"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
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

    setLoading(false);

    if (!result || result.error) {
      setError(result?.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      return;
    }

    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    const role = (session?.user as any)?.role;

    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      router.push("/dashboard/admin");
    } else if (role === "SPECIALIST") {
      router.push("/dashboard/specialist");
    } else {
      router.push("/dashboard/parent");
    }
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
