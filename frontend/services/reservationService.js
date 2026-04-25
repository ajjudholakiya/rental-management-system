import axiosInstance from '../lib/axios';

export const reservationService = {
  checkAvailability: async (productId, startDate, endDate) => {
    const params = new URLSearchParams({ productId, startDate, endDate });
    const response = await axiosInstance.get(
      `/reservations/check-reservation-availability?${params.toString()}`
    );
    return response.data;
  }
};
