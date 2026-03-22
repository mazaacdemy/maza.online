"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewAssessmentPage() {
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    diagnosis: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSaveReport = async () => {
    if (!aiResult) return;
    setSaving(true);
    try {
      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: formData.patientName,
          summary: aiResult.summary,
          iepPlan: aiResult.iepPlan
        })
      });
      const data = await res.json();
      if (data.success) {
        router.push('/dashboard/specialist/assessments');
      } else {
        alert(data.error || 'فشل حفظ التقرير');
      }
    } catch(err) {
      alert('تعذر الاتصال بالخادم');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAiResult(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        setAiResult(data.aiResponse);
      } else {
        setError(data.error || "حدث خطأ أثناء تقييم الحالة بواسطة الذكاء الاصطناعي.");
      }
    } catch (err: any) {
      setError("تعذر الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="bg-blur"></div>
      
      <aside className="sidebar-glass">
        <h2 className="logo">ماذا</h2>
        <nav className="side-nav">
          <Link href="/dashboard/specialist">الرئيسية</Link>
          <Link href="/dashboard/specialist/sessions">جلسات التخاطب</Link>
          <Link href="/dashboard/specialist/assessments" className="active">تقييمات AI</Link>
          <Link href="/welcome" style={{ marginTop: 'auto' }}>الخروج</Link>
        </nav>
      </aside>

      <main className="content">
        <header className="main-header">
          <h1>إصدار تقييم ذكي جديد (AI Assessment)</h1>
          <Link href="/dashboard/specialist/assessments" className="btn-outline-small" style={{ textDecoration: 'none' }}>عودة للتقارير</Link>
        </header>

        <div className="layout-grid mt-4">
          <section className="form-section glass">
            <h3>بيانات الجلسة وملاحظات الأخصائي</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div>
                <label className="input-label">اسم الحالة</label>
                <input required type="text" className="glass-input" value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} placeholder="الاسم ثلاثي" />
              </div>
              <div>
                <label className="input-label">العمر (بالسنوات)</label>
                <input required type="number" className="glass-input" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} placeholder="مثال: 5" />
              </div>
              <div>
                <label className="input-label">التشخيص المبدئي</label>
                <input required type="text" className="glass-input" value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} placeholder="طيف توحد، تأخر لغوي، الخ" />
              </div>
              <div>
                <label className="input-label">ملاحظات الجلسة (تفصيلية)</label>
                <textarea required className="glass-input" rows={6} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="اكتب كل الملاحظات السلوكية والإدراكية واللغوية التي لاحظتها خلال الجلسة هنا، ودع الذكاء الاصطناعي يحللها..."></textarea>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="btn-gradient" disabled={loading}>
                {loading ? 'جاري التحليل واستخراج الخطة...' : 'توليد التقرير الذكي ✨'}
              </button>
            </form>
          </section>

          <section className="result-section">
            {aiResult ? (
              <div className="glass ai-report">
                <h3 style={{ color: '#a855f7', marginBottom: '1rem' }}>نتيجة التقييم والخطة العلاجية</h3>
                
                <div className="report-block">
                  <h4>الملخص التحليلي</h4>
                  <p>{aiResult.summary}</p>
                </div>

                <div className="flex-blocks">
                  <div className="report-block strengths">
                    <h4>نقاط القوة</h4>
                    <ul>{aiResult.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul>
                  </div>
                  <div className="report-block weaknesses">
                    <h4>نقاط بحاجة لتطوير</h4>
                    <ul>{aiResult.weaknesses?.map((w: string, i: number) => <li key={i}>{w}</li>)}</ul>
                  </div>
                </div>

                <div className="report-block iep-plan">
                  <h4>مسودة البرنامج العلاجي הפردي (IEP)</h4>
                  <p style={{ whiteSpace: 'pre-line' }}>{aiResult.iepPlan}</p>
                </div>

                {aiResult.note && (
                  <div className="warning-note">
                    {aiResult.note}
                  </div>
                )}
                
                <button onClick={handleSaveReport} disabled={saving} className="btn-gradient mt-4" style={{ width: '100%', padding: '1rem' }}>
                  {saving ? 'جاري الحفظ والربط...' : 'اعتماد التقرير وحفظه في ملف الطفل'}
                </button>
              </div>
            ) : (
              <div className="placeholder-glass">
                <div className="icon">🤖</div>
                <p>قم بتعبئة الملاحظات واضغط على توليد التقرير لتحصل على تحليل ذكي فوري وخطة علاجية مخصصة للطفل.</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-container { display: flex; min-height: 100vh; background: #0f172a; color: #f8fafc; direction: rtl; }
        .bg-blur { position: fixed; width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%); z-index: 0; top: -10%; left: -10%; }
        .sidebar-glass { width: 250px; background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(20px); border-left: 1px solid rgba(255, 255, 255, 0.1); padding: 2.5rem; display: flex; flex-direction: column; gap: 3rem; z-index: 10; }
        .logo { font-size: 2rem; font-weight: 800; color: #6366f1; }
        .side-nav { display: flex; flex-direction: column; gap: 1rem; flex: 1; }
        .side-nav a { color: #94a3b8; text-decoration: none; padding: 1rem; border-radius: 12px; transition: 0.3s; }
        .side-nav a.active, .side-nav a:hover { background: rgba(99, 102, 241, 0.1); color: #818cf8; }
        .content { flex: 1; padding: 3rem; z-index: 1; overflow-y: auto; }
        .main-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .layout-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start; }
        
        .glass { background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 2rem; }
        .glass-input { width: 100%; padding: 1rem; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: white; outline: none; transition: 0.3s; font-family: inherit; }
        .glass-input:focus { border-color: #a855f7; background: rgba(15, 23, 42, 0.8); }
        .input-label { display: block; margin-bottom: 0.5rem; color: #94a3b8; font-size: 0.95rem; }
        
        .btn-gradient { background: linear-gradient(135deg, #6366f1, #a855f7); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 12px; cursor: pointer; font-weight: 600; text-align: center; }
        .btn-gradient:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-outline-small { background: transparent; color: #818cf8; border: 1px solid #6366f1; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; transition: 0.3s; }
        .error-message { background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 1rem; border-radius: 12px; border: 1px solid rgba(239,68,68,0.3); }
        
        .placeholder-glass { background: rgba(30, 41, 59, 0.3); border: 2px dashed rgba(255,255,255,0.1); border-radius: 20px; padding: 4rem 2rem; text-align: center; color: #64748b; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .placeholder-glass .icon { font-size: 4rem; opacity: 0.5; }
        
        .ai-report .report-block { margin-bottom: 1.5rem; background: rgba(15, 23, 42, 0.4); padding: 1.5rem; border-radius: 12px; border-right: 4px solid #6366f1; }
        .ai-report h4 { color: #818cf8; margin-bottom: 0.5rem; font-size: 1rem; }
        .ai-report p { color: #cbd5e1; line-height: 1.6; font-size: 0.95rem; }
        .ai-report ul { padding-right: 1.5rem; color: #cbd5e1; margin-top: 0.5rem; }
        .ai-report li { margin-bottom: 0.4rem; }
        .flex-blocks { display: flex; gap: 1rem; }
        .flex-blocks .report-block { flex: 1; }
        .flex-blocks .strengths { border-right-color: #22c55e; }
        .flex-blocks .weaknesses { border-right-color: #ef4444; }
        .iep-plan { border-right-color: #a855f7 !important; }
        .warning-note { background: rgba(234, 179, 8, 0.1); color: #eab308; padding: 1rem; border-radius: 8px; font-size: 0.85rem; border: 1px solid rgba(234, 179, 8, 0.2); margin-top: 1rem; }
        .mt-4 { margin-top: 2rem; }
      `}} />
    </div>
  );
}
