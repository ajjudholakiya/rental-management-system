import axiosInstance from '../lib/axios';

export const invoiceService = {
  createInvoice: async (rentalOrderId) => {
    const response = await axiosInstance.post(
      `/invoices/create-invoice/${rentalOrderId}`
    );
    return response.data;
  },

  getAll: async () => {
    const response = await axiosInstance.get('/invoices/get-my-invoices');
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(
      `/invoices/get-single-invoice/${id}`
    );
    return response.data;
  }
};
