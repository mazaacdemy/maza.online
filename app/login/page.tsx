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

    if (role === "ADMIN") {
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
            <input
              id="passwordInput"
              name="password"
              type="password"
              placeholder="أدخل كلمة المرور"
              required
              className="glass-panel w-full p-0-8 bg-input-glass outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
