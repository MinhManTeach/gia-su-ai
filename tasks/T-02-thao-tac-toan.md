# T-02 · Bản thử 3 kiểu thao tác bài Toán
Giao cho: Antigravity · Nhánh: antigravity/T-02 · Mô-đun: voice-workspace

## Mục tiêu
Trang web tĩnh chạy trên trình duyệt, cho trẻ làm phép cộng có nhớ (ví dụ 27 + 15) bằng 3 cách: (1) kéo thả que chục và khối đơn vị, gộp 10 đơn vị thành 1 chục; (2) nhập số vào ô đặt tính theo cột, có ô "nhớ"; (3) chọn 1 trong 4 đáp án. Chưa có giọng nói, chưa có AI.

## Phạm vi
Được sửa: `prototypes/thao-tac/**`
Không được sửa: mọi thư mục khác

## Tiêu chí nghiệm thu
- [ ] Mở được bằng file `index.html` hoặc một lệnh duy nhất ghi trong `prototypes/thao-tac/README.md`
- [ ] Cả 3 kiểu làm được bằng chuột trên máy tính và bằng ngón tay trên máy tính bảng (màn hình khoảng 10 inch, xoay ngang)
- [ ] Nút và vùng kéo thả đủ lớn cho tay trẻ (tối thiểu 48×48 px), chữ dễ đọc
- [ ] Ghi lại mỗi thao tác thành sự kiện (loại thao tác, giá trị, thời điểm) và hiện ra ở khung debug; không gửi đi đâu
- [ ] Nhập sai hoặc kéo nhầm thì cho làm lại, không báo "sai" ngay khi trẻ đang thao tác dở
- [ ] Không dùng thư viện trả phí, không cần đăng nhập

## Bằng chứng phải nộp trong PR
- Ảnh hoặc video cả 3 kiểu trên kích thước máy tính và máy tính bảng (dùng chế độ giả lập thiết bị của trình duyệt)
- Danh sách trình duyệt đã thử
