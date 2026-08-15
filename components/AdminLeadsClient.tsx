'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface AdvertiseLead {
  id: string;
  name: string;
  type: string;
  phone: string;
  city: string;
  description?: string;
  status: string;
  createdAt: string;
}

interface JobApplication {
  id: string;
  name: string;
  phone: string;
  specialty: string;
  degree?: string;
  degreeSpec?: string;
  years?: number;
  isFresh: boolean;
  hasTraining: boolean;
  trainingWhere?: string;
  cvUrl?: string;
  status: string;
  createdAt: string;
}

type Tab = 'advertise' | 'jobs';

const STATUS_OPTIONS = {
  advertise: ['NEW', 'CONTACTED', 'CLOSED'],
  jobs: ['NEW', 'REVIEWED', 'ACCEPTED', 'REJECTED'],
};

const STATUS_COLORS: Record<string, string> = {
  NEW: '#3b82f6',
  CONTACTED: '#8b5cf6',
  CLOSED: '#10b981',
  REVIEWED: '#8b5cf6',
  ACCEPTED: '#10b981',
  REJECTED: '#ef4444',
};

const degreeLabels: Record<string, string> = {
  bachelor: 'بكالوريوس',
  diploma: 'دبلومة عليا',
  master: 'ماجستير',
  phd: 'دكتوراه',
};

export default function AdminLeadsClient() {
  const [tab, setTab] = useState<Tab>('advertise');
  const [advertise, setAdvertise] = useState<AdvertiseLead[]>([]);
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/leads');
      const data = await res.json();
      if (res.ok) {
        setAdvertise(data.advertise || []);
        setJobs(data.jobs || []);
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
    fetchLeads();
  }, []);

  const handleStatus = async (type: Tab, id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, status }),
      });
      if (res.ok) {
        toast.success('تم تحديث الحالة');
        fetchLeads();
      } else {
        const data = await res.json();
        toast.error(data.error || 'فشل التحديث');
      }
    } catch (err) {
      toast.error('فشل الاتصال');
    }
  };

  const handleDelete = async (type: Tab, id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا السجل نهائياً؟')) return;
    try {
      const res = await fetch(`/api/admin/leads?type=${type}&id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('تم الحذف');
        fetchLeads();
      } else {
        const data = await res.json();
        toast.error(data.error || 'فشل الحذف');
      }
    } catch (err) {
      toast.error('فشل الاتصال');
    }
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleString('ar-EG', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-bold text-white">طلبات التسجيل والتوظيف 📋</h2>
          <p className="opacity-60">تحكم كامل في طلبات «اعلن معنا» و «التقديم لوظيفة»</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-white/10 pb-2 mb-4">
        {[
          { id: 'advertise', label: `طلبات «اعلن معنا» (${advertise.length})` },
          { id: 'jobs', label: `طلبات التوظيف (${jobs.length})` },
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
      ) : tab === 'advertise' ? (
        <div className="flex flex-col gap-4">
          {advertise.length === 0 && <div className="card glass-panel p-8 text-center opacity-50">لا توجد طلبات بعد</div>}
          {advertise.map(lead => (
            <div key={lead.id} className="card glass-panel p-6 border border-white/5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {lead.name}
                    <span className={`mr-2 px-2 py-0.5 rounded-md text-xs font-bold align-middle`} style={{ background: `${STATUS_COLORS[lead.status]}22`, color: STATUS_COLORS[lead.status] }}>
                      {lead.status}
                    </span>
                  </h3>
                  <p className="opacity-70 text-sm mb-1">
                    {lead.type === 'specialist' ? 'أخصائي مستقل' : 'مركز / عيادة'} • {lead.city} • 📱 {lead.phone}
                  </p>
                  {lead.description && <p className="text-sm opacity-60 mb-1">{lead.description}</p>}
                  <p className="text-xs opacity-40 mt-2">{formatDate(lead.createdAt)}</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <select
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                    value={lead.status}
                    onChange={e => handleStatus('advertise', lead.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.advertise.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button
                    onClick={() => handleDelete('advertise', lead.id)}
                    className="text-red-500 text-xs font-bold bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-all"
                  >
                    حذف 🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {jobs.length === 0 && <div className="card glass-panel p-8 text-center opacity-50">لا توجد طلبات بعد</div>}
          {jobs.map(job => (
            <div key={job.id} className="card glass-panel p-6 border border-white/5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {job.name}
                    <span className={`mr-2 px-2 py-0.5 rounded-md text-xs font-bold align-middle`} style={{ background: `${STATUS_COLORS[job.status]}22`, color: STATUS_COLORS[job.status] }}>
                      {job.status}
                    </span>
                  </h3>
                  <p className="opacity-70 text-sm mb-1">📱 {job.phone}</p>
                  <p className="opacity-80 text-sm mb-1">🎓 {job.specialty}</p>
                  <div className="opacity-60 text-sm mb-1">
                    {job.degree && <span>{degreeLabels[job.degree] || job.degree}{job.degreeSpec ? ` (${job.degreeSpec})` : ''} • </span>}
                    {job.years !== null && job.years !== undefined && <span>{job.years} سنة خبرة • </span>}
                    {job.isFresh && <span>حديث تخرج • </span>}
                    {job.isFresh && job.hasTraining && <span>تدريب عملي{job.trainingWhere ? ` (${job.trainingWhere})` : ''} • </span>}
                  </div>
                  {job.cvUrl && (
                    <a href={job.cvUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 text-sm font-bold hover:underline">
                      📄 عرض السيرة الذاتية
                    </a>
                  )}
                  <p className="text-xs opacity-40 mt-2">{formatDate(job.createdAt)}</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <select
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                    value={job.status}
                    onChange={e => handleStatus('jobs', job.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.jobs.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button
                    onClick={() => handleDelete('jobs', job.id)}
                    className="text-red-500 text-xs font-bold bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-all"
                  >
                    حذف 🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}