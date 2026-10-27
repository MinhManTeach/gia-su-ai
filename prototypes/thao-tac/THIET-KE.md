# Hợp đồng thiết kế T-08

- **Việc chính:** trẻ lớp 2 luyện phép cộng có nhớ 27 + 15, chọn một trong ba cách đã có. Giữ nguyên phép tính, lời gợi ý, chấm bài và hợp đồng sự kiện.
- **Thao tác chính:** chuyển que/khối từ kho bên trái sang cột tương ứng bên phải; gộp khi đủ 10 đơn vị. Ở cách 2, chọn ô rồi nhập số; ở cách 3, chọn rồi kiểm tra. Thao tác phụ “Làm lại” ít nổi hơn nút chính.
- **Mới vào:** đề bài lớn, kho và bảng trống rõ ràng; chưa đánh dấu đáp án đúng. **Đang làm:** ô đang nhập có nhãn và viền; lựa chọn có ký hiệu chọn. **Có gợi ý:** thông báo chữ trên nền vàng nhạt. **Làm đúng:** thông báo chữ trên nền xanh lá. **Kéo nhầm:** vật trở lại vị trí cũ, không dùng đỏ hay hiệu ứng phạt; tên cột và hình que/khối luôn hiện để trẻ thử lại.
- **Bố cục:** một trang giấy màu ấm, thanh cách làm ở trên. Kho và bảng song song từ 768 px, ưu tiên 1024×768, 1180×820, 1280×800; chỉ hướng dẫn dài/kết quả được phép xuống dưới. Ở màn nhỏ hơn, xếp dọc, không ép ngang. Cách 2 giữ phép tính và bàn phím cạnh nhau từ 768 px. Giới hạn bề rộng ở 1440 px; khoảng cách vùng chạm ít nhất 8 px, kích thước ít nhất 48×48 px.
- **Ngôn ngữ thị giác:** font hệ thống; chữ thân bài 20 px, phép tính/số đáp án 40–44 px. Mực tối trên giấy sáng; xanh lục lam cho thao tác, vàng cho gợi ý. Mọi màu, khoảng cách, kích thước dùng token. Viền focus riêng; thông báo polite; hiệu ứng tối đa 160 ms và tắt theo reduced motion.
- **Khung người lớn:** ẩn mặc định, chỉ mở với `?debug=1`; phần tử log vẫn tồn tại và nhận sự kiện. Giữ nguyên nhãn tab để payload `tabTitle` không đổi. Không thêm thư viện, font, tài nguyên mạng.
- **Không dùng:** tím/chàm chủ đạo, gradient, bóng nhiều lớp, lưới thẻ trang trí, bo tròn mọi thứ, emoji mới, tiết lộ/tô sẵn đáp án. Không hiển thị tổng tính tự động ở bảng que trước khi trẻ hoàn thành; giữ lời phản hồi gốc sau thao tác. Cơ chế demo có sẵn cần được nêu riêng trong bằng chứng vì không thuộc quyền sửa logic của T-08.

Cơ sở: thẻ T-08, bản thử T-02 hiện có và đặc tả bàn giao; không có bộ nhận diện hoặc thiết kế tham chiếu bên ngoài được giao.
