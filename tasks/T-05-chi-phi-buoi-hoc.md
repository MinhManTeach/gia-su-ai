# T-05 · Công cụ ước tính chi phí và độ trễ một buổi học
Giao cho: Muse · Nhánh: muse/T-05 · Mô-đun: không (công cụ đo) · Phụ thuộc: T-01

## Mục tiêu
Công cụ nhập giá dịch vụ (từ T-01) và kịch bản buổi học, xuất chi phí ước tính cho một buổi 15, 25 và 30 phút, và tổng tháng theo số buổi mỗi tuần.

## Phạm vi
Được sửa: `tools/cost-model/**`

## Tiêu chí nghiệm thu
- [ ] Đầu vào là một file cấu hình, không viết cứng giá trong mã: số phút trẻ nói, số phút AI nói, số lượt hội thoại, token vào/ra mỗi lượt, giá STT/TTS/mô hình, chi phí hạ tầng
- [ ] Ít nhất 3 kịch bản: trẻ nói ít, trung bình, nhiều
- [ ] Xuất bảng (CSV hoặc Markdown) chi phí mỗi buổi theo từng hạng mục, quy đổi ra VND với tỷ giá là tham số
- [ ] Có ước tính độ trễ mỗi lượt (nhận giọng + mô hình + đọc) từ số liệu nhập
- [ ] Test chạy bằng một lệnh; tính tay một kịch bản trong README để đối chiếu
- [ ] Không gọi API thật
