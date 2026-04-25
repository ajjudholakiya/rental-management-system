import axiosInstance from '../lib/axios';

export const productService = {
  getAll: async () => {
    const response = await axiosInstance.get('/products/fetch-products');
    return response.data;
  },

  getVendorProducts: async () => {
    const response = await axiosInstance.get('/products/vendor-products');
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(
      `/products/fetch-single-product/${id}`
    );
    return response.data;
  },

  remove: async (id) => {
    const response = await axiosInstance.delete(
      `/products/remove-product/${id}`
    );
    return response.data;
  }
};
