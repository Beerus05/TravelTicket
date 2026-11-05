import { api, DEFAULT_TICKETS } from './api';
import { Ticket, Booking } from '../store/bookingSlice';

export const ticketService = {
  // Lấy danh sách tất cả chuyến vé
  getAllTickets: async (): Promise<Ticket[]> => {
    try {
      const response = await api.get('/tickets');
      return response.data || DEFAULT_TICKETS;
    } catch {
      return DEFAULT_TICKETS;
    }
  },

  // Lấy chi tiết chuyến đi theo ID
  getTicketById: async (id: string): Promise<Ticket | null> => {
    try {
      const response = await api.get(`/tickets/${id}`);
      return response.data;
    } catch {
      const found = DEFAULT_TICKETS.find((t) => t.id === id);
      return found || null;
    }
  },

  // Tạo chuyến vé mới (POST)
  createTicket: async (ticket: Omit<Ticket, 'id'>): Promise<Ticket> => {
    const response = await api.post('/tickets', ticket);
    return response.data;
  },

  // Cập nhật chuyến vé (PUT)
  updateTicket: async (id: string, ticket: Partial<Ticket>): Promise<Ticket> => {
    const response = await api.put(`/tickets/${id}`, ticket);
    return response.data;
  },

  // Xóa chuyến vé (DELETE)
  deleteTicket: async (id: string): Promise<void> => {
    await api.delete(`/tickets/${id}`);
  },

  // Lấy danh sách bookings
  getAllBookings: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings');
    return response.data;
  },

  // Tạo booking mới
  createBooking: async (booking: Booking): Promise<Booking> => {
    const response = await api.post('/bookings', booking);
    return response.data;
  },

  // Hủy / Xóa booking
  cancelBooking: async (id: string): Promise<void> => {
    await api.delete(`/bookings/${id}`);
  },
};

export default ticketService;

