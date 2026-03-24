'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await fetch('/api/admin/users', {
        method: 'PATCH',
        body: JSON.stringify({ userId, role: newRole }),
        headers: { 'Content-Type': 'application/json' }
      });
      fetchUsers();
    } catch (err) {
      alert('فشل تحديث الرتبة');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم نهائياً؟')) return;
    try {
      await fetch(`/api/admin/users?userId=${userId}`, { method: 'DELETE' });
      fetchUsers();
    } catch (err) {
      alert('فشل حذف المستخدم');
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar glass-panel">
        <div className="logo">
          <div className="logo-icon admin-bg-warning">A</div>
          <h2>إدارة المستخدمين</h2>
        </div>
        <nav className="side-nav">
          <Link href="/dashboard/admin" className="nav-item">العودة للرئيسية</Link>
          <Link href="/dashboard/admin/users" className="nav-item active">كافة المستخدمين</Link>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h2>إدارة الحسابات والأدوار</h2>
        </header>

        <div className="card glass-panel mt-4">
          {loading ? (
            <p className="text-center p-4">جاري تحميل البيانات...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                   <tr className="border-bottom-glass">
                     <th className="p-1">الاسم</th>
                     <th className="p-1">البريد الإلكتروني</th>
                     <th className="p-1">الرتبة</th>
                     <th className="p-1">تاريخ الانضمام</th>
                     <th className="p-1">الإجراءات</th>
                   </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-bottom-glass-subtle">
                      <td className="p-1">{user.name}</td>
                      <td className="p-1">{user.email}</td>
                      <td className="p-1">
                        <select 
                          value={user.role} 
                          title="تغيير رتبة المستخدم"
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="bg-transparent text-primary outline-none cursor-pointer"
                        >
                          <option value="PARENT">PARENT</option>
                          <option value="SPECIALIST">SPECIALIST</option>
                          <option value="CENTER">CENTER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td className="p-1 text-sm-secondary">
                        {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="p-1">
                         <button 
                           onClick={() => handleDelete(user.id)}
                           className="text-danger cursor-pointer hover:underline"
                         >
                           حذف
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
