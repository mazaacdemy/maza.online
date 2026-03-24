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
    <div className="cars-question-box">
      <label className="form-label font-bold mb-1">{questionLabel}</label>
      <div className="flex-item-details">
        <label className="radio-label">
          <input type="radio" value="1" checked={(answers as any)[qKey] === "1"} onChange={() => setAnswers({...answers, [qKey]: "1"})} /> طبيعي ومناسب للعمر
        </label>
        <label className="radio-label">
          <input type="radio" value="2" checked={(answers as any)[qKey] === "2"} onChange={() => setAnswers({...answers, [qKey]: "2"})} /> تأثر بسيط
        </label>
        <label className="radio-label">
          <input type="radio" value="3" checked={(answers as any)[qKey] === "3"} onChange={() => setAnswers({...answers, [qKey]: "3"})} /> تأثر متوسط
        </label>
        <label className="radio-label">
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
      <main className="main-content flex-center-h">
        <div className="card glass-panel cars-card">
          
          <h2 className="cars-title">مقياس تقدير التوحد الطفولي (CARS)</h2>
          <p className="cars-instruction">
            أجب على البنود التالية وسيتم إرسالها فوراً لمحرك الذكاء الاصطناعي Maza AI لتدقيقها ودمجها للوصول لخطة تدخل فردية (IEP).
          </p>

          <form onSubmit={handleSubmit} className="flex-col">
            <div className="mb-2">
              <label className="form-label font-bold">اختر المريض:</label>
              <select 
                title="اختر المريض"
                aria-label="اختر المريض"
                className="glass-panel cars-select" 
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
              className={`btn-gradient submit-btn mt-2 ${loading ? 'opacity-loading' : 'cursor-pointer'}`}
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
