import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const CourseSubscription = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const discount = user?.scholarshipDiscount || 0;
  const basePrice = 4999;
  const finalPrice = Math.max(0, basePrice - (basePrice * (discount / 100)));

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

  const handleSubscriptionPayment = async () => {
    setIsLoading(true);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        setIsLoading(false);
        return;
      }

      const orderRes = await api.post('/payments/create-subscription-order');
      const orderData = orderRes.data;

      const options = {
        key: orderData.key || 'rzp_test_dummy_key', // Get from backend
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'EduVerse',
        description: 'EduVerse Course Subscription (30 Days)',
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              purpose: 'course_subscription'
            });

            // Update validUntil in local state
            const validUntil = new Date();
            validUntil.setDate(validUntil.getDate() + 30);
            
            const updatedUser = { ...user, isPremium: true, subscriptionValidUntil: validUntil.toISOString() };
            setUser(updatedUser);
            localStorage.setItem('becs_user', JSON.stringify(updatedUser));
            
            navigate('/dashboard');
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
          color: '#3b82f6'
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
    return null;
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#f8fafc' }}>
      <div style={{ width: '100%', maxWidth: '800px', background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'Outfit', color: '#1e293b', marginBottom: '8px' }}>Course Subscription</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Unlock full access to all courses, live classes, and premium study materials for 30 days.</p>
        </div>

        <div style={{ background: '#f1f5f9', padding: '30px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>Subscription Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Base Price</p>
              <p style={{ fontWeight: 600, color: '#1e293b' }}>₹{basePrice}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Scholarship Discount</p>
              <p style={{ fontWeight: 600, color: '#10b981' }}>{discount}% OFF</p>
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Validity</p>
              <p style={{ fontWeight: 600, color: '#1e293b' }}>30 Days</p>
            </div>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', padding: '30px', borderRadius: '16px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Monthly Access Pass</h3>
            <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>Auto-renews every 30 days (Simulated)</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            {discount > 0 && (
              <p style={{ textDecoration: 'line-through', opacity: 0.6, fontSize: '1rem', marginBottom: '4px' }}>₹{basePrice}</p>
            )}
            <p style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff' }}>₹{finalPrice.toFixed(0)}</p>
          </div>
        </div>

        <button 
          onClick={handleSubscriptionPayment} 
          disabled={isLoading} 
          className="btn-solid-lg" 
          style={{ padding: '18px', fontSize: '1.2rem', borderRadius: '12px', background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          {isLoading ? 'Processing...' : `Pay ₹${finalPrice.toFixed(0)} Now`}
        </button>

      </div>
    </div>
  );
};

export default CourseSubscription;
