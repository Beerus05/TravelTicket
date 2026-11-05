import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Ticket {
  id: string;
  from: string;
  to: string;
  brand: string;
  code: string;
  type: 'flight' | 'bus' | 'train' | string;
  departureTime: string;
  duration: string;
  price: number;
  availableSeats?: number;
  bookedSeats?: string[];
  description?: string;
  image?: string;
}

export interface Booking {
  id?: string;
  ticketId: string;
  ticketCode: string;
  route: string;
  departureTime: string;
  passengerName: string;
  passengerPhone: string;
  seats: string[];
  totalPrice: number;
  status: 'Confirmed' | 'Completed' | 'Cancelled' | string;
  createdAt?: string;
}

interface BookingState {
  user: { name: string; email: string } | null;
  selectedTicket: Ticket | null;
  selectedSeats: string[];
  themeMode: 'light' | 'dark';
}

const initialState: BookingState = {
  user: { name: 'Nguyễn Đình Phi', email: 'phi@student.iuh.edu.vn' },
  selectedTicket: null,
  selectedSeats: [],
  themeMode: 'light',
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ name: string; email: string } | null>) => {
      state.user = action.payload;
    },
    setSelectedTicket: (state, action: PayloadAction<Ticket | null>) => {
      state.selectedTicket = action.payload;
      state.selectedSeats = []; // Reset ghế khi chọn chuyến mới
    },
    toggleSeat: (state, action: PayloadAction<string>) => {
      const seat = action.payload;
      if (state.selectedSeats.includes(seat)) {
        state.selectedSeats = state.selectedSeats.filter((s) => s !== seat);
      } else {
        state.selectedSeats.push(seat);
      }
    },
    clearBookingDraft: (state) => {
      state.selectedTicket = null;
      state.selectedSeats = [];
    },
    toggleTheme: (state) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
    },
  },
});

export const { setUser, setSelectedTicket, toggleSeat, clearBookingDraft, toggleTheme } = bookingSlice.actions;
export default bookingSlice.reducer;

