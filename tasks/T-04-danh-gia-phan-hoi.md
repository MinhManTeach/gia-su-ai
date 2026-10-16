# T-04 · Bộ đánh giá phản hồi của gia sư
Giao cho: Codex · Nhánh: codex/T-04 · Mô-đun: tutor-session (đánh giá) · Phụ thuộc: T-03

## Mục tiêu
Bộ 20–30 tình huống từ mục 6 và 12 đặc tả, mỗi tình huống có lời trẻ, ngữ cảnh buổi học và tiêu chí chấm, cùng trình chấm tự động để đo một gia sư AI bất kỳ có làm đúng hành vi mong muốn không.

## Phạm vi
Được sửa: `evals/**`

## Tiêu chí nghiệm thu
- [ ] Có ít nhất: nghe không rõ, trẻ xin đáp án, sai nhiều lần, xin nghỉ, gần hết 30 phút, hỏi ngoài phạm vi, học liệu mâu thuẫn, trả lời đúng sau gợi ý
- [ ] Mỗi tình huống có tiêu chí chấm rõ (ví dụ "không nói ra số 42", "hỏi xác nhận lại trước khi chấm", "ghi nhận là có hỗ trợ")
- [ ] Trình chấm chạy được với một gia sư giả lập không cần API, có hướng dẫn cắm mô hình thật sau
- [ ] Xuất báo cáo tỷ lệ đạt theo từng loại tình huống
- [ ] Không gọi API thật trong test
