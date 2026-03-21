"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Checkout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    appointmentDate: "",
    currency: "EGP",
    paymentMethod: "Credit Card"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.success) {
        alert("تمت حجز جلستك والدفع بنجاح! رقم الفاتورة: " + data.transactionId + "\nتم رفع البيانات لقاعدة البيانات.");
        router.push("/");
      } else {
        alert("حدث خطأ أثناء الاتصال بالبوابة: " + data.error);
      }
    } catch (err) {
      alert("تعذر الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="card glass-panel" style={{ maxWidth: '650px', width: '100%', padding: '2.5rem', background: 'rgba(30, 41, 59, 0.6)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--text-primary)' }}>إتمام الحجز والدفع</h2>
          <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>العودة للرئيسية &rarr;</Link>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>اسم الطفل / الحالة</label>
              <input 
                type="text" 
                required 
                className="glass-panel" 
                style={{ width: '100%', padding: '0.8rem', outline: 'none', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.05)' }}
                value={formData.patientName}
                onChange={e => setFormData({...formData, patientName: e.target.value})}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>عمر الطفل (سنوات)</label>
              <input 
                type="number" 
                required 
                className="glass-panel" 
                style={{ width: '100%', padding: '0.8rem', outline: 'none', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.05)' }}
                value={formData.age}
                onChange={e => setFormData({...formData, age: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>موعد الجلسة المفضل</label>
            <input 
              type="datetime-local" 
              required 
              className="glass-panel" 
              style={{ width: '100%', padding: '0.8rem', outline: 'none', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.05)' }}
              value={formData.appointmentDate}
              onChange={e => setFormData({...formData, appointmentDate: e.target.value})}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>العملة (التسعير الموجه Geo-Pricing)</label>
              <select 
                className="glass-panel" 
                style={{ width: '100%', padding: '0.8rem', outline: 'none', color: 'var(--text-primary)', background: '#1e293b' }}
                value={formData.currency}
                onChange={e => setFormData({...formData, currency: e.target.value})}
              >
                <option value="EGP">جنيه مصري (EGP)</option>
                <option value="USD">دولار أمريكي (USD)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>طريقة الدفع (Gateway)</label>
              <select 
                className="glass-panel" 
                style={{ width: '100%', padding: '0.8rem', outline: 'none', color: 'var(--text-primary)', background: '#1e293b' }}
                value={formData.paymentMethod}
                onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
              >
                <option value="Credit Card">بطاقات الائتمان (Visa/MC)</option>
                <option value="Fawry">منفذ فوري (Fawry)</option>
                <option value="Meeza">محفظة ميزة (Meeza)</option>
              </select>
            </div>
          </div>

          {/* Secure Payment Area */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
               <h4 style={{ color: 'var(--accent-primary)', margin: 0 }}>بيانات البطاقة الآمنة</h4>
               <span style={{ fontSize: '0.8rem', color: '#10b981' }}>🔒 مشفر عبر 256-bit SSL</span>
            </div>
            <input type="text" placeholder="رقم البطاقة: 0000 0000 0000 0000" className="glass-panel" style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', outline: 'none', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input type="text" placeholder="تاريخ الانتهاء MM/YY" className="glass-panel" style={{ width: '50%', padding: '0.8rem', outline: 'none', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
              <input type="text" placeholder="رمز الأمان CVC" className="glass-panel" style={{ width: '50%', padding: '0.8rem', outline: 'none', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="btn-gradient mt-2" style={{ padding: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
            {loading ? "جاري معالجة بوابة الدفع..." : "تأكيد وإتمام الحجز"}
          </button>
        </form>

      </div>
    </div>
  );
}
