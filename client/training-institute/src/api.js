import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for sending/receiving HttpOnly cookies
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use((config) => {
  const savedUser = localStorage.getItem('becs_user');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
    }
  }
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Handle 401 & Automatic Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Prevent infinite loops if the refresh endpoint itself fails
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        
        // Update user in localStorage with new token
        const savedUser = localStorage.getItem('becs_user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          user.token = res.data.token;
          localStorage.setItem('becs_user', JSON.stringify(user));
        }

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed (e.g., refresh token expired)
        localStorage.removeItem('becs_user');
        window.location.href = '/login'; // Force redirect to login
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const fetchCourses = async () => {
  const res = await api.get('/courses');
  return res.data;
};

export const fetchCourseById = async (id) => {
  const res = await api.get(`/courses/${id}`);
  return res.data;
};

export const createEnquiry = async (enquiryData) => {
  const res = await api.post('/enquiries', enquiryData);
  return res.data;
};

export const createRazorpayOrder = async (orderData) => {
  const res = await api.post('/payments/create-order', orderData);
  return res.data;
};

export const verifyRazorpayPayment = async (paymentData) => {
  const res = await api.post('/payments/verify', paymentData);
  return res.data;
};

export const login = async (userData) => {
  try {
    const res = await api.post('/auth/login', userData);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Login failed');
  }
};

export const register = async (userData) => {
  try {
    const res = await api.post('/auth/register', userData);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Registration failed');
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (err) {
    console.error('Logout error', err);
  }
};

export const fetchPricingConfig = async () => {
  const res = await api.get('/config/pricing');
  return res.data;
};

// Learning LMS APIs (V2 Video Tracking)
export const updateVideoProgress = async (data) => {
  const res = await api.post('/video/progress', data);
  return res.data;
};

export const getResumeData = async (lessonId) => {
  const res = await api.get(`/video/resume/${lessonId}`);
  return res.data;
};

export const createVideoNote = async (data) => {
  const res = await api.post('/video/notes', data);
  return res.data;
};

export const getVideoNotes = async (lessonId) => {
  const res = await api.get(`/video/notes/${lessonId}`);
  return res.data;
};

// Live Classes APIs
export const scheduleLiveClass = async (data) => {
  const res = await api.post('/live-classes/schedule', data);
  return res.data;
};

export const getInstructorLiveClasses = async () => {
  const res = await api.get('/live-classes/instructor');
  return res.data;
};

export const getCourseLiveClasses = async (courseId) => {
  const res = await api.get(`/live-classes/course/${courseId}`);
  return res.data;
};

// Exam & Assessment APIs
export const startTestAttempt = async (testId) => {
  const res = await api.post(`/tests/attempts/start/${testId}`);
  return res.data;
};

export const autoSaveTestAttempt = async (attemptId, data) => {
  const res = await api.put(`/tests/attempts/${attemptId}/autosave`, data);
  return res.data;
};

export const submitTestAttempt = async (attemptId) => {
  const res = await api.post(`/tests/attempts/${attemptId}/submit`);
  return res.data;
};

export const getTestResult = async (attemptId) => {
  const res = await api.get(`/tests/attempts/${attemptId}/result`);
  return res.data;
};

// --- ASSIGNMENT APIs ---
export const getCourseAssignments = async (courseId) => {
  const res = await api.get(`/assignments/course/${courseId}`);
  return res.data;
};

export const submitAssignment = async (assignmentId, data) => {
  const res = await api.post(`/assignments/submissions/${assignmentId}`, data);
  return res.data;
};

// --- DIGITAL LIBRARY APIs ---
export const searchLibrary = async (params) => {
  const res = await api.get('/library/search', { params });
  return res.data;
};

export const getLibraryResource = async (resourceId) => {
  const res = await api.get(`/library/${resourceId}`);
  return res.data;
};

export const toggleLibraryBookmark = async (resourceId) => {
  const res = await api.post(`/library/${resourceId}/bookmark`);
  return res.data;
};

// --- COMMUNITY & DISCUSSIONS APIs ---
export const getDiscussions = async (params) => {
  const res = await api.get('/discussions', { params });
  return res.data;
};

export const createDiscussion = async (data) => {
  const res = await api.post('/discussions', data);
  return res.data;
};

export const replyToDiscussion = async (discussionId, data) => {
  const res = await api.post(`/discussions/${discussionId}/reply`, data);
  return res.data;
};

// Legacy Course Progress (kept for backwards compatibility)
export const getCourseProgress = async (courseId) => {
  const res = await api.get(`/learning/progress/course/${courseId}`);
  return res.data;
};

export const addBookmark = async (data) => {
  const res = await api.post('/learning/bookmarks', data);
  return res.data;
};

export const getBookmarks = async (type = '') => {
  const res = await api.get(`/learning/bookmarks${type ? `?type=${type}` : ''}`);
  return res.data;
};

// Gamification & Analytics APIs
export const fetchAnalyticsSummary = async () => {
  const res = await api.get('/analytics/summary');
  return res.data;
};

export const recordLearningActivity = async (data) => {
  const res = await api.post('/analytics/record-activity', data);
  return res.data;
};

// Notification APIs
export const fetchNotifications = async () => {
  const res = await api.get('/notifications');
  return res.data;
};

export const markNotificationAsRead = async (id) => {
  const res = await api.put(`/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsAsRead = async () => {
  const res = await api.put('/notifications/read-all');
  return res.data;
};

export default api;
