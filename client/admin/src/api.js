import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('becs_admin'));
  if (user && user.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export const fetchStats = () => API.get('/admin/stats');
export const fetchAllOrders = () => API.get('/admin/orders');
export const updateOrderStatus = (id, status) => API.put(`/admin/orders/${id}/status`, { status });
export const fetchAllUsers = () => API.get('/admin/users');
export const fetchAllProducts = () => API.get('/products');
export const updateProduct = (id, productData) => API.put(`/products/${id}`, productData);
export const createProduct = (productData) => API.post('/products', productData);
export const bulkCreateProducts = (productsList) => API.post('/products/bulk', productsList);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const login = (credentials) => API.post('/auth/login', credentials);

export const fetchContacts = () => API.get('/admin/contacts');
export const fetchEnquiries = () => API.get('/admin/enquiries');
export const fetchCourses = () => API.get('/courses');
export const updateEnquiryStatus = (id, status) => API.put(`/admin/enquiries/${id}/status`, { status });
export const deleteEnquiry = (id) => API.delete(`/admin/enquiries/${id}`);
export const deleteContact = (id) => API.delete(`/admin/contacts/${id}`);
export const createCourse = (data) => API.post('/admin/courses', data);
export const updateCourse = (id, data) => API.put(`/admin/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/admin/courses/${id}`);

export default API;
