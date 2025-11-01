import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Public endpoints
export const publicAPI = {
  getPublicData: () => api.get('/api/public'),
  getHealth: () => api.get('/api/public/health'),
};

// Secure endpoints
export const secureAPI = {
  getSecureData: () => api.get('/api/secure'),
  getProfile: () => api.get('/api/secure/profile'),
  updateProfile: (data) => api.put('/api/secure/profile', data),
  
  // Tasks
  getTasks: () => api.get('/api/secure/tasks'),
  createTask: (task) => api.post('/api/secure/tasks', task),
  updateTask: (id, task) => api.put(`/api/secure/tasks/${id}`, task),
  deleteTask: (id) => api.delete(`/api/secure/tasks/${id}`),
};

// Admin endpoints
export const adminAPI = {
  getUsers: () => api.get('/api/secure/admin/users'),
  getTasks: () => api.get('/api/secure/admin/tasks'),
  getStats: () => api.get('/api/secure/admin/stats'),
  deleteUser: (id) => api.delete(`/api/secure/admin/users/${id}`),
};

export default api;
