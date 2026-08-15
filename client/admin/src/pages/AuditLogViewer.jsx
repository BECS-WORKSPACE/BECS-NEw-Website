import React, { useState, useEffect } from 'react';
import { fetchAuditLogs } from '../api';

const AuditLogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const { data } = await fetchAuditLogs();
      setLogs(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load audit logs. Ensure you have Super Admin privileges.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-container">
      <header className="view-header">
        <div>
          <h2 className="view-title">System Audit Logs</h2>
          <p className="view-subtitle">Track administrative actions and system modifications in real-time.</p>
        </div>
        <button className="btn btn-secondary" onClick={loadLogs}>Refresh Logs</button>
      </header>
      
      {error && (
        <div className="alert-box alert-danger" style={{ marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <section className="card">
        <div className="table-wrapper">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>Loading logs...</div>
          ) : logs.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>No audit logs found. System actions will appear here automatically.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Admin</th>
                  <th>Action</th>
                  <th>Target Entity</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log._id}>
                    <td style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td>
                      <strong>{log.admin?.name || 'Unknown'}</strong>
                      <span className="table-subtext">{log.admin?.email}</span>
                    </td>
                    <td>
                      <span className={`badge badge-${log.action === 'Delete' ? 'danger' : log.action === 'Create' ? 'success' : 'primary'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td>
                      <strong>{log.entity}</strong>
                      <span className="table-subtext">ID: {log.entityId}</span>
                    </td>
                    <td style={{ color: 'var(--text-light)', fontFamily: 'monospace' }}>
                      {log.ipAddress || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
};

export default AuditLogViewer;
