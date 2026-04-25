import axiosInstance from '../lib/axios';

export const returnService = {
  createReturn: async (rentalOrderId, payload) => {
    const response = await axiosInstance.post(
      `/returns/create-return/${rentalOrderId}`,
      payload
    );
    return response.data;
  },

  getByOrderId: async (rentalOrderId) => {
    const response = await axiosInstance.get(
      `/returns/get-return/${rentalOrderId}`
    );
    return response.data;
  }
};
