"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Booking() {
  const [specialists, setSpecialists] = useState<any[]>([]);
  const [specialistId, setSpecialistId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("Telehealth");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/specialists")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSpecialists(data.specialists);
          if (data.specialists.length > 0) {
            setSpecialistId(data.specialists[0].id);
          }
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!specialistId || !date || !time || !type) {
      setError("Please fill all fields.");
      setLoading(false);
      return;
    }

    const combinedDate = new Date(`${date}T${time}`);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specialistId, date: combinedDate.toISOString(), type }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess("تم حجز الموعد بنجاح!");
        setTimeout(() => router.push("/dashboard/parent"), 2000);
      } else {
        setError(data.error || "فشل حجز الموعد.");
      }
    } catch (err) {
      setError("خطأ في الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar glass-panel">
        <div className="logo">
          <div className="logo-icon">M</div>
          <h2>ماذا <span>(Maza)</span></h2>
        </div>
        <nav className="side-nav">
          <Link href="/dashboard/parent" className="nav-item">الرئيسية</Link>
          <Link href="/booking" className="nav-item active">جدولة المواعيد</Link>
          <Link href="/telehealth" className="nav-item">غرف الجلسات الافتراضية</Link>
          <Link href="/report" className="nav-item">تقارير AI</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="card glass-panel" style={{ maxWidth: '600px', width: '100%', padding: '2.5rem' }}>
          <h2 style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--accent-primary)' }}>حجز جلسة جديدة</h2>

          {error && <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#f87171", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>{error}</div>}
          {success && <div style={{ background: "rgba(74, 222, 128, 0.1)", color: "#4ade80", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>{success}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>اختر الأخصائي</label>
              <select
                className="glass-panel"
                style={{ width: '100%', padding: '0.8rem', background: 'rgba(15, 23, 42, 0.9)', color: 'white', border: '1px solid var(--glass-border)', outline: 'none' }}
                value={specialistId}
                onChange={(e) => setSpecialistId(e.target.value)}
                required
              >
                {specialists.map(spec => (
                  <option key={spec.id} value={spec.id}>د. {spec.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>نوع الجلسة</label>
              <select
                className="glass-panel"
                style={{ width: '100%', padding: '0.8rem', background: 'rgba(15, 23, 42, 0.9)', color: 'white', border: '1px solid var(--glass-border)', outline: 'none' }}
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="Telehealth">جلسة عن بُعد (Telehealth)</option>
                <option value="In-person">جلسة بالمركز (In-person)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>التاريخ</label>
                <input
                  type="date"
                  className="glass-panel"
                  style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)', outline: 'none' }}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>الوقت</label>
                <input
                  type="time"
                  className="glass-panel"
                  style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)', outline: 'none' }}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-gradient"
              style={{ marginTop: '1rem', padding: '1rem', fontSize: '1.1rem', opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
              disabled={loading}
            >
              {loading ? "جارٍ الحجز..." : "تأكيد الحجز"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
