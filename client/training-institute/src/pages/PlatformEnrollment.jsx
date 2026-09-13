import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const PlatformEnrollment = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
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

  const handleEnrollmentPayment = async () => {
    setIsLoading(true);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        setIsLoading(false);
        return;
      }

      // We need to fetch via API with auth token
      const token = JSON.parse(localStorage.getItem('becs_user'))?.token;
      
      const orderRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/payments/create-enrollment-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({})
      });
      
      if (!orderRes.ok) {
        const errorData = await orderRes.json();
        throw new Error(errorData.message || 'Could not create order');
      }

      const orderData = await orderRes.json();

      const options = {
        key: orderData.key || 'rzp_test_dummy_key', // Get from backend
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'EduVerse',
        description: 'EduVerse Enrollment — One Time',
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                purpose: 'platform_enrollment'
              })
            });

            if (verifyRes.ok) {
              const updatedUser = { ...user, enrollmentStatus: 'ENROLLED' };
              setUser(updatedUser);
              localStorage.setItem('becs_user', JSON.stringify(updatedUser));
              navigate('/dashboard');
            } else {
              alert('Payment verification failed.');
            }
          } catch (err) {
            console.error(err);
            alert('Payment verification error.');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone
        },
        theme: {
          color: '#e6223b'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Payment initiation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2>Authentication Required</h2>
        <button onClick={() => navigate('/login')} className="btn-solid-lg">Login</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#f8fafc' }}>
      <div style={{ width: '100%', maxWidth: '800px', background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'Outfit', color: '#1e293b', marginBottom: '8px' }}>EduVerse Enrollment</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Complete your one-time enrollment to access the platform features.</p>
        </div>

        <div style={{ background: '#f1f5f9', padding: '30px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>Review Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Name</p>
              <p style={{ fontWeight: 600, color: '#1e293b' }}>{user.name}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Email</p>
              <p style={{ fontWeight: 600, color: '#1e293b' }}>{user.email}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Preparing For</p>
              <p style={{ fontWeight: 600, color: '#1e293b' }}>{user.preparingFor || 'N/A'}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>City</p>
              <p style={{ fontWeight: 600, color: '#1e293b' }}>{user.city || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '30px', borderRadius: '16px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>EduVerse Enrollment — One Time</h3>
            <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>Full access to Scholarships, Counselling, and Dashboard.</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ textDecoration: 'line-through', opacity: 0.6, fontSize: '1rem', marginBottom: '4px' }}>₹1,999</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981' }}>₹999</p>
          </div>
        </div>

        <button 
          onClick={handleEnrollmentPayment} 
          disabled={isLoading || user.enrollmentStatus === 'ENROLLED'} 
          className="btn-solid-lg" 
          style={{ padding: '18px', fontSize: '1.2rem', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          {isLoading ? 'Processing...' : user.enrollmentStatus === 'ENROLLED' ? 'Already Enrolled' : 'Pay ₹999 Now'}
        </button>

      </div>
    </div>
  );
};

export default PlatformEnrollment;
