'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Question {
  id?: string;
  text: string;
  options: string;
  correct: number;
  order: number;
  active: boolean;
}

interface Result {
  id: string;
  name: string;
  phone: string;
  points: number;
  discount: number;
  status: string;
  createdAt: string;
}

type Tab = 'questions' | 'results';

const STATUS_COLORS: Record<string, string> = {
  NEW: '#3b82f6',
  USED: '#10b981',
};

export default function AdminQuizClient() {
  const [tab, setTab] = useState<Tab>('questions');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Question | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/quiz');
      const data = await res.json();
      if (res.ok) {
        setQuestions(data.questions || []);
        setResults(data.results || []);
      } else {
        toast.error(data.error || 'فشل التحميل');
      }
    } catch (err) {
      toast.error('فشل الاتصال');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const optionsArr = (editing.options || '').split('\n').map(s => s.trim()).filter(Boolean);
    if (!editing.text.trim() || optionsArr.length < 2) {
      toast.error('اكتب نص السؤال و خياراتك (كل خيار في سطر)');
      return;
    }
    try {
      const res = await fetch('/api/admin/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'question',
          id: editing.id,
          text: editing.text,
          options: optionsArr,
          correct: Number(editing.correct) || 0,
          order: Number(editing.order) || 0,
          active: editing.active,
        }),
      });
      if (res.ok) {
        toast.success(editing.id ? 'تم تحديث السؤال' : 'تمت إضافة السؤال');
        setEditing(null);
        fetchData();
      } else {
        const d = await res.json();
        toast.error(d.error || 'فشل الحفظ');
      }
    } catch (err) {
      toast.error('فشل الاتصال');
    }
  };

  const handleDelete = async (kind: 'question' | 'result', id: string) => {
    if (!confirm(`هل أنت متأكد من حذف هذا الـ ${kind === 'question' ? 'السؤال' : 'السجل'}؟`)) return;
    try {
      const res = await fetch(`/api/admin/quiz?kind=${kind}&id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('تم الحذف');
        fetchData();
      } else {
        const d = await res.json();
        toast.error(d.error || 'فشل الحذف');
      }
    } catch (err) {
      toast.error('فشل الاتصال');
    }
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' });

  const questionOptions = (q: Question) => {
    try { return JSON.parse(q.options); } catch { return [q.options]; }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-bold text-white">اختبر معلوماتك — إدارة النقاط 🏆</h2>
          <p className="opacity-60">تحكم في أسئلة الاختبار ونتائج المشاركين والخصومات</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-white/10 pb-2 mb-4">
        {[
          { id: 'questions', label: `الأسئلة (${questions.length})` },
          { id: 'results', label: `نتائج المشاركين (${results.length})` },
        ].map(t => (
          <button
            key={t.id}
            className={`px-4 py-2 rounded-lg transition-all text-sm font-bold ${tab === t.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-white/60 hover:bg-white/5'}`}
            onClick={() => setTab(t.id as Tab)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card glass-panel p-8 text-center opacity-60">جاري التحميل...</div>
      ) : tab === 'questions' ? (
        <>
          <button
            onClick={() => setEditing({ text: '', options: '', correct: 0, order: questions.length + 1, active: true })}
            className="w-fit bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-full text-sm font-bold hover:bg-emerald-500/20 transition-all mb-4"
          >
            + إضافة سؤال جديد
          </button>

          <div className="flex flex-col gap-4">
            {questions.length === 0 && <div className="card glass-panel p-8 text-center opacity-50">لا توجد أسئلة</div>}
            {questions.map(q => (
              <div key={q.id} className="card glass-panel p-6 border border-white/5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">
                      {q.order}. {q.text}
                      {!q.active && <span className="mr-2 text-xs opacity-50">(غير نشط)</span>}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {questionOptions(q).map((opt: string, i: number) => (
                        <span
                          key={i}
                          className={`px-3 py-1 rounded-md text-xs font-bold ${i === q.correct ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-white/60 border border-white/10'}`}
                        >
                          {i === q.correct && '✓ '}{opt}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <button
                      onClick={() => setEditing({ ...q, options: questionOptions(q).join('\n') })}
                      className="text-indigo-400 text-xs font-bold bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg hover:bg-indigo-500/20 transition-all"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => q.id && handleDelete('question', q.id)}
                      className="text-red-500 text-xs font-bold bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-all"
                    >
                      حذف 🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {editing && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="modal-overlay flex-center p-4">
                <div className="modal-content glass-panel p-8 flex-col gap-4 w-full max-w-xl rounded-[40px] border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-white">{editing.id ? 'تعديل السؤال' : 'إضافة سؤال'}</h3>
                    <button className="text-white opacity-40 hover:opacity-100 text-2xl" onClick={() => setEditing(null)}>✕</button>
                  </div>
                  <form onSubmit={handleSaveQuestion} className="flex flex-col gap-4">
                    <div>
                      <label className="text-white/60 text-sm font-bold block mb-2">نص السؤال</label>
                      <textarea
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm w-full min-h-[70px] text-white focus:outline-none focus:border-indigo-500/50"
                        value={editing.text}
                        onChange={e => setEditing({ ...editing, text: e.target.value })}
                        placeholder="مثال: أنهى سن بيبدأ فيه الطفل يستجيب للنهي؟"
                      />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm font-bold block mb-2">الخيارات (كل خيار في سطر)</label>
                      <textarea
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm w-full min-h-[100px] text-white focus:outline-none focus:border-indigo-500/50"
                        value={editing.options}
                        onChange={e => setEditing({ ...editing, options: e.target.value })}
                        placeholder={'الخيار 1\nالخيار 2\nالخيار 3'}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-white/60 text-sm font-bold block mb-2">الإجابة الصحيحة (رقم)</label>
                        <input
                          type="number" min="0"
                          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm w-full text-white focus:outline-none focus:border-indigo-500/50"
                          value={editing.correct}
                          onChange={e => setEditing({ ...editing, correct: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="text-white/60 text-sm font-bold block mb-2">الترتيب</label>
                        <input
                          type="number" min="1"
                          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm w-full text-white focus:outline-none focus:border-indigo-500/50"
                          value={editing.order}
                          onChange={e => setEditing({ ...editing, order: Number(e.target.value) })}
                        />
                      </div>
                      <div className="flex items-end pb-2">
                        <label className="flex items-center gap-2 text-white text-sm font-bold cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-5 h-5 accent-indigo-500"
                            checked={editing.active}
                            onChange={e => setEditing({ ...editing, active: e.target.checked })}
                          />
                          ظهور السؤال
                        </label>
                      </div>
                    </div>
                    <button type="submit" className="btn-world-class px-6 py-2 shadow-lg-glow">
                      حفظ السؤال
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-4">
          {results.length === 0 && <div className="card glass-panel p-8 text-center opacity-50">لا توجد نتائج بعد</div>}
          {results.map(r => (
            <div key={r.id} className="card glass-panel p-6 border border-white/5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {r.name}
                    <span className="mr-2 px-2 py-0.5 rounded-md text-xs font-bold align-middle" style={{ background: `${STATUS_COLORS[r.status]}22`, color: STATUS_COLORS[r.status] }}>
                      {r.status}
                    </span>
                  </h3>
                  <p className="opacity-70 text-sm mb-1">📱 {r.phone}</p>
                  <p className="opacity-80 text-sm mb-1">
                    ⭐ {r.points} نقطة • 🎁 خصم <span className="text-emerald-400 font-bold">{r.discount}%</span>
                  </p>
                  <p className="text-xs opacity-40 mt-2">{formatDate(r.createdAt)}</p>
                </div>
                <button
                  onClick={() => handleDelete('result', r.id)}
                  className="text-red-500 text-xs font-bold bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-all"
                >
                  حذف 🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}