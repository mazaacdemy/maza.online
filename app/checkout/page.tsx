"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Checkout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pricingInfo, setPricingInfo] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    appointmentDate: "",
    currency: "EGP",
    paymentMethod: "Credit Card"
  });

  useEffect(() => {
    fetch('/api/payment')
      .then(res => res.json())
      .then(data => {
        if(data.success) {
          setPricingInfo(data);
          setFormData(prev => ({
             ...prev, 
             currency: data.pricing.currency,
             paymentMethod: data.paymentMethods[0]
          }));
        }
      });
  }, []);

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
        alert("تمت حجز جلستك والدفع بنجاح! رقم الفاتورة: " + data.transactionId);
        router.push("/dashboard/parent");
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
    <div className="dashboard-container min-h-screen flex-center">
      <div className="card glass-panel checkout-card">
        
        <div className="flex-between-mb-2">
          <h2 className="text-primary-no-margin">إتمام الحجز والدفع</h2>
          <Link href="/dashboard/parent" className="link-secondary-no-decor">العودة للوحة التحكم &rarr;</Link>
        </div>
        
        {pricingInfo && (
          <div className="pricing-info-box">
            <h4 className="color-accent-primary mb-05">تسعير الجلسة ({pricingInfo.pricing.location})</h4>
            <div className="pricing-amount">
              {pricingInfo.pricing.amount} {pricingInfo.pricing.currency}
            </div>
            <p className="pricing-msg">{pricingInfo.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-layout">
          
          <div className="grid-2-col">
            <div>
              <label className="form-label">اسم الحالة للتأكيد</label>
              <input 
                type="text" 
                title="اسم الحالة"
                aria-label="اسم الحالة"
                required 
                className="glass-panel form-input-light" 
                value={formData.patientName}
                onChange={e => setFormData({...formData, patientName: e.target.value})}
              />
            </div>
            <div>
               <label className="form-label">طريقة الدفع (Gateway)</label>
               <select 
                 title="طريقة الدفع"
                 aria-label="طريقة الدفع"
                 className="glass-panel form-input-dark" 
                 value={formData.paymentMethod}
                 onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
               >
                 {pricingInfo?.paymentMethods?.map((method: string) => (
                    <option key={method} value={method}>{method}</option>
                 ))}
               </select>
            </div>
          </div>

          {/* Secure Payment Area */}
          <div className="glass-panel secure-payment-area">
            <div className="flex-between-mb-2 mb-1">
               <h4 className="color-accent-primary m-0">بيانات البطاقة الآمنة</h4>
               <span className="secure-badge">🔒 مشفر عبر 256-bit SSL</span>
            </div>
            <input type="text" title="رقم البطاقة" aria-label="رقم البطاقة" required placeholder="رقم البطاقة: 0000 0000 0000 0000" className="glass-panel form-input-light mb-1" />
            <div className="flex-row-gap">
              <input type="text" title="تاريخ الانتهاء" aria-label="تاريخ الانتهاء" required placeholder="تاريخ الانتهاء MM/YY" className="glass-panel form-input-light flex-1" />
              <input type="text" title="رمز الأمان" aria-label="رمز الأمان" required placeholder="رمز الأمان CVC" className="glass-panel form-input-light flex-1" />
            </div>
          </div>
          
          <button type="submit" disabled={loading} className={`btn-gradient submit-btn mt-2 ${loading ? 'opacity-loading' : ''}`}>
            {loading ? "جاري معالجة الدفع..." : "الدفع وتأكيد الحجز"}
          </button>
        </form>

      </div>
    </div>
  );
}
