"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PARENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!name || !email || !password) {
      setError("يرجى تعبئة جميع الحقول المطلوبة.");
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

  return (
    <div className="dashboard-container" style={{ justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div
        className="card glass-panel"
        style={{
          maxWidth: "450px",
          width: "100%",
          padding: "2.5rem",
          background: "rgba(15, 23, 42, 0.8)",
          margin: "2rem",
        }}
      >
        <div className="logo" style={{ justifyContent: "center", marginBottom: "2rem" }}>
          <div className="logo-icon">M</div>
          <h2>
            ماذا <span>(Maza)</span>
          </h2>
        </div>

        <h3
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            color: "var(--text-primary)",
          }}
        >
          إنشاء حساب جديد
        </h3>

        {error && (
          <div
            style={{
               background: "rgba(239, 68, 68, 0.1)",
               border: "1px solid rgba(239, 68, 68, 0.3)",
               color: "#f87171",
               padding: "0.8rem 1rem",
               borderRadius: "10px",
               marginBottom: "1.2rem",
               fontSize: "0.9rem",
               textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "var(--text-secondary)",
              }}
            >
              الاسم الكامل
            </label>
            <input
              type="text"
              required
              className="glass-panel"
              style={{
                width: "100%",
                padding: "0.8rem",
                border: "1px solid var(--glass-border)",
                color: "var(--text-primary)",
                outline: "none",
                background: "rgba(255,255,255,0.05)",
              }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسمك الكامل"
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "var(--text-secondary)",
              }}
            >
              البريد الإلكتروني
            </label>
            <input
              type="email"
              required
              className="glass-panel"
              style={{
                width: "100%",
                padding: "0.8rem",
                border: "1px solid var(--glass-border)",
                color: "var(--text-primary)",
                outline: "none",
                background: "rgba(255,255,255,0.05)",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "var(--text-secondary)",
              }}
            >
              نوع الحساب
            </label>
            <select
              className="glass-panel"
              style={{
                width: "100%",
                padding: "0.8rem",
                border: "1px solid var(--glass-border)",
                color: "var(--text-primary)",
                outline: "none",
                background: "rgba(15, 23, 42, 0.9)", // slightly darker solid bg for select options visibility
                appearance: "none",
                cursor: "pointer",
              }}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="PARENT">ولي أمر</option>
              <option value="SPECIALIST">أخصائي</option>
              <option value="CENTER">مركز مستقل</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "var(--text-secondary)",
              }}
            >
              كلمة المرور
            </label>
            <input
              type="password"
              required
              className="glass-panel"
              style={{
                width: "100%",
                padding: "0.8rem",
                border: "1px solid var(--glass-border)",
                color: "var(--text-primary)",
                outline: "none",
                background: "rgba(255,255,255,0.08)",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn-gradient mt-4"
            disabled={loading}
            style={{
              padding: "0.8rem",
              fontSize: "1.1rem",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "جارٍ الإنشاء..." : "إنشاء الحساب"}
          </button>
        </form>

        <div
          style={{
            marginTop: "2rem",
            textAlign: "center",
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
          }}
        >
          لديك حساب بالفعل؟{" "}
          <Link
            href="/login"
            style={{
              color: "var(--accent-primary)",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
