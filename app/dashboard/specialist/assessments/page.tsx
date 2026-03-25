"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SpecialistAssessments() {
  const [patients, setPatients] = useState<any[]>([]);
  const [patientId, setPatientId] = useState("");
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // Basic CARS mock questions
  const questions = [
    { id: "q1", text: "1. العلاقة مع الناس" },
    { id: "q2", text: "2. التقليد" },
    { id: "q3", text: "3. الاستجابة العاطفية" },
    { id: "q4", text: "4. استخدام الجسم" },
    { id: "q5", text: "5. استخدام الأشياء" },
  ];

  useEffect(() => {
    // Fetch Patients
    fetch("/api/patients-mock")
      .then(res => res.json())
      .catch(() => {
        setPatients([
          { id: "patient-1", name: "ياسين محمد" },
          { id: "patient-2", name: "ليلى أحمد" },
          { id: "patient-3", name: "يحيى إبراهيم" }
        ]);
      });
  }, []);

  const handleAnswerChange = (questionId: string, val: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: val }));
  };

  const calculateScore = () => {
    return Object.values(answers).reduce((a, b) => a + b, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      setError("يرجى اختيار الحالة (المريض).");
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");

    const totalScore = calculateScore();
    const selectedPatient = patients.find(p => p.id === patientId) || { name: "غير معروف" };
    
    // Construct notes for AI based on CARS score
    const notes = `تم إجراء مقياس كارز (CARS) لتقييم التوحد للطفل ${selectedPatient.name}. النتيجة الإجمالية هي ${totalScore}. يرجى تقديم ملخص للحالة بناءً على هذه النتيجة واقتراح خطة علاجية.`;

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patientId,
          patientName: selectedPatient.name,
          notes: notes
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccess("تم حفظ التقييم بنجاح وإرساله للمساعد الذكي لتحليله!");
        setTimeout(() => router.push("/dashboard/specialist"), 2000);
      } else {
        setError(data.error || "حدث خطأ أثناء حفظ التقييم.");
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
          <Link href="/dashboard/specialist" className="nav-item">الرئيسية</Link>
          <Link href="/telehealth" className="nav-item">غرف الجلسات الافتراضية</Link>
          <Link href="/dashboard/specialist/assessments" className="nav-item active">تقييمات الذكاء الاصطناعي</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content flex-center">
        <div className="card glass-panel form-card w-full max-w-3xl">
          <h2 className="form-title text-primary mb-2">مقياس تقييم التوحد (CARS)</h2>
          <p className="text-secondary mb-2">قم باختيار المريض وتقييم السلوكيات من 1 (طبيعي) إلى 4 (شديد الشذوذ).</p>

          {error && <div className="alert-error mb-2">{error}</div>}
          {success && <div className="alert-success mb-2">{success}</div>}

          <form onSubmit={handleSubmit} className="form-layout">
            <div className="mb-2">
              <label className="form-label">اختر الحالة (المريض)</label>
              <select
                title="اختر المريض"
                aria-label="اختر المريض"
                className="glass-panel form-input-dark w-full p-0-8"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
              >
                <option value="">-- اختر مريض --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="questions-container bg-input-glass p-2 rounded-lg mb-2">
              {questions.map(q => (
                <div key={q.id} className="question-row flex justify-between items-center border-b border-gray-700 py-1">
                  <span className="text-primary">{q.text}</span>
                  <select
                    title="اختر الدرجة"
                    aria-label="اختر الدرجة"
                    className="glass-panel form-input-light w-24"
                    value={answers[q.id] || 1}
                    onChange={(e) => handleAnswerChange(q.id, parseInt(e.target.value))}
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </div>
              ))}
            </div>
            
            <div className="score-summary text-left mb-2">
              <span className="text-secondary">النتيجة الإجمالية التقريبية: </span>
              <span className="text-primary font-bold">{calculateScore()}</span>
            </div>

            <button
              type="submit"
              className={`btn-gradient submit-btn w-full ${loading ? "opacity-loading" : ""}`}
              disabled={loading}
            >
              {loading ? "جارٍ التحليل والحفظ..." : "حفظ وإنشاء تقرير AI"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
