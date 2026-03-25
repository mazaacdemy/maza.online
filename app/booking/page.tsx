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
        if (data.url) {
          // Redirect to Stripe checkout
          window.location.href = data.url;
        } else {
          setSuccess(data.message || "تم حجز الموعد بنجاح!");
          setTimeout(() => router.push("/dashboard/parent"), 2000);
        }
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
      <main className="main-content flex-center">
        <div className="card glass-panel form-card">
          <h2 className="form-title">حجز جلسة جديدة</h2>

          {error && <div className="alert-error">{error}</div>}
          {success && <div className="alert-success">{success}</div>}

          <form onSubmit={handleSubmit} className="form-layout">
            <div>
              <label className="form-label">اختر الأخصائي</label>
              <select
                title="اختر الأخصائي"
                aria-label="اختر الأخصائي"
                className="glass-panel form-input-dark"
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
              <label className="form-label">نوع الجلسة</label>
              <select
                title="نوع الجلسة"
                aria-label="نوع الجلسة"
                className="glass-panel form-input-dark"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="Telehealth">جلسة عن بُعد (Telehealth)</option>
                <option value="In-person">جلسة بالمركز (In-person)</option>
              </select>
            </div>

            <div className="flex-row-gap">
              <div className="flex-1">
                <label className="form-label">التاريخ</label>
                <input
                  type="date"
                  title="تاريخ الجلسة"
                  aria-label="تاريخ الجلسة"
                  className="glass-panel form-input-light"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="flex-1">
                <label className="form-label">الوقت</label>
                <input
                  type="time"
                  title="وقت الجلسة"
                  aria-label="وقت الجلسة"
                  className="glass-panel form-input-light"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={`btn-gradient submit-btn ${loading ? "opacity-loading" : "cursor-pointer"}`}
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
