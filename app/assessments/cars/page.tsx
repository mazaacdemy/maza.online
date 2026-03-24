"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CARSAssessment() {
  const [patientId, setPatientId] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Simplified CARS questions for demo
  const [answers, setAnswers] = useState({
    q1: "1", // 1 = Normal, 2 = Mild, 3 = Moderate, 4 = Severe
    q2: "1",
    q3: "1",
    q4: "1",
    q5: "1"
  });

  useEffect(() => {
    fetch("/api/patients-mock")
      .then(res => res.json())
      .catch(() => {
        setPatients([
          { id: "1", name: "ياسين محمد" },
          { id: "2", name: "سجا أحمد" }
        ]);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const questions = [
      "العلاقة مع الناس (الاستجابة الاجتماعية)", 
      "التقليد (الكلام والحركة)", 
      "الاستجابة العاطفية", 
      "استخدام الجسم", 
      "استخدام الأشياء (اللعب)"
    ];

    const notes = Object.values(answers).map((ans, i) => {
      let severity = "طبيعي";
      if (ans === "2") severity = "تأخر وميول غير طبيعية بسيطة";
      if (ans === "3") severity = "تأخر متوسط";
      if (ans === "4") severity = "تأخر شديد ملحوظ";
      return `${questions[i]}: ${severity}`;
    }).join(" | ");

    const selectedPatient = patients.find(p => p.id === patientId) || { name: "ياسين محمد" };

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patientId || null, 
          patientName: selectedPatient.name,
          notes: "تطبيق مقياس CARS للتوحد. الإجابات كالتالي: " + notes
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("تم إنهاء التقييم بنجاح. لقد أنشأ النظام تقرير مع خطة تدخل (IEP) وحفظها بملف المريض السريري.");
        router.push("/dashboard/specialist");
      } else {
        alert("خطأ أثناء استخراج التقرير الذكي");
      }
    } catch {
      alert("خطأ اتصال بخادم الذكاء الاصطناعي");
    } finally {
      setLoading(false);
    }
  };

  const getOptions = (qKey: string, questionLabel: string) => (
    <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
      <label style={{ display: 'block', marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>{questionLabel}</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <input type="radio" value="1" checked={(answers as any)[qKey] === "1"} onChange={() => setAnswers({...answers, [qKey]: "1"})} /> طبيعي ومناسب للعمر
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <input type="radio" value="2" checked={(answers as any)[qKey] === "2"} onChange={() => setAnswers({...answers, [qKey]: "2"})} /> تأثر بسيط
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <input type="radio" value="3" checked={(answers as any)[qKey] === "3"} onChange={() => setAnswers({...answers, [qKey]: "3"})} /> تأثر متوسط
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <input type="radio" value="4" checked={(answers as any)[qKey] === "4"} onChange={() => setAnswers({...answers, [qKey]: "4"})} /> تأثر شديد
        </label>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar glass-panel">
        <div className="logo">
          <div className="logo-icon">M</div>
          <h2>ماذا <span>(Maza)</span></h2>
        </div>
        <nav className="side-nav">
          <Link href="/dashboard/specialist" className="nav-item">الرئيسية</Link>
          <Link href="/dashboard/specialist/assessments" className="nav-item active">التقييمات والمقاييس</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card glass-panel" style={{ maxWidth: '800px', width: '100%', padding: '3rem' }}>
          
          <h2 style={{ marginBottom: '1rem', textAlign: 'center', color: 'var(--accent-primary)', fontSize: '2rem' }}>مقياس تقدير التوحد الطفولي (CARS)</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            أجب على البنود التالية وسيتم إرسالها فوراً لمحرك الذكاء الاصطناعي Maza AI لتدقيقها ودمجها للوصول لخطة تدخل فردية (IEP).
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>اختر المريض:</label>
              <select 
                className="glass-panel" 
                style={{ width: '100%', padding: '1rem', background: 'rgba(15, 23, 42, 0.9)', color: 'white', border: '1px solid var(--glass-border)', outline: 'none', fontSize: '1.1rem' }}
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
              >
                <option value="">-- يرجى الاختيار --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {getOptions("q1", "1. العلاقة التفاعلية مع الأشخاص")}
            {getOptions("q2", "2. التقليد الحركي واللفظي")}
            {getOptions("q3", "3. الاستجابة العاطفية والمشاركة")}
            {getOptions("q4", "4. استخدام الجسم والنمطية")}
            {getOptions("q5", "5. استخدام الأشياء واستكشاف البيئة")}

            <button
              type="submit"
              className="btn-gradient"
              style={{ marginTop: '2rem', padding: '1.2rem', fontSize: '1.2rem', fontWeight: 'bold', width: '100%', opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
              disabled={loading}
            >
              {loading ? "جاري المعالجة المركزية بالـ AI وحفظ التقرير..." : "رفع التقييم لـ Maza AI واعتماد التقرير"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
