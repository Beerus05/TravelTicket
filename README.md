# 🎫 TRAVEL TICKET - ỨNG DỤNG ĐẶT VÉ DU LỊCH & TRỢ LÝ SĂN VÉ THÔNG MINH

> **Đồ án môn học:** Lập trình Thiết bị Di động (Mobile Application Development)  
> **Sinh viên thực hiện:** Nguyễn Đình Phi (MSSV: 21012345)  
> **Đơn vị đào tạo:** Trường Đại học Công Nghiệp TP. Hồ Chí Minh (IUH) - Khoa Công nghệ Thông tin  
> **Nền tảng:** React Native, Expo SDK 58, Expo Router, Tamagui Framework  

---

## 📖 1. Giới thiệu Dự án

**Travel Ticket** là ứng dụng di động đa nền tảng (iOS, Android, Web) hỗ trợ người dùng tìm kiếm, so sánh giá và đặt vé du lịch cho 3 loại hình phương tiện phổ biến: **Máy bay**, **Xe khách** và **Tàu hỏa**. 

Điểm nổi bật của ứng dụng là tích hợp **Trợ lý AI Du lịch (Google Gemini 2.5 Flash)** đóng vai trò như một tư vấn viên thông minh, gợi ý lịch trình phù hợp với ngân sách và đề xuất mã vé tối ưu nhất theo thời gian thực.

---

## 🚀 2. Các Công nghệ & Kiến trúc Áp dụng

| Công nghệ / Thư viện | Phiên bản | Vai trò & Ứng dụng trong dự án |
| :--- | :---: | :--- |
| **Expo & Expo Router** | `~58.0.30` | Quản lý điều hướng chuẩn File-based Routing (thư mục `app/`), hỗ trợ Deep Linking và Typed Routes. |
| **Tamagui UI** | `^3.2.2` | Hệ thống thiết kế UI primitives hiện đại (`YStack`, `XStack`, `Card`, `Button`, `Input`), hỗ trợ chuyển đổi giao diện **Dark / Light mode**. |
| **TanStack Query** | `^5.106.0` | Quản lý **Server State**: Gọi API, lưu cache, quản lý trạng thái loading/error, tự động re-fetch với `useMutation` & `invalidateQueries`. |
| **Redux Toolkit** | `^2.14.0` | Quản lý **Client State**: Lưu trữ thông tin người dùng đăng nhập (`user`), giỏ vé đang chọn (`selectedTicket`), ghế đang click (`selectedSeats`). |
| **Axios** | `^1.21.0` | Gọi REST API với cấu hình tập trung (`baseURL`, `timeout: 10000ms`) kèm cơ chế **Interceptor Fallback** dữ liệu khi mất mạng. |
| **Google Gemini API** | `2.5-flash` | Tính năng **AI Basic**: Chatbot tư vấn hành trình du lịch, áp dụng kỹ thuật Prompt Engineering kèm thuật toán Heuristic nội bộ. |
| **React Native SVG** | `15.16.0` | Hệ thống Icon vector thuần chuẩn sắc nét trên cả Web, iOS và Android, độc lập và tối ưu hiệu năng. |
| **Responsive Engine** | Hook chuẩn | Sử dụng `useWindowDimensions` tự động chuyển đổi bố cục từ **1 cột** (điện thoại dọc) sang **2 cột** (xoay ngang / Tablet). |
| **EAS Build** | `>= 12.0.0` | Đóng gói và phân phối ứng dụng qua Internet dưới dạng file cài đặt **Android APK** trực tiếp. |

---

## 📱 3. Danh mục 12 Màn hình & Quy trình Nghiệp vụ

```plaintext
travel-ticket/
├── app/
│   ├── index.tsx                 # 1. Onboarding / Giới thiệu ứng dụng
│   ├── (auth)/
│   │   ├── login.tsx             # 2. Đăng nhập tài khoản (lưu State vào Redux)
│   │   └── register.tsx          # 3. Đăng ký người dùng mới
│   ├── (tabs)/                   # Nhóm màn hình chính có thanh Bottom Tabs
│   │   ├── _layout.tsx           # Cấu hình Tab Navigation & Icon
│   │   ├── home.tsx              # 4. Trang chủ (Lọc Máy bay, Xe khách, Tàu hỏa & Vé nổi bật)
│   │   ├── search.tsx            # 5. Tìm kiếm vé đa tiêu chí & Lọc ngân sách giá vé
│   │   ├── ai-assistant.tsx      # 6. Trợ lý AI Du lịch (Chatbot Gemini)
│   │   ├── my-tickets.tsx        # 7. Vé của tôi (Quản lý lịch sử vé & Hủy vé trực tiếp)
│   │   └── profile.tsx           # 8. Hồ sơ cá nhân (Đổi theme Sáng/Tối & Đăng xuất)
│   ├── ticket/
│   │   └── [id].tsx              # 9. Chi tiết chuyến đi, tiện ích & chính sách hoàn hủy
│   └── booking/
│       ├── seat-selection.tsx    # 10. Sơ đồ chọn ghế ma trận (A1-C4) & Tính tiền thời gian thực
│       ├── checkout.tsx          # 11. Xác nhận đặt vé, nhập SĐT, áp voucher & Gửi POST Backend
│       └── e-ticket.tsx          # 12. Chi tiết Vé điện tử kèm mã QR Code Check-in
```

### 🔄 Luồng Đặt Vé Khép Kín:
1. **Tìm kiếm & Chọn chuyến:** Xem danh sách vé nổi bật tại Trang chủ hoặc Tìm kiếm &rarr; Chọn vé &rarr; Xem Chi tiết chuyến đi.
2. **Chọn chỗ ngồi:** Bấm "Tiếp tục" &rarr; Chọn ghế trên Sơ đồ ma trận trực quan (ghế đã đặt bị khóa, ghế đang chọn tính tổng tiền tự động).
3. **Thanh toán & Xuất vé:** Nhập số điện thoại hành khách &rarr; Áp dụng mã ưu đãi (ví dụ: `TRAVEL50` hoặc `IUH`) &rarr; Bấm "Thanh toán & Xuất vé".
4. **Nhận vé & Check-in:** Dữ liệu tự động đồng bộ vào Backend (MockAPI) &rarr; Xuất Vé điện tử (E-Ticket) với mã QR Code và mã đặt chỗ.

---

## 💻 4. Hướng dẫn Khởi chạy Dự án

### Yêu cầu môi trường
- Đã cài đặt **Node.js** (Khuyên dùng bản LTS từ v18 trở lên).
- Thiết bị di động đã cài đặt ứng dụng **Expo Go** (có sẵn trên App Store cho iOS hoặc Google Play cho Android).

### Bước 1: Cài đặt các gói phụ thuộc
Mở Terminal tại thư mục dự án và chạy:
```bash
npm install
```

### Bước 2: Khởi động máy chủ phát triển (Expo Metro Bundler)
```bash
npx expo start -c
```
*(Tham số `-c` giúp xóa sạch bộ nhớ cache Metro để nạp cấu hình mới nhất).*

### Bước 3: Trải nghiệm ứng dụng

#### 🌐 Cách 1: Chạy trực tiếp trên Trình duyệt Web
- Trong cửa sổ Terminal đang chạy, chỉ cần gõ phím **`w`**.
- Ứng dụng sẽ tự động mở tại địa chỉ: `http://localhost:8081`.
- Hỗ trợ đầy đủ các tính năng, có thể mở DevTools (F12) chuyển sang chế độ thiết bị di động (Responsive) để kiểm tra xoay ngang/dọc.

#### 📱 Cách 2: Chạy trên Điện thoại thật (Expo Go) qua Internet / Tunnel (Khuyên dùng)
Nếu điện thoại và máy tính khác mạng Wi-Fi hoặc dùng mạng 4G/5G, hãy khởi động với cờ `--tunnel`:
```bash
npx expo start --tunnel -c
```
- **Android:** Mở ứng dụng **Expo Go**, chọn "Scan QR Code" và quét mã QR trên Terminal.
- **iOS (iPhone/iPad):** Đăng nhập cùng tài khoản Expo trên máy tính (`npx expo login`) và trên app Expo Go, dự án sẽ tự động xuất hiện trong danh sách *Development servers*.

---

## 📦 5. Hướng dẫn Xuất file APK (EAS Build)

Dự án đã cấu hình sẵn file [eas.json](./eas.json) để xuất file cài đặt Android APK độc lập mà không cần đưa lên Google Play Store:

```bash
# 1. Đăng nhập tài khoản Expo Application Services
npx eas-cli@latest login

# 2. Thực hiện lệnh Build APK tự động trên Cloud
npx eas-cli@latest build -p android --profile preview
```

Sau khi quá trình build hoàn tất, hệ thống sẽ trả về đường link tải file `.apk` trực tiếp qua Internet để cài đặt lên mọi thiết bị Android.

---
