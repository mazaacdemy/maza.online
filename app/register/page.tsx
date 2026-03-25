"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("PARENT");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // Handle role from query params
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryRole = params.get("role");
      if (queryRole && ["PARENT", "SPECIALIST", "CENTER"].includes(queryRole)) {
        setRole(queryRole);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError("يرجى تعبئة جميع الحقول المطلوبة.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمات المرور غير متطابقة.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      
      if (data.success) {
        router.push("/login?registered=true");
      } else {
        setError(data.error || "فشل التسجيل. يرجى المحاولة مرة أخرى.");
      }
    } catch (err: any) {
      setError("تعذر الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ visible }: { visible: boolean }) => (
    visible ? (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    )
  );

  return (
    <div className="login-wrapper">
      <div className="card glass-panel login-card card-auth-logic">
        <div className="logo flex-center mb-2 justify-center">
          <div className="logo-icon">M</div>
          <h2>
            ماذا <span>(Maza)</span>
          </h2>
        </div>

        <h3 className="text-center mb-1-5 text-primary">إنشاء حساب جديد</h3>

        {error && (
          <div className="alert-error-auth">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-col gap-1-2">
          <div>
            <label htmlFor="nameInput" className="form-label mb-05">الاسم الكامل</label>
            <input
              id="nameInput"
              type="text"
              required
              className="glass-panel input-auth-form bg-input-glass outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسمك الكامل"
            />
          </div>

          <div>
            <label htmlFor="emailInput" className="form-label mb-05">البريد الإلكتروني</label>
            <input
              id="emailInput"
              type="email"
              required
              className="glass-panel input-auth-form bg-input-glass outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
            />
          </div>

          <div>
            <label htmlFor="roleSelect" className="form-label mb-05">نوع الحساب</label>
            <select
              id="roleSelect"
              className="glass-panel select-auth-form"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              title="اختر نوع الحساب"
            >
              <option value="PARENT">ولي أمر</option>
              <option value="SPECIALIST">أخصائي</option>
              <option value="CENTER">مركز مستقل</option>
            </select>
          </div>

          <div>
            <label htmlFor="passwordInput" className="form-label mb-05">كلمة المرور</label>
            <div className="password-wrapper">
              <input
                id="passwordInput"
                type={showPassword ? "text" : "password"}
                required
                className="glass-panel input-auth-form input-auth-pass bg-input-glass outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                <EyeIcon visible={showPassword} />
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPasswordInput" className="form-label mb-05">تأكيد كلمة المرور</label>
            <div className="password-wrapper">
              <input
                id="confirmPasswordInput"
                type={showConfirmPassword ? "text" : "password"}
                required
                className="glass-panel input-auth-form input-auth-pass bg-input-glass outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                title={showConfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                <EyeIcon visible={showConfirmPassword} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`btn-gradient mt-2 btn-auth-submit ${loading ? 'btn-loading' : ''}`}
            disabled={loading}
          >
            {loading ? "جارٍ الإنشاء..." : "إنشاء الحساب"}
          </button>
        </form>

        <div className="text-center mt-2 text-sm text-secondary">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="link-accent-bold">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
