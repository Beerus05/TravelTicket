import axios from 'axios';

// 1. Axios Instance cho MockAPI
export const api = axios.create({
  baseURL: 'https://6aec15e3ee39618d7bf8e287.mockapi.io',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Dữ liệu mẫu dự phòng khi MockAPI chưa được seed hoặc mất mạng
export const DEFAULT_TICKETS = [
  {
    id: '1',
    from: 'TP.HCM',
    to: 'Đà Lạt',
    brand: 'Phương Trang',
    code: 'FUTA-DL01',
    type: 'bus',
    departureTime: '08:00 - 15/11/2026',
    duration: '6h 30m',
    price: 320000,
    availableSeats: 16,
    bookedSeats: ['A1', 'B2'],
    description: 'Xe Limousine phòng nằm 34 phòng cao cấp, cổng sạc Type-C, wifi tốc độ cao, nước suối và khăn lạnh miễn phí.',
  },
  {
    id: '2',
    from: 'TP.HCM',
    to: 'Đà Lạt',
    brand: 'Vietnam Airlines',
    code: 'VN-1380',
    type: 'flight',
    departureTime: '09:30 - 15/11/2026',
    duration: '50m',
    price: 1250000,
    availableSeats: 8,
    bookedSeats: ['A2', 'C1'],
    description: 'Chuyến bay thẳng Airbus A321, 23kg hành lý ký gửi, suất ăn nhẹ trên chuyến bay và hỗ trợ check-in online nhanh.',
  },
  {
    id: '3',
    from: 'TP.HCM',
    to: 'Nha Trang',
    brand: 'Đường sắt Việt Nam',
    code: 'SE4',
    type: 'train',
    departureTime: '19:00 - 16/11/2026',
    duration: '7h 45m',
    price: 480000,
    availableSeats: 12,
    bookedSeats: ['A3', 'C3'],
    description: 'Tàu hỏa Thống Nhất SE4, khoang 4 giường nằm mềm điều hòa, ngắm cảnh biển Bình Thuận - Khánh Hòa tuyệt đẹp.',
  },
  {
    id: '4',
    from: 'Hà Nội',
    to: 'Đà Nẵng',
    brand: 'Vietjet Air',
    code: 'VJ-501',
    type: 'flight',
    departureTime: '06:15 - 17/11/2026',
    duration: '1h 20m',
    price: 890000,
    availableSeats: 20,
    bookedSeats: ['B1'],
    description: 'Vé máy bay giá rẻ, hành trình đúng giờ, tiện lợi cho các chuyến du lịch biển miền Trung.',
  },
  {
    id: '5',
    from: 'Hà Nội',
    to: 'Sapa',
    brand: 'Sao Việt Limousine',
    code: 'SV-SP09',
    type: 'bus',
    departureTime: '22:00 - 18/11/2026',
    duration: '5h 30m',
    price: 400000,
    availableSeats: 10,
    bookedSeats: ['A4', 'B4'],
    description: 'Cabin đôi cao cấp, chạy đường cao tốc Hà Nội - Lào Cai êm ái, đón trả tận nơi tại trung tâm thị xã Sapa.',
  },
  {
    id: '6',
    from: 'TP.HCM',
    to: 'Phan Thiết',
    brand: 'Tàu SPT2',
    code: 'SPT2',
    type: 'train',
    departureTime: '06:45 - 19/11/2026',
    duration: '3h 50m',
    price: 250000,
    availableSeats: 18,
    bookedSeats: ['C2'],
    description: 'Tàu du lịch Sài Gòn - Phan Thiết chuyên dụng, ghế ngồi mềm điều hòa, phục vụ ăn sáng nhẹ.',
  },
];

// Danh sách Booking trong bộ nhớ để đồng bộ trạng thái đặt ghế lập tức
export let LOCAL_BOOKINGS: any[] = [
  {
    id: '1001',
    ticketId: '1',
    ticketCode: 'FUTA-DL01',
    route: 'TP.HCM ➔ Đà Lạt',
    departureTime: '08:00 - 15/11/2026',
    passengerName: 'Nguyễn Đình Phi',
    passengerEmail: 'phi@student.iuh.edu.vn',
    passengerPhone: '0901234567',
    seats: ['A1', 'B2'],
    totalPrice: 640000,
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
  },
  {
    id: '1002',
    ticketId: '2',
    ticketCode: 'VN-1380',
    route: 'TP.HCM ➔ Đà Lạt',
    departureTime: '09:30 - 15/11/2026',
    passengerName: 'Nguyễn Đình Phi',
    passengerEmail: 'phi@student.iuh.edu.vn',
    passengerPhone: '0901234567',
    seats: ['A2', 'C1'],
    totalPrice: 2500000,
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
  },
];

// Thêm booking mới vào bộ nhớ cục bộ và khóa các ghế vừa đặt
export const addLocalBooking = (booking: any) => {
  const newBooking = {
    ...booking,
    id: booking.id || Math.floor(1000 + Math.random() * 9000).toString(),
    passengerEmail: booking.passengerEmail || '',
    status: booking.status || 'Confirmed',
    createdAt: booking.createdAt || new Date().toISOString(),
  };

  const existingIdx = LOCAL_BOOKINGS.findIndex((b) => b.id === newBooking.id);
  if (existingIdx >= 0) {
    LOCAL_BOOKINGS[existingIdx] = newBooking;
  } else {
    LOCAL_BOOKINGS.unshift(newBooking);
  }

  // Khóa ghế trong DEFAULT_TICKETS
  const ticket = DEFAULT_TICKETS.find(
    (t) => String(t.id) === String(newBooking.ticketId) || t.code === newBooking.ticketCode
  );
  if (ticket) {
    const seatsToBook: string[] = Array.isArray(newBooking.seats) ? newBooking.seats : [newBooking.seats];
    ticket.bookedSeats = Array.from(new Set([...(ticket.bookedSeats || []), ...seatsToBook]));
    ticket.availableSeats = Math.max(0, 24 - ticket.bookedSeats.length);
  }

  return newBooking;
};

// Hủy booking và giải phóng ghế để người khác có thể đặt lại
export const cancelLocalBooking = (id: string) => {
  const booking = LOCAL_BOOKINGS.find((b) => String(b.id) === String(id));
  if (booking) {
    booking.status = 'Cancelled';
    const ticket = DEFAULT_TICKETS.find(
      (t) => String(t.id) === String(booking.ticketId) || t.code === booking.ticketCode
    );
    if (ticket && ticket.bookedSeats) {
      const seatsToFree: string[] = Array.isArray(booking.seats) ? booking.seats : [booking.seats];
      ticket.bookedSeats = ticket.bookedSeats.filter((s) => !seatsToFree.includes(s));
      ticket.availableSeats = Math.max(0, 24 - ticket.bookedSeats.length);
    }
  }
};

// Interceptor xử lý fallback tự động và đồng bộ trạng thái với MockAPI
api.interceptors.response.use(
  (response) => {
    // Nếu get /tickets trả về mảng rỗng, fallback sang DEFAULT_TICKETS
    if (response.config.url?.endsWith('/tickets') && (!response.data || response.data.length === 0)) {
      return { ...response, data: DEFAULT_TICKETS };
    }
    // Nếu get /bookings trả về mảng rỗng, fallback sang LOCAL_BOOKINGS
    if (response.config.url?.endsWith('/bookings') && (!response.data || response.data.length === 0)) {
      return { ...response, data: LOCAL_BOOKINGS };
    }
    return response;
  },
  (error) => {
    const url = error.config?.url || '';
    const method = (error.config?.method || 'get').toLowerCase();

    // Fallback cho Tickets
    if (url.includes('/tickets')) {
      if (url.match(/\/tickets\/\w+/)) {
        const id = url.split('/').pop();
        const item = DEFAULT_TICKETS.find((t) => t.id === id) || DEFAULT_TICKETS[0];
        return Promise.resolve({ data: item, status: 200, statusText: 'OK', headers: {}, config: error.config });
      }
      return Promise.resolve({ data: DEFAULT_TICKETS, status: 200, statusText: 'OK', headers: {}, config: error.config });
    }

    // Fallback cho Bookings
    if (url.includes('/bookings')) {
      if (method === 'post') {
        const body = typeof error.config?.data === 'string' ? JSON.parse(error.config.data) : error.config?.data;
        const saved = addLocalBooking(body);
        return Promise.resolve({ data: saved, status: 201, statusText: 'Created', headers: {}, config: error.config });
      }
      if (method === 'delete') {
        const id = url.split('/').pop();
        if (id) cancelLocalBooking(id);
        return Promise.resolve({ data: { success: true }, status: 200, statusText: 'OK', headers: {}, config: error.config });
      }
      if (url.match(/\/bookings\/\w+/)) {
        const id = url.split('/').pop();
        const found = LOCAL_BOOKINGS.find((b) => String(b.id) === String(id));
        if (found) {
          return Promise.resolve({ data: found, status: 200, statusText: 'OK', headers: {}, config: error.config });
        }
      }
      return Promise.resolve({ data: LOCAL_BOOKINGS, status: 200, statusText: 'OK', headers: {}, config: error.config });
    }

    return Promise.reject(error);
  }
);

// 2. Hàm gọi AI Basic (Gemini API qua Axios với fallback thông minh)
export const askTravelAI = async (prompt: string, availableTickets: any[]) => {
  const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
  
  if (GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY') {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      const systemPrompt = `Bạn là trợ lý đặt vé du lịch thông minh của ứng dụng Travel Ticket.
Dữ liệu vé hiện có trong hệ thống: ${JSON.stringify(availableTickets)}.
Hãy tư vấn ngắn gọn lịch trình (khoảng 2-3 câu) và gợi ý mã vé (mã code và hãng xe/máy bay) phù hợp nhất với yêu cầu: "${prompt}"`;

      const response = await axios.post(
        url,
        { contents: [{ parts: [{ text: systemPrompt }] }] },
        { timeout: 8000 }
      );

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (err) {
      console.warn('Lỗi gọi Gemini API trực tiếp, kích hoạt thuật toán gợi ý nội bộ:', err);
    }
  }

  // AI Thông minh nội bộ (Rule-based Travel AI Engine)
  const lowerPrompt = prompt.toLowerCase();
  const matched = availableTickets.filter((t) => {
    return (
      lowerPrompt.includes(t.to.toLowerCase()) ||
      lowerPrompt.includes(t.from.toLowerCase()) ||
      (lowerPrompt.includes('máy bay') && t.type === 'flight') ||
      (lowerPrompt.includes('xe') && t.type === 'bus') ||
      (lowerPrompt.includes('tàu') && t.type === 'train') ||
      (lowerPrompt.includes('rẻ') && Number(t.price) <= 500000)
    );
  });

  const topPick = matched.length > 0 ? matched[0] : availableTickets[0] || DEFAULT_TICKETS[0];
  const priceFormatted = Number(topPick.price).toLocaleString('vi-VN');

  return `🤖 [Trợ lý AI Travel Ticket]:
Với nhu cầu "${prompt}", mình đề xuất bạn chuyến:
✨ **${topPick.from} ➔ ${topPick.to}** cùng hãng **${topPick.brand}** (Mã: **${topPick.code}**).
💰 Giá chỉ từ **${priceFormatted} đ**, khởi hành lúc ${topPick.departureTime}.
💡 Mẹo: Bạn có thể vào tab "Tìm kiếm" hoặc chạm vào chuyến đi trên Trang chủ để chọn ghế và đặt vé ngay nhé!`;
};

