# Bản Thử 3 Kiểu Thao Tác Bài Toán (T-02)

Thuộc dự án **Gia sư AI tại nhà** — Phép cộng có nhớ trong phạm vi 100 ($27 + 15 = 42$).  
Mô-đun phụ trách: `voice-workspace`.

---

## 1. Cách mở nhanh (chỉ bằng 1 thao tác)

### Cách 1: Mở trực tiếp file HTML (Không cần cài đặt, không cần server)
- Nhấp đúp chuột vào file `index.html` trong thư mục này, hoặc kéo file `index.html` thả vào trình duyệt (Google Chrome, Microsoft Edge, Safari, Firefox).
- Đường dẫn file: `prototypes/thao-tac/index.html`

### Cách 2: Chạy máy chủ tĩnh bằng 1 lệnh duy nhất
Nếu muốn chạy qua HTTP local server:
```bash
npx serve prototypes/thao-tac
```
Hoặc dùng Python:
```bash
python -m http.server 8080 --directory prototypes/thao-tac
```
Sau đó truy cập: `http://localhost:8080` (hoặc cổng mà terminal hiển thị).

---

## 2. Mô tả 3 kiểu thao tác bài toán

### 🟡 Cách 1: Kéo thả que chục & khối đơn vị, gộp 10 đơn vị thành 1 chục
- **Mục tiêu sư phạm**: Giúp học sinh lớp 2 hình thành trực giác về hệ thập phân và bản chất của phép cộng "có nhớ".
- **Biểu diễn số**:
  - Số $27$: 2 que chục ($2 \times 10$) và 7 khối đơn vị vuông.
  - Số $15$: 1 que chục ($1 \times 10$) và 5 khối đơn vị vuông.
- **Thao tác**:
  - Trẻ có thể kéo thả bằng chuột trên PC hoặc ngón tay trên máy tính bảng (hỗ trợ Pointer Events chuẩn).
  - Có thể chạm/click vào que tính hoặc khối đơn vị để di chuyển nhanh vào bảng tính.
  - Khi hàng đơn vị có $\ge 10$ khối, nút **"✨ Gộp 10 đơn vị thành 1 chục"** sẽ sáng lên. Bấm vào nút này, 10 khối đơn vị sẽ gộp thành 1 que chục mới chuyển sang Cột Chục.
  - Kết quả sau khi gộp: 4 que chục và 2 khối đơn vị $\rightarrow 42$.
  - Có nút **🔄 Làm lại** để thực hành lại bất kỳ lúc nào mà không bị phạt hay chấm sai giữa chừng.

### 📝 Cách 2: Đặt tính theo cột có ô "nhớ"
- **Mục tiêu sư phạm**: Rèn luyện kỹ năng đặt tính rồi tính theo cột dọc chuẩn sách giáo khoa Toán tiểu học (GDPT 2018).
- **Giao diện**:
  - Đặt tính dọc số 27 cộng 15.
  - Có ô tròn **nhớ** ở phía trên hàng chục.
  - Có 2 ô kết quả hàng chục và hàng đơn vị.
- **Hỗ trợ thiết bị**:
  - Bàn phím số cảm ứng tích hợp (On-screen Keypad): Nút bấm lớn ($> 54\text{px}$), giúp trẻ dùng máy tính bảng thao tác tiện lợi mà không bị bàn phím ảo của hệ điều hành che khuất màn hình.
  - Hỗ trợ cả bàn phím máy tính thông thường (phím $0$–$9$, Backspace, Enter).
- **Phản hồi sư phạm**:
  - Không báo sai khi trẻ đang gõ dở từng ô.
  - Chỉ khi bấm nút **"✅ Kiểm tra kết quả"**, hệ thống mới đưa ra lời nhận xét nhẹ nhàng, phân tích rõ ràng (ví dụ: phát hiện trẻ quên cộng số nhớ sang hàng chục khi tính ra $32$).

### 🎯 Cách 3: Chọn 1 trong 4 đáp án (Trắc nghiệm)
- **Mục tiêu sư phạm**: Kiểm tra độ nhạy bén và nhận biết kết quả nhanh.
- **Đề bài**: $27 + 15 = ?$
- **4 đáp án**:
  - **A. 32**: Bẫy quên nhớ ($2 + 1 = 3$, $7 + 5 = 12$ ghi 2).
  - **B. 42**: Đáp án đúng.
  - **C. 41**: Lỗi tính toán hàng đơn vị.
  - **D. 52**: Lỗi nhớ nhầm thành 2 chục.
- **Thao tác**: Các nút lựa chọn to rõ (cao $> 68\text{px}$), bo góc, có highlight khi chọn. Trẻ có thể đổi ý chọn đáp án khác trước khi bấm nút kiểm tra.

---

## 3. Khung theo dõi sự kiện (Debug Event Log)
- Nằm ở cuối trang, tự động ghi nhận **mọi thao tác của học sinh**:
  - Loại thao tác: chuyển tab, chạm vật phẩm, bắt đầu kéo, thả hợp lệ, thả ngoài vùng, gộp 10 đơn vị, chọn ô nhập, gõ chữ số, xóa số, chọn đáp án trắc nghiệm, bấm kiểm tra, làm lại...
  - Giá trị chi tiết: vị trí nguồn, vị trí đích, mã vật phẩm, chữ số đã nhập, đáp án đã chọn, chẩn đoán nguyên nhân lỗi...
  - Thời điểm: Giờ, phút, giây, mili-giây chính xác (`HH:mm:ss.SSS`).
- **Bảo mật & Quyền riêng tư**:
  - Dữ liệu lưu hoàn toàn *in-memory* trong trình duyệt, không gửi đến bất kỳ máy chủ hay dịch vụ bên ngoài nào.
  - Có nút **💾 Xuất JSON** để tải tệp nhật ký sự kiện kiểm thử và nút **🗑️ Xóa log**.

---

## 4. Danh sách trình duyệt đã thử nghiệm
- Google Chrome (Desktop & Mobile/Tablet emulation)
- Microsoft Edge (Desktop & Tablet emulation)
- Tương thích tốt trên màn hình máy tính để bàn và màn hình máy tính bảng 10-inch xoay ngang ($1024 \times 768$, $1180 \times 820$, $1280 \times 800$).
