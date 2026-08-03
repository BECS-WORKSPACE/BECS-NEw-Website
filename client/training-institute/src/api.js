const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchCourses = async () => {
  const res = await fetch(`${API_URL}/courses`);
  if (!res.ok) throw new Error('Failed to fetch courses');
  return res.json();
};

export const createEnquiry = async (enquiryData) => {
  const res = await fetch(`${API_URL}/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enquiryData),
  });
  if (!res.ok) throw new Error('Failed to submit enquiry');
  return res.json();
};

export const createRazorpayOrder = async (orderData) => {
  const user = JSON.parse(localStorage.getItem('becs_user'));
  const res = await fetch(`${API_URL}/payments/create-order`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...(user?.token && { 'Authorization': `Bearer ${user.token}` })
    },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error('Failed to create payment order');
  return res.json();
};

export const verifyRazorpayPayment = async (paymentData) => {
  const user = JSON.parse(localStorage.getItem('becs_user'));
  const res = await fetch(`${API_URL}/payments/verify`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...(user?.token && { 'Authorization': `Bearer ${user.token}` })
    },
    body: JSON.stringify(paymentData),
  });
  if (!res.ok) throw new Error('Payment verification failed');
  return res.json();
};

export const login = async (userData) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Login failed');
  }
  return res.json();
};

export const register = async (userData) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Registration failed');
  }
  return res.json();
};
