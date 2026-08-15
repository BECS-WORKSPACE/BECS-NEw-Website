import React, { useState, useEffect } from 'react';
import api from '../../api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users?limit=50');
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { legacyRole: newRole });
      alert('Role updated successfully');
      fetchUsers();
    } catch (err) {
      alert('Failed to update role');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading users...</div>;

  return (
    <div style={{ padding: '40px' }}>
      <h2 style={{ fontSize: '2rem', fontFamily: 'Outfit', color: 'var(--navy)', marginBottom: '24px', fontWeight: 700 }}>User Management</h2>
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
              <th style={{ padding: '16px', fontWeight: 600, color: 'var(--navy)' }}>Name</th>
              <th style={{ padding: '16px', fontWeight: 600, color: 'var(--navy)' }}>Email</th>
              <th style={{ padding: '16px', fontWeight: 600, color: 'var(--navy)' }}>Role</th>
              <th style={{ padding: '16px', fontWeight: 600, color: 'var(--navy)' }}>Status</th>
              <th style={{ padding: '16px', fontWeight: 600, color: 'var(--navy)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '16px' }}>{u.name}</td>
                <td style={{ padding: '16px', color: '#64748b' }}>{u.email}</td>
                <td style={{ padding: '16px' }}>
                  <select 
                    value={u.role?.name || u.legacyRole} 
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    style={{ padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, background: u.isLocked ? '#fef2f2' : '#ecfdf5', color: u.isLocked ? '#dc2626' : '#059669' }}>
                    {u.isLocked ? 'Locked' : u.status}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <button style={{ color: '#ef4444', background: 'transparent', border: '1px solid #fca5a5', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Suspend</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
