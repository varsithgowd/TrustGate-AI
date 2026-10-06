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

// Security scan (Direct inspection)
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

// Protected AI Chat (Scans via TrustGate Security Engine then invokes Gemini LLM)
export const sendChatMessage = async (message) => {
  if (!message || !message.trim()) {
    throw new Error('Enter a message before sending.');
  }

  const token = getStoredToken();
  if (!token) {
    const err = new Error('Please log in before sending an AI request.');
    err.isAuthError = true;
    throw err;
  }

  try {
    const response = await api.post('/api/ai/chat', { message }, { timeout: 45000 });
    return response.data;
  } catch (err) {
    if (
      err.response?.status === 503 ||
      err.response?.data?.status === 503 ||
      err.response?.data?.error?.toLowerCase().includes('temporarily busy') ||
      err.response?.data?.message?.toLowerCase().includes('temporarily busy')
    ) {
      throw new Error('Gemini is temporarily busy. TrustGate is still protecting your request. Please try again in a moment.');
    }
    if (err.code === 'ECONNABORTED' || err.message?.toLowerCase().includes('timeout')) {
      throw new Error('Gemini is temporarily busy. TrustGate is still protecting your request. Please try again in a moment.');
    }
    if (!err.response) {
      throw new Error('Unable to reach the TrustGate backend. Make sure the backend is running.');
    }
    if (err.response.status === 401) {
      removeStoredToken();
      const authErr = new Error('Authentication required. Please log in.');
      authErr.isAuthError = true;
      throw authErr;
    }
    if (err.response.status === 400) {
      throw new Error(err.response.data?.message || 'Please enter valid text.');
    }
    if (err.response.status === 500) {
      throw new Error(err.response.data?.message || 'TrustGate encountered a server error.');
    }
    throw new Error(err.response.data?.message || err.response.data?.error || 'TrustGate encountered an error.');
  }
};

export default api;

