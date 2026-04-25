import axiosInstance from '../lib/axios';

export const rentalOrderService = {
  createOrder: async (quotationId) => {
    const response = await axiosInstance.post(
      `/rental-orders/confirm-quotation/${quotationId}`
    );
    return response.data;
  },

  getAll: async () => {
    const response = await axiosInstance.get(
      '/rental-orders/get-my-rental-orders'
    );
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(
      `/rental-orders/get-single-rental-order/${id}`
    );
    return response.data;
  }
};
