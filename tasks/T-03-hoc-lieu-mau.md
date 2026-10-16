# T-03 · Học liệu mẫu một bài và trình kiểm tra đáp án
Giao cho: Codex · Nhánh: codex/T-03 · Mô-đun: curriculum-content

## Mục tiêu
Dữ liệu mẫu cho một bài "phép cộng có nhớ trong phạm vi 100" theo hợp đồng dữ liệu mục 10 đặc tả, và mã kiểm tra tự động đáp án cùng tính tương đương của câu hỏi. Đây là dữ liệu mẫu để thử định dạng, nội dung thật cần người phụ trách học liệu duyệt.

## Phạm vi
Được sửa: `content/**`, `tools/content-check/**`

## Tiêu chí nghiệm thu
- [ ] Một file dữ liệu (JSON hoặc YAML) có: lesson-id, objective-id, phiên bản, nguồn đối chiếu (để trống kèm ghi chú "chưa duyệt"), kiến thức nền, 10–15 câu hỏi, đáp án, 3 mức gợi ý cho mỗi câu (nhắc điều cần tìm, gợi bước, làm mẫu), trạng thái duyệt = "nháp"
- [ ] Có schema mô tả định dạng
- [ ] Trình kiểm tra báo lỗi khi: đáp án tính sai, câu không đúng dạng "có nhớ", hai câu "tương đương" khác độ khó (số chữ số, có nhớ hay không), câu thiếu gợi ý
- [ ] Test tự động chạy bằng một lệnh, ghi trong README, và có ít nhất một test cố tình sai để chứng minh trình kiểm tra bắt được lỗi
- [ ] Không gọi mô hình AI

## Bằng chứng phải nộp trong PR
- Lệnh test và kết quả
