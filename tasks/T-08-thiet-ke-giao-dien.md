# T-08 · Thiết kế lại giao diện bản thử cho trẻ
Giao cho: Codex · Nhánh: codex/T-08 · Mô-đun: voice-workspace · Phụ thuộc: T-02 (đã merge)

## Mục tiêu
Làm lại phần nhìn của bản thử `prototypes/thao-tac` để trẻ lớp 2 dùng thoải mái trên máy tính bảng xoay ngang, theo các nguyên tắc thiết kế giao diện bên dưới. Giữ nguyên cách hoạt động: cùng 3 kiểu thao tác, cùng sự kiện ghi log, cùng lời gợi ý.

## Phạm vi
Được sửa: `prototypes/thao-tac/**`
Không được sửa: mọi thư mục khác. Trong `js/**` chỉ được đổi markup, tên class và thuộc tính trợ năng; không đổi logic chấm, sự kiện ghi log hay nội dung gợi ý.

## Nguyên tắc thiết kế (bắt buộc)
1. **Hợp đồng thiết kế trước khi code.** Viết `prototypes/thao-tac/THIET-KE.md` (tối đa 1 trang): việc chính của màn hình, thao tác chính của trẻ, các trạng thái (mới vào, đang làm, có gợi ý, làm đúng, kéo nhầm), quy tắc khi đổi cỡ màn hình, và những kiểu thiết kế không dùng.
2. **Token thiết kế.** Khai báo trên `:root` các biến màu theo vai trò (nền, bề mặt, chữ chính, chữ phụ, viền, nhấn, gợi ý, thành công), thang khoảng cách bội số 4 px, 2–3 mức bo góc và thang cỡ chữ. Ngoài phần khai báo token thì không viết mã màu hay số px tùy hứng.
3. **Tránh "giao diện kiểu AI".** Không dùng tím/chàm làm màu chủ đạo, không gradient trang trí, không đổ bóng nhiều lớp, không bo tròn mọi thứ, không lạm dụng emoji làm biểu tượng, không đệm rộng đều khắp nơi. Bố cục theo việc trẻ cần làm, không xếp lưới thẻ cho có.
4. **Tách màn hình của trẻ khỏi khung debug.** Mặc định trẻ chỉ thấy bài học. Khung debug chỉ hiện khi URL có `?debug=1`, và vẫn ghi log như cũ khi bị ẩn. Bỏ khỏi màn hình của trẻ các chữ dành cho người lớn như "Bản thử nghiệm T-02", "Mô-đun voice-workspace", "GDPT 2018".
5. **Chữ cho trẻ đọc.** Chữ đề bài và các con số to, rõ (ví dụ chữ thân bài ≥ 20 px, số trong phép tính ≥ 40 px), câu ngắn. Dùng font hệ thống, không tải font hay thư viện từ mạng.
6. **Màu và độ tương phản.** Chữ thường tương phản ≥ 4,5:1, chữ lớn ≥ 3:1. Không dùng màu làm tín hiệu duy nhất: trạng thái nào cũng có thêm chữ hoặc hình. Không dùng đỏ cho lần làm chưa đúng (ranh giới sản phẩm: không báo "sai" kiểu phạt).
7. **Vùng chạm.** Mọi nút, ô và vật kéo của trẻ tối thiểu 48×48 px, giữa các vùng chạm cách nhau tối thiểu 8 px.
8. **Bàn phím và trợ năng.** Tab đi qua được mọi điều khiển theo thứ tự hợp lý, viền tiêu điểm nhìn rõ. Tiêu đề h1 → h2 → h3 không nhảy cấp. Vùng thông báo kết quả có `aria-live="polite"`.
9. **Cỡ màn hình.** Ưu tiên máy tính bảng xoay ngang (1024×768, 1180×820, 1280×800), vẫn dùng được ở 768 px và 1440 px, không có thanh cuộn ngang. Bảng tính và vật kéo cùng nằm trong một màn hình khi xoay ngang.
10. **Chuyển động.** Hiệu ứng ngắn (≤ 200 ms), và tắt khi trình duyệt bật `prefers-reduced-motion`.

## Tiêu chí nghiệm thu
- [ ] Có `THIET-KE.md` và token trên `:root`; `css/style.css` không còn mã màu nằm ngoài phần token
- [ ] Đạt cả 10 nguyên tắc trên; PR ghi rõ nguyên tắc nào chưa đạt và vì sao
- [ ] 3 kiểu thao tác chạy như trước: kéo thả bằng chuột và cảm ứng, gộp 10 đơn vị, đặt tính có ô nhớ, chọn đáp án; log sự kiện giống trước
- [ ] Không lộ đáp án ở trạng thái nào (AGENTS.md mục 6)
- [ ] Không lỗi console, không request ra mạng
- [ ] Chỉ dùng HTML/CSS/JS thuần, mở trực tiếp bằng `index.html` như cũ

## Bằng chứng phải nộp trong PR
- Ảnh trước và sau của cả 3 kiểu ở 1180×820 và 1440×900, cùng một ảnh có `?debug=1`
- Kết quả kiểm tra trợ năng tự động (ví dụ axe-core) hoặc ghi rõ đã kiểm tra tay những gì
- Bảng đo vùng chạm nhỏ nhất của từng tab
