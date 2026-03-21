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
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      return;
    }

    // Fetch the session to get the role, then redirect
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
    <div className="dashboard-container" style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        className="card glass-panel"
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "2.5rem",
          background: "rgba(15, 23, 42, 0.8)",
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
          تسجيل الدخول للمنصة
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
            {loading ? "جارٍ التحقق..." : "تسجيل الدخول"}
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
          ليس لديك حساب أخصائي أو ولي أمر؟{" "}
          <Link
            href="/register"
            style={{
              color: "var(--accent-primary)",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            سجل هنا
          </Link>
        </div>
      </div>
    </div>
  );
}
