import axiosInstance from '../lib/axios';

export const paymentService = {
  payInvoice: async (invoiceId, payload) => {
    const response = await axiosInstance.post(
      `/payments/pay-invoice/${invoiceId}`,
      payload
    );
    return response.data;
  },

  getByInvoice: async (invoiceId) => {
    const response = await axiosInstance.get(
      `/payments/get-invoice-payments/${invoiceId}`
    );
    return response.data;
  }
};
