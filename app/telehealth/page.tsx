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

      <main className="main-content" style={{ display: 'flex', flexDirection: 'column' }}>
        <header className="topbar">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <span style={{ width: '12px', height: '12px', background: 'var(--success)', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px var(--success)' }}></span>
             غرفة التخاطب الافتراضية
          </h2>
          <div className="timer glass-panel" style={{ padding: '0.5rem 1rem', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>
            نشط الآن
          </div>
        </header>

        <div style={{ display: 'flex', gap: '1.5rem', flex: 1, marginTop: '1rem' }}>
          {/* Video Area */}
          <div style={{ flex: 3, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-panel" style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {roomLoading ? (
                 <div style={{ color: 'var(--text-secondary)' }}>جاري إعداد الغرفة الآمنة...</div>
              ) : (
                <iframe
                  src={roomUrl}
                  allow="camera; microphone; fullscreen; display-capture"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                ></iframe>
              )}
            </div>
          </div>

          <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ملاحظات الجلسة وتغذية AI
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>اختر الحالة (المريض):</label>
              <select 
                className="glass-panel" 
                style={{ padding: '0.5rem', width: '100%', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)' }}
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
               className="glass-panel" 
               style={{ flex: 1, width: '100%', resize: 'none', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: 'none', color: 'var(--text-primary)', outline: 'none', lineHeight: '1.6' }} 
               placeholder="اكتب ملاحظاتك أثناء الجلسة هنا. سيقوم مساعد Maza الذكي (Gemini) بتلخيصها لاحقاً وتضمينها في تقرير الحالة..."
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
            ></textarea>
            
            {error && <div style={{ color: '#f87171', marginTop: '0.5rem', fontSize: '0.9rem' }}>{error}</div>}
            {reportSaved && <div style={{ color: '#4ade80', marginTop: '0.5rem', fontSize: '0.9rem' }}>تم حفظ تقرير AI في سجل المريض بنجاح!</div>}

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
               <button 
                  className="btn-gradient" 
                  style={{ flex: 1, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }} 
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
