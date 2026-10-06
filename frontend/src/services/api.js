import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('trustgate_jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Token management helpers
export const getStoredToken = () => localStorage.getItem('trustgate_jwt');
export const setStoredToken = (token) => localStorage.setItem('trustgate_jwt', token);
export const removeStoredToken = () => {
  localStorage.removeItem('trustgate_jwt');
  localStorage.removeItem('trustgate_user');
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('trustgate_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user) => {
  localStorage.setItem('trustgate_user', JSON.stringify(user));
};

// Check backend health
export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/api/health');
    return { ok: true, data: response.data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

// Authentication
export const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    if (response.data?.token) {
      setStoredToken(response.data.token);
      setStoredUser({ email });
    }
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const register = async (email, password) => {
  try {
    const response = await api.post('/api/auth/register', { email, password });
    return response.data;
  } catch (err) {
    throw err;
  }
};

// Security scan
export const scanText = async (text) => {
  if (!text || !text.trim()) {
    throw new Error('Enter some text before scanning.');
  }

  const token = getStoredToken();
  if (!token) {
    const err = new Error('Please log in before running a security scan.');
    err.isAuthError = true;
    throw err;
  }

  try {
    const response = await api.post('/api/security/scan', { text });
    return response.data;
  } catch (err) {
    if (!err.response) {
      throw new Error('Unable to reach the TrustGate backend. Make sure the backend is running.');
    }
    if (err.response.status === 401) {
      removeStoredToken();
      throw new Error('Authentication required. Please log in.');
    }
    if (err.response.status === 400) {
      throw new Error('Please enter valid text to scan.');
    }
    if (err.response.status === 500) {
      throw new Error('TrustGate encountered a server error.');
    }
    throw new Error(err.response.data?.message || 'TrustGate encountered an error.');
  }
};

export default api;
