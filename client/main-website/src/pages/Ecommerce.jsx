import { useEffect } from 'react';

const ecommerceUrl = import.meta.env.VITE_ECOMMERCE_URL || 'http://localhost:5174';

const Ecommerce = () => {
  useEffect(() => {
    window.location.href = ecommerceUrl;
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <div>
        <h1 style={{ marginBottom: '12px' }}>Redirecting to BECS Store</h1>
        <p style={{ marginBottom: '18px', color: '#6c7a92' }}>
          If the store does not open automatically, use the button below.
        </p>
        <a
          href={ecommerceUrl}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '46px',
            padding: '0 20px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #ff7048, #ff8a5e)',
            color: '#fff',
            fontWeight: 700,
          }}
        >
          Open Store
        </a>
      </div>
    </div>
  );
};

export default Ecommerce;
