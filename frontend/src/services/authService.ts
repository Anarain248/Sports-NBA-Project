import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export { axiosInstance };

// Add axios interceptor to include token in requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = async (userData: {
    username: string;
    password: string;
  }) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  };
  
  export const loginUser = async (credentials: { 
    username: string; 
    password: string; 
  }) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    // Store token after successful login
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  };
  
  // Fix the axios interceptor to use axiosInstance instead of global axios
  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

export const logoutUser = () => {
  localStorage.removeItem('token');
  window.location.href = '/';
};



