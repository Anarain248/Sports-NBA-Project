import { message } from 'antd';

const BASE_URL = '/api'; // adjust this based on your backend URL

export const apiClient = {
  get: async (endpoint: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Request failed');
      return response.json();
    } catch (error) {
      message.error('API request failed');
      throw error;
    }
  },

  post: async (endpoint: string, data: any) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Request failed');
      return response.json();
    } catch (error) {
      message.error('API request failed');
      throw error;
    }
  },

  // Add other methods (PUT, DELETE) as needed
}; 