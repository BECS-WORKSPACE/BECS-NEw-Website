import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createRazorpayOrder, verifyRazorpayPayment, createEnquiry } from '../api';

const Enrollment = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  const selectedCourse = location.state?.course;

  const [enrollFormData, setEnrollFormData] = useState({ name: '', email: '', phone: '', highestQualification: '', preparingFor: '', address: '', pinCode: '', city: '', state: '', acceptTerms: false });
  const [enrollSubmitted, setEnrollSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!selectedCourse) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Course not found</h2>
        <button className="btn-outline-sm" onClick={() => navigate('/')}>Return Home</button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
        <h2 className="responsive-heading" style={{ fontFamily: 'Outfit', color: 'var(--primary)', marginBottom: '16px' }}>Authentication Required</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '30px' }}>Please login or sign up to enroll in a course.</p>
        <Link to="/login" className="btn-solid-lg" style={{ textDecoration: 'none' }}>Login / Sign Up</Link>
      </div>
    );
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!enrollFormData.acceptTerms) {
      alert('Please accept the Terms & Conditions.');
      return;
    }
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Failed to load Razorpay SDK. Please check your internet connection.');
        return;
      }

      const orderRes = await createRazorpayOrder({ amount: 999 });
      const razorpayOrder = orderRes.data || orderRes;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'your_public_key_here',
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'EduVerse Premium',
        description: `Enrollment: ${selectedCourse.title}`,
        image: 'https://images.unsplash.com/photo-1546410531-bea5aad142bb?auto=format&fit=crop&w=100&q=80',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            const verifyRes = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: String(selectedCourse.id || selectedCourse._id),
            });

            if (verifyRes.data?.success || verifyRes.success) {
              await createEnquiry({
                name: enrollFormData.name,
                email: enrollFormData.email,
                phone: enrollFormData.phone,
                courseId: String(selectedCourse.id || selectedCourse._id),
                courseName: selectedCourse.title,
                type: 'Enrollment',
                highestQualification: enrollFormData.highestQualification,
                preparingFor: enrollFormData.preparingFor,
                address: enrollFormData.address,
                pinCode: enrollFormData.pinCode,
                city: enrollFormData.city,
                state: enrollFormData.state,
                paymentId: response.razorpay_payment_id
              });
              
              if (user) {
                const updatedUser = {
                  ...user,
                  enrolledCourses: [...(user.enrolledCourses || []), String(selectedCourse.id || selectedCourse._id)]
                };
                setUser(updatedUser);
                localStorage.setItem('becs_user', JSON.stringify(updatedUser));
              }

              setEnrollSubmitted(true);
              window.scrollTo(0, 0);
            } else {
              alert('Payment Verification Failed!');
            }
          } catch (err) {
            console.error(err);
            alert('Error verifying payment.');
          }
        },
        prefill: {
          name: enrollFormData.name,
          email: enrollFormData.email,
          contact: enrollFormData.phone
        },
        theme: { color: '#4F46E5' }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      alert(err.message || 'Failed to initialize payment. Please try again.');
    }
  };

  if (enrollSubmitted) {
    return (
      <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', background: 'var(--surface)', padding: '50px', borderRadius: '20px', border: '1px solid var(--border)', maxWidth: '600px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
          <h2 className="responsive-heading" style={{ fontFamily: 'Outfit', color: 'var(--primary)', marginBottom: '16px' }}>Enrollment Successful!</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '30px', lineHeight: '1.6' }}>
            Thank you, <strong>{enrollFormData.name}</strong>. Your enrollment for <strong>{selectedCourse.title}</strong> is complete. A receipt has been generated. You now have access to Career & Psychological Counselling and can proceed to take the Scholarship Test.
          </p>
          <button className="btn-solid" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '60px 24px', minHeight: '80vh', maxWidth: '800px', margin: '0 auto' }}>
      <button className="btn-outline-sm" onClick={() => navigate(-1)} style={{ marginBottom: '30px' }}>
        ← Back to Course
      </button>
      <h1 className="responsive-heading" style={{ fontFamily: 'Outfit', color: 'var(--primary)', marginBottom: '10px' }}>Enrollment Form</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '40px' }}>You are enrolling in <strong>{selectedCourse.title}</strong> at <strong>{selectedCourse.center}</strong>. Fee: ₹999.</p>

      <form onSubmit={handleSubmit} className="enroll-form" style={{ background: 'var(--surface)', padding: '40px', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
        <div className="form-grid">
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--primary)' }}>Student Name</label>
            <input type="text" required placeholder="John Doe" value={enrollFormData.name} onChange={e => setEnrollFormData({ ...enrollFormData, name: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--primary)' }}>Email Address</label>
            <input type="email" required placeholder="john@example.com" value={enrollFormData.email} onChange={e => setEnrollFormData({ ...enrollFormData, email: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
          </div>
        </div>

        <div className="form-grid" style={{ marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--primary)' }}>Phone Number</label>
            <input type="tel" required placeholder="+91 98765 43210" value={enrollFormData.phone} onChange={e => setEnrollFormData({ ...enrollFormData, phone: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--primary)' }}>Highest Qualification</label>
            <input type="text" required placeholder="12th, B.Tech, etc." value={enrollFormData.highestQualification} onChange={e => setEnrollFormData({ ...enrollFormData, highestQualification: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--primary)' }}>Preparing For</label>
          <select required value={enrollFormData.preparingFor} onChange={e => setEnrollFormData({ ...enrollFormData, preparingFor: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem', background: 'var(--surface)' }}>
            <option value="">Select Course</option>
            <option value="Government Exam Preparation">Government Exam Preparation</option>
            <option value="Joint Entrance Preparation">Joint Entrance Preparation</option>
            <option value="Board Exam (Class 10)">Board Exam (Class 10)</option>
            <option value="Board Exam (Class 11-12)">Board Exam (Class 11-12)</option>
          </select>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--primary)' }}>Address</label>
          <input type="text" required placeholder="Street Address" value={enrollFormData.address} onChange={e => setEnrollFormData({ ...enrollFormData, address: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
        </div>

        <div className="form-grid" style={{ marginBottom: '40px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--primary)' }}>PIN Code</label>
            <input type="text" required placeholder="700001" value={enrollFormData.pinCode} onChange={e => setEnrollFormData({ ...enrollFormData, pinCode: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--primary)' }}>City</label>
            <input type="text" required placeholder="Kolkata" value={enrollFormData.city} onChange={e => setEnrollFormData({ ...enrollFormData, city: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--primary)' }}>State</label>
            <input type="text" required placeholder="West Bengal" value={enrollFormData.state} onChange={e => setEnrollFormData({ ...enrollFormData, state: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
          </div>
        </div>
        
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input type="checkbox" id="acceptTerms" required checked={enrollFormData.acceptTerms} onChange={e => setEnrollFormData({ ...enrollFormData, acceptTerms: e.target.checked })} style={{ width: '20px', height: '20px' }} />
          <label htmlFor="acceptTerms" style={{ fontSize: '1rem', color: 'var(--text)' }}>I accept the Terms & Conditions</label>
        </div>

        <button type="submit" className="btn-solid-lg" style={{ width: '100%', textAlign: 'center' }}>
          Proceed to Razorpay (Pay ₹999)
        </button>
      </form>
    </div>
  );
};

export default Enrollment;
