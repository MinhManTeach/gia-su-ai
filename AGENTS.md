# Luật chung cho mọi agent (Claude, Antigravity, Codex, Muse)

1. Đọc `docs/dac-ta-ban-giao.md` trước khi làm. Quyết định đã chốt (mục 2, 9) không được tự thay đổi.
2. Mỗi lần làm đúng **một thẻ** trong `tasks/`. Làm trên nhánh `<agent>/T-xx` (ví dụ `codex/T-03`), mở một PR cho thẻ đó.
3. Chỉ sửa file trong mục "Được sửa" của thẻ. Không sửa `docs/`, `tasks/`, `AGENTS.md` trừ khi thẻ cho phép.
4. Không thêm dịch vụ trả phí, không gọi API thật bằng tài khoản của chủ dự án, không commit API key hay bí mật. Dùng `.env.example` để mô tả biến cần có.
5. Không lưu hoặc commit âm thanh, ảnh hay dữ liệu của trẻ thật.
6. Giữ ranh giới sản phẩm: không đưa đáp án ngay, không tính câu có trợ giúp là câu tự làm, không gắn nhãn tính cách cho trẻ, buổi học dưới 30 phút.
7. PR phải điền đủ mẫu: thẻ nào, đã làm gì, bằng chứng (ảnh, video, log test), điều chưa làm được. Không tự khai "đã xong" khi chưa có bằng chứng.
8. Không chắc thì ghi câu hỏi vào PR, không tự đoán rồi làm tiếp.
9. Không merge PR. Claude review, chủ dự án merge.
