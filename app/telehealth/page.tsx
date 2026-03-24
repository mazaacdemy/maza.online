"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Telehealth() {
  const [patients, setPatients] = useState<any[]>([]);
  const [patientId, setPatientId] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportSaved, setReportSaved] = useState(false);
  const [error, setError] = useState("");
  const [roomUrl, setRoomUrl] = useState<string>("");
  const [roomLoading, setRoomLoading] = useState(true);

  const queryAppointmentId = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('appointmentId') : null;

  useEffect(() => {
    // Generate Room
    fetch("/api/telehealth/room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId: queryAppointmentId || 'mock' })
    })
      .then(res => res.json())
      .then(data => {
        if(data.success) {
           setRoomUrl(data.roomUrl);
        } else {
           setRoomUrl("https://ahmed-maza-demo.daily.co/test-room");
        }
      })
      .catch((e) => {
         setRoomUrl("https://ahmed-maza-demo.daily.co/test-room");
      })
      .finally(() => setRoomLoading(false));

    // Fetch Patients
    fetch("/api/patients-mock") // fallback if it doesn't exist
      .then(res => res.json())
      .catch(() => {
        // Fallback to demo patients if API not built to avoid breaking
        setPatients([
          { id: "cm0y76vxc000213x4a2a1b3c4" /* dummy ID */, name: "ياسين محمد" },
          { id: "cm0y76vxc000213x4a2a1b3c5", name: "سجا أحمد" } // replace with real IDs in production
        ]);
      });
  }, [queryAppointmentId]);

  const handleSaveNotes = async () => {
    if (!notes) {
      setError("يرجى إدخال الملاحظات أولاً.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const selectedPatient = patients.find(p => p.id === patientId) || { name: "ياسين محمد" };

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patientId || null, 
          patientName: selectedPatient.name,
          notes: notes
        })
      });

      const data = await res.json();
      if (data.success) {
        setReportSaved(true);
      } else {
        setError(data.error || "خطأ في التقرير.");
      }
    } catch (err) {
      setError("خطأ في الاتصال.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar glass-panel">
        <div className="logo">
          <div className="logo-icon">M</div>
          <h2>ماذا <span>(Maza)</span></h2>
        </div>
        <nav className="side-nav">
          <Link href="/dashboard/specialist" className="nav-item">
            الرئيسية
          </Link>
          <Link href="/telehealth" className="nav-item active">
            غرف الجلسات الافتراضية
          </Link>
        </nav>
      </aside>

      <main className="main-content flex-col">
        <header className="topbar">
          <h2 className="flex-center-gap-1">
             <span className="status-dot-success"></span>
             غرفة التخاطب الافتراضية
          </h2>
          <div className="timer glass-panel timer-text">
            نشط الآن
          </div>
        </header>

        <div className="telehealth-row">
          {/* Video Area */}
          <div className="telehealth-video-area">
            <div className="glass-panel video-container">
              {roomLoading ? (
                 <div className="p-1-text-secondary-no-list">جاري إعداد الغرفة الآمنة...</div>
              ) : (
                <iframe
                  title="غرفة الجلسة الافتراضية"
                  src={roomUrl}
                  allow="camera; microphone; fullscreen; display-capture"
                  className="w-full-h-full-no-border"
                ></iframe>
              )}
            </div>
          </div>

          <div className="glass-panel telehealth-notes-area">
            <h3 className="flex-center-gap-1 color-accent-primary mb-1">
              ملاحظات الجلسة وتغذية AI
            </h3>
            
            <div className="mb-1">
              <label className="form-label">اختر الحالة (المريض):</label>
              <select 
                title="اختر المريض"
                aria-label="اختر المريض"
                className="glass-panel telehealth-select" 
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              >
                <option value="">-- اختر مريض لحفظ التقرير --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <textarea 
               className="glass-panel telehealth-textarea" 
               placeholder="اكتب ملاحظاتك أثناء الجلسة هنا. سيقوم مساعد Maza الذكي (Gemini) بتلخيصها لاحقاً وتضمينها في تقرير الحالة..."
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
            ></textarea>
            
            {error && <div className="text-error-sm">{error}</div>}
            {reportSaved && <div className="text-success-sm">تم حفظ تقرير AI في سجل المريض بنجاح!</div>}

            <div className="flex-row-gap mt-1">
               <button 
                  className={`btn-gradient flex-1 ${loading ? "opacity-loading" : "cursor-pointer"}`} 
                  onClick={handleSaveNotes}
                  disabled={loading}
               >
                 {loading ? "جاري التحليل والحفظ..." : "حفظ الملاحظات للتقرير"}
               </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
