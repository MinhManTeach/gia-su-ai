# T-05 · Công cụ ước tính chi phí và độ trễ một buổi học

Nhập giá dịch vụ (từ T-01) và kịch bản buổi học vào `config.toml`,
công cụ xuất chi phí ước tính cho buổi 15 / 25 / 30 phút và tổng tháng
theo số buổi mỗi tuần, kèm ước tính độ trễ mỗi lượt hội thoại.

Không gọi API thật. Chỉ dùng thư viện chuẩn Python (không cài thêm gì).

## Chạy

```bash
cd tools/cost-model
python3 cost_model.py                  # bảng Markdown
python3 cost_model.py --dinh-dang csv  # bảng CSV
python3 test_cost_model.py             # chạy test (một lệnh)
```

## File

| File | Vai trò |
|---|---|
| `config.toml` | MỌI con số: giá STT/TTS/mô hình, hạ tầng, tỷ giá, kịch bản, độ trễ. Giá lấy từ `docs/nghien-cuu/giong-noi.md` (T-01). Muốn đổi giá chỉ sửa file này, không sửa code. |
| `cost_model.py` | Đọc config, tính toán, xuất bảng Markdown/CSV. |
| `test_cost_model.py` | Test đối chiếu tính tay (xem bên dưới). |

## Tính tay một kịch bản để đối chiếu

Kịch bản **"Trẻ nói trung bình"**, buổi **25 phút**,
phương án **Google STT + FPT TTS** (số liệu gốc: T-01, mục 3):

- STT: 10 phút × 0,016 USD/phút = 0,16 USD → 0,16 × 26.000 = **4.160 VND**
- TTS: 6.000 ký tự × 0,25 VND/ký tự = **1.500 VND**
- Mô hình ngôn ngữ: chưa chọn ở T-01 → **0 VND**
- Hạ tầng: chưa ước tính → **0 VND**
- **Tổng một buổi = 5.660 VND** (T-01 làm tròn ghi ~5.700 VND)
- Tháng (3 buổi/tuần ≈ 13 buổi/tháng): 5.660 × 13 = **73.580 VND**

Chạy `python3 cost_model.py` phải cho ra đúng các số trên
(test `test_google_stt_fpt_tts_trung_binh_25_phut` kiểm tra điều này).

Tương tự, phương án **FPT STT + FPT TTS**: 10 × 620 + 1.500 = **7.700 VND**,
khớp bảng T-01.

## Giả định đang dùng (ghi rõ để khỏi nhầm là số đã đo)

1. **Co giãn tuyến tính:** kịch bản mô tả buổi chuẩn 25 phút; buổi 15/30 phút
   nhân tỉ lệ 15/25 và 30/25. Đây là ước tính thô — thực tế trẻ có thể nói
   nhiều/ít hơn tỉ lệ thời gian.
2. **Độ trễ mỗi lượt** (2 + 2 + 2 = 6 giây) là giả định tạm trong config,
   chờ số đo thật ở T-06.
3. **Token mỗi lượt** (400 vào / 150 ra) là giả định tạm, chờ đo ở T-06.
   Mỗi lượt gửi lại cả lịch sử hội thoại, nên token vào tăng dần:
   lượt thứ k (tính từ 0) gửi `400 + k × 200` token (`token_lich_su_moi_luot = 200`,
   cũng là giả định tạm). Tổng cả buổi = n × 400 + 200 × n(n−1)/2.
   Ví dụ buổi trung bình 16 lượt: 16 × 400 + 200 × 16 × 15 / 2 = 6.400 + 24.000
   = **30.400 token vào**, gấp gần 5 lần nếu coi mỗi lượt cố định 400 token.
4. **Giá mô hình ngôn ngữ và hạ tầng = 0** vì chưa chọn mô hình (T-01)
   và chưa có kiến trúc hạ tầng. Điền vào `config.toml` khi có số. Khi hạng mục
   nào còn bằng 0, bảng Markdown in cảnh báo ngay đầu, và CSV ghi tên hạng mục
   đó ở cột `hang_muc_chua_co_gia`.
5. Tháng = số buổi/tuần × 52 / 12 (3 buổi/tuần ≈ 13 buổi/tháng, như T-01).

## Mở rộng

- Thêm phương án giá mới (ví dụ Azure khi có giá chính thức):
  thêm khối `[[phuong_an]]` trong `config.toml` trỏ tới khóa trong
  `[gia.stt]` / `[gia.tts]` — không cần sửa code.
- Đổi tỷ giá, số buổi/tuần, kịch bản: sửa `config.toml` rồi chạy lại.
