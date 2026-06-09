import { useEffect } from 'react';

const adminUrl = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5175';

const Admin = () => {
  useEffect(() => {
    window.location.href = adminUrl;
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        textAlign: 'center',
        background: '#0f172a',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      <div>
        <h1 style={{ marginBottom: '12px' }}>Redirecting to BECS Admin Control Center</h1>
        <p style={{ marginBottom: '18px', color: '#94a3b8' }}>
          If the admin dashboard does not open automatically, click the button below.
        </p>
        <a
          href={adminUrl}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '46px',
            padding: '0 24px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
            color: '#fff',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 10px 20px rgba(14, 165, 233, 0.3)'
          }}
        >
          Open Admin Panel
        </a>
      </div>
    </div>
  );
};

export default Admin;
