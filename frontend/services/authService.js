import axiosInstance from '../lib/axios';

export const authService = {
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  changePassword: async (passwords) => {
    const response = await axiosInstance.put(
      '/auth/change-password',
      passwords
    );
    return response.data;
  }
};
