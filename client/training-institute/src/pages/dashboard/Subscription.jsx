import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

const Subscription = () => {
  const { user, setUser } = useAuth();
  const [pricing, setPricing] = useState({ originalPrice: 7999, discountedPrice: 4999 });
  const [loading, setLoading] = useState(true);

  // Mock data for the UI
  const isPremium = user?.isPremium || false;
  const validUntil = user?.subscriptionValidUntil ? new Date(user.subscriptionValidUntil).toLocaleDateString() : null;
  const hasExpired = !isPremium && validUntil;
  
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    try {
      const savedPayments = JSON.parse(localStorage.getItem('becs_payments')) || [];
      setPaymentHistory(savedPayments);
    } catch (e) {
      setPaymentHistory([]);
    }
  }, []);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await api.get('/config/pricing');
        if (res.data) setPricing(res.data);
      } catch (err) {
        console.error('Failed to fetch pricing', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRenew = async () => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert('Failed to load Razorpay SDK. Please check your connection.');
      return;
    }

    try {
      // 1. Create order on backend
      const orderRes = await api.post('/payments/create-order', {
        amount: pricing.discountedPrice,
        purpose: 'subscription'
      });

      const { id, amount, currency } = orderRes.data;

      // 2. Configure Razorpay UI
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'dummy_id', // Add your key to .env
        amount,
        currency,
        name: 'EduVerse Premium',
        description: 'Monthly Subscription',
        image: '/logo.png', // Or any URL
        order_id: id,
        handler: async function (response) {
          // 3. Verify Payment Signature
          try {
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              purpose: 'subscription'
            });

            if (verifyRes.data.success) {
              const updatedUser = {
                ...user,
                isPremium: true,
                subscriptionValidUntil: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString()
              };
              localStorage.setItem('becs_user', JSON.stringify(updatedUser));
              
              const newPayment = {
                id: 'INV-' + Date.now().toString().slice(-6),
                date: new Date().toLocaleDateString(),
                amount: pricing.discountedPrice,
                status: 'Paid',
                method: 'Razorpay'
              };
              const existingPayments = JSON.parse(localStorage.getItem('becs_payments') || '[]');
              localStorage.setItem('becs_payments', JSON.stringify([newPayment, ...existingPayments]));

              alert('Payment Successful! You are now a Premium Member.');
              window.location.reload(); // Quick refresh to load new auth status
            }
          } catch (verifyError) {
            alert('Payment verification failed.');
            console.error(verifyError);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone || ''
        },
        theme: {
          color: '#2563eb'
        }
      };

      const paymentObject = new window.Razorpay(options);
      
      // If using dummy key, Razorpay will throw an error immediately on open
      paymentObject.on('payment.failed', function (response) {
        console.error(response.error);
        alert('Payment Failed: ' + response.error.description);
      });

      paymentObject.open();

    } catch (error) {
      console.error('Error in payment flow:', error);
      alert('Could not initiate payment. Are backend keys configured?');
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <h2 style={{ fontSize: '2rem', fontFamily: 'Outfit', color: 'var(--navy)', marginBottom: '24px', fontWeight: 700 }}>
        Subscription & Billing
      </h2>

      {/* Current Plan Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '40px' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', padding: '40px', borderRadius: '24px', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(15,23,42,0.15)' }}>
          <div style={{ position: 'absolute', top: '-100px', right: '-50px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }}></div>
          
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ background: isPremium ? 'rgba(16,185,129,0.2)' : (hasExpired ? 'rgba(239,68,68,0.2)' : 'rgba(100,116,139,0.2)'), color: isPremium ? '#34d399' : (hasExpired ? '#f87171' : '#94a3b8'), padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', border: `1px solid ${isPremium ? 'rgba(16,185,129,0.3)' : (hasExpired ? 'rgba(239,68,68,0.3)' : 'rgba(100,116,139,0.3)')}` }}>
                  {isPremium ? 'Active' : (hasExpired ? 'Expired' : 'Not Subscribed')}
                </span>
                <span style={{ color: '#94a3b8', fontWeight: 600 }}>EduVerse Premium</span>
              </div>
              
              <h3 style={{ fontSize: '2.5rem', margin: '0 0 8px 0', fontWeight: 800 }}>
                ₹{pricing.discountedPrice} <span style={{ fontSize: '1.2rem', color: '#94a3b8', fontWeight: 500 }}>/ month</span>
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '1.05rem', margin: 0 }}>
                {isPremium ? `Next billing date: ${validUntil}` : (hasExpired ? `Your premium access expired on ${validUntil}.` : 'You do not have an active subscription.')}
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '24px', borderRadius: '16px', backdropFilter: 'blur(10px)', minWidth: '300px' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700 }}>Plan Benefits</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#3b82f6' }}>✓</span> Unlimited access to all premium courses</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#3b82f6' }}>✓</span> 24/7 Live chat doubt solving</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#3b82f6' }}>✓</span> Downloadable PDFs & Offline Videos</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#3b82f6' }}>✓</span> Verified Certifications</li>
              </ul>
              
              <button onClick={handleRenew} style={{ width: '100%', marginTop: '24px', background: '#3b82f6', color: 'white', padding: '14px', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>
                {isPremium ? 'Renew / Manage Plan' : 'Resume Courses (Subscribe)'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <h3 style={{ fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '20px', fontWeight: 700 }}>Payment History</h3>
      <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
              <th style={{ padding: '20px', fontWeight: 600, color: '#64748b', fontSize: '0.95rem' }}>Invoice ID</th>
              <th style={{ padding: '20px', fontWeight: 600, color: '#64748b', fontSize: '0.95rem' }}>Date</th>
              <th style={{ padding: '20px', fontWeight: 600, color: '#64748b', fontSize: '0.95rem' }}>Amount</th>
              <th style={{ padding: '20px', fontWeight: 600, color: '#64748b', fontSize: '0.95rem' }}>Method</th>
              <th style={{ padding: '20px', fontWeight: 600, color: '#64748b', fontSize: '0.95rem', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((payment, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '20px', fontWeight: 600, color: 'var(--navy)' }}>{payment.id}</td>
                <td style={{ padding: '20px', color: '#475569' }}>{payment.date}</td>
                <td style={{ padding: '20px', fontWeight: 600, color: '#0f172a' }}>₹{payment.amount}</td>
                <td style={{ padding: '20px', color: '#475569' }}>{payment.method}</td>
                <td style={{ padding: '20px', textAlign: 'right' }}>
                  <button style={{ background: 'transparent', border: '1px solid #cbd5e1', color: '#334155', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                    Download Invoice
                  </button>
                </td>
              </tr>
            ))}
            {paymentHistory.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No payment history found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Subscription;
