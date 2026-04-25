import axiosInstance from '../lib/axios';

export const quotationService = {
  createQuotation: async (payload) => {
    const response = await axiosInstance.post(
      '/quotations/create-quotation',
      payload
    );
    return response.data;
  },

  addItem: async (quotationId, itemPayload) => {
    const response = await axiosInstance.post(
      `/quotations/add-product-to-quotation/${quotationId}/items`,
      itemPayload
    );
    return response.data;
  },

  updateItem: async (quotationId, itemId, quantity) => {
    const response = await axiosInstance.put(
      `/quotations/update-product-in-quotation/${quotationId}/items/${itemId}`,
      { quantity }
    );
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(
      `/quotations/get-single-quotation/${id}`
    );
    return response.data;
  },

  getAll: async () => {
    const response = await axiosInstance.get('/quotations/get-my-quotations');
    return response.data;
  }
};
