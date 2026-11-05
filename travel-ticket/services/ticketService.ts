import { api, DEFAULT_TICKETS, LOCAL_BOOKINGS, addLocalBooking, cancelLocalBooking } from './api';
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
      const found = DEFAULT_TICKETS.find((t) => String(t.id) === String(id));
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

  // Lấy danh sách bookings (tự động đồng bộ với các vé đã đặt)
  getAllBookings: async (): Promise<Booking[]> => {
    try {
      const response = await api.get('/bookings');
      return response.data && response.data.length > 0 ? response.data : LOCAL_BOOKINGS;
    } catch {
      return LOCAL_BOOKINGS;
    }
  },

  // Lấy chi tiết booking theo ID
  getBookingById: async (id: string): Promise<Booking | null> => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data;
    } catch {
      const found = LOCAL_BOOKINGS.find((b) => String(b.id) === String(id));
      return found || null;
    }
  },

  // Tạo booking mới và đồng bộ ghế đã đặt
  createBooking: async (booking: Booking): Promise<Booking> => {
    // Lưu ngay vào local memory để cập nhật ghế tức thì
    const localSaved = addLocalBooking(booking);
    try {
      const response = await api.post('/bookings', booking);
      return response.data || localSaved;
    } catch {
      return localSaved;
    }
  },

  // Hủy / Xóa booking và mở lại ghế trống
  cancelBooking: async (id: string): Promise<void> => {
    cancelLocalBooking(id);
    try {
      await api.delete(`/bookings/${id}`);
    } catch {
      // Đã giải phóng ghế trong bộ nhớ cục bộ
    }
  },
};

export default ticketService;

