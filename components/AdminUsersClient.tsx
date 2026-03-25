'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const roles = ['PARENT', 'SPECIALIST', 'CENTER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      toast.error('فشل تحميل المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users/role', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (res.ok) {
        toast.success('تم تحديث الدور بنجاح');
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || 'فشل التحديث');
      }
    } catch (error) {
      toast.error('خطأ غير متوقع');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-col gap-2 p-2">
      <header className="flex-between items-center mb-1">
        <div>
          <h2 className="text-2xl font-bold color-white">إدارة المستخدمين والصلاحيات</h2>
          <p className="text-sm-secondary">تحكم في أدوار المشرفين والأخصائيين وأولياء الأمور</p>
        </div>
        <div className="search-bar-premium glass-panel px-1 py-0-5 flex-center gap-05">
          <span>🔍</span>
          <input 
            type="text" 
            placeholder="بحث بالاسم أو الايميل..." 
            className="bg-transparent border-none outline-none color-white text-sm w-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="card glass-panel p-0 overflow-hidden">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-white/5 text-secondary text-sm">
              <th className="p-1">الاسم</th>
              <th className="p-1">البريد الإلكتروني</th>
              <th className="p-1">الدور الحالي</th>
              <th className="p-1">تغيير الصلاحية</th>
              <th className="p-1">تاريخ الانضمام</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center p-4">جاري التحميل...</td></tr>
            ) : filteredUsers.map(user => (
              <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-1 font-bold color-white">{user.name}</td>
                <td className="p-1 text-secondary text-sm">{user.email}</td>
                <td className="p-1">
                  <span className={`badge-role role-${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-1">
                  <select 
                    aria-label="Change user role"
                    className="role-select-premium"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td className="p-1 text-secondary text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .badge-role {
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .role-super_admin { background: #ef4444; color: white; box-shadow: 0 0 10px rgba(239, 68, 68, 0.4); }
        .role-admin { background: #8b5cf6; color: white; }
        .role-moderator { background: #f59e0b; color: white; }
        .role-specialist { background: #10b981; color: white; }
        .role-parent { background: rgba(255,255,255,0.1); color: #ccc; }
        
        .role-select-premium {
          background: rgba(255,255,255,0.05);
          color: white;
          border: 1px solid var(--glass-border);
          padding: 0.4rem;
          border-radius: 8px;
          font-size: 0.85rem;
          cursor: pointer;
          outline: none;
        }
        .role-select-premium:focus {
          border-color: var(--accent-primary);
        }
        .role-select-premium option {
          background: #1e293b;
          color: white;
        }
      `}</style>
    </div>
  );
}
