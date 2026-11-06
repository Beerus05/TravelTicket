import { api, DEFAULT_TICKETS, LOCAL_BOOKINGS, addLocalBooking, cancelLocalBooking } from './api';
import { Ticket, Booking } from '../store/bookingSlice';

// Hàm tính toán số ghế trống và danh sách ghế đã đặt theo thời gian thực
export const getTicketWithDynamicSeats = (ticket: any, bookings: any[] = LOCAL_BOOKINGS): Ticket => {
  if (!ticket) return ticket;
  const seatSet = new Set<string>(ticket.bookedSeats || []);

  bookings.forEach((b: any) => {
    const isMatch =
      (b.ticketId && String(b.ticketId) === String(ticket.id)) ||
      (b.ticketCode && b.ticketCode === ticket.code);
    if (isMatch && b.status !== 'Cancelled') {
      const seats = Array.isArray(b.seats) ? b.seats : [b.seats];
      seats.forEach((s: string) => {
        if (s) seatSet.add(s);
      });
    }
  });

  const bookedSeats = Array.from(seatSet);
  const totalSeats = ticket.totalSeats || 12;
  const availableSeats = Math.max(0, totalSeats - bookedSeats.length);

  return {
    ...ticket,
    totalSeats,
    bookedSeats,
    availableSeats,
  };
};

export const ticketService = {
  // Lấy danh sách tất cả chuyến vé (kèm số ghế trống tính toán chuẩn xác)
  getAllTickets: async (): Promise<Ticket[]> => {
    let list = DEFAULT_TICKETS;
    try {
      const response = await api.get('/tickets');
      if (response.data && response.data.length > 0) {
        list = response.data;
      }
    } catch {
      list = DEFAULT_TICKETS;
    }
    const bookings = await ticketService.getAllBookings();
    return list.map((t) => getTicketWithDynamicSeats(t, bookings));
  },

  // Lấy chi tiết chuyến đi theo ID (kèm số ghế trống cập nhật)
  getTicketById: async (id: string): Promise<Ticket | null> => {
    let found: any = null;
    try {
      const response = await api.get(`/tickets/${id}`);
      if (response.data) found = response.data;
    } catch {
      found = null;
    }
    if (!found) {
      found = DEFAULT_TICKETS.find((t) => String(t.id) === String(id));
    }
    if (!found) return null;
    const bookings = await ticketService.getAllBookings();
    return getTicketWithDynamicSeats(found, bookings);
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

