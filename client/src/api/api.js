import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Adds the token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- NEW & IMPORTANT: Response Interceptor ---
// This watches for incoming responses. If we get a 401 error,
// it means the token is bad, so we automatically log the user out.
api.interceptors.response.use(
  (response) => response, // If the response is successful, just pass it along
  (error) => {
    if (error.response && error.response.status === 401) {
      // If we get an Unauthorized error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Reload the page to reset the app state and redirect to login
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;