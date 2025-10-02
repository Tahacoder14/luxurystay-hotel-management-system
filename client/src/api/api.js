import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://luxurystay-hotel-management-system.vercel.app/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request Interceptor: This attaches the auth token to every request. (This part is correct)
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

// --- THE DEFINITIVE AUTHENTICATION FIX ---
// This is a "Response Interceptor". It watches every response from the server.
api.interceptors.response.use(
  (response) => response, // If the response is successful (2xx status), just pass it through.
  (error) => {
    // If the server responds with a 401 Unauthorized (meaning the token is expired or invalid)
    if (error.response && error.response.status === 401) {
      // 1. Remove the bad user data and token from storage.
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // 2. Force a page reload to the login screen.
      // This is the professional way to reset the application state.
      window.location.href = '/login'; 
      
      // You can also add a query param to show a message, e.g., '/login?sessionExpired=true'
    }
    // For all other errors, just pass them along to be handled by the component.
    return Promise.reject(error);
  }
);

export default api;