import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to include the auth token
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('becs_user'));
  if (user && user.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export const fetchProducts = () => API.get('/products');
export const fetchProduct = (id) => API.get(`/products/${id}`);
export const createOrder = (orderData) => API.post('/orders', orderData);
export const fetchMyOrders = () => API.get('/orders/myorders');
export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);
export const createPaymentIntent = (orderId) => API.post('/payments/create-intent', { orderId });

export default API;
