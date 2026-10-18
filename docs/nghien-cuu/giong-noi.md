# T-01 · So sánh dịch vụ giọng nói tiếng Việt

Kiểm tra ngày 16/10/2026. Đây là bảng để anh Man chọn dịch vụ thử ở T-06, **chưa chọn thay anh**. Ô ghi "cần kiểm tra" là chỗ em chưa đọc được tài liệu chính thức, không được coi là đã biết.

## 1. Hai kiểu kiến trúc

- **Kiểu A, ghép 3 phần:** nhận giọng (STT) → mô hình ngôn ngữ trả lời → đọc (TTS). Dễ thay từng phần, dễ chặn lời mô hình trước khi đọc (ví dụ chặn lộ đáp án), nhưng độ trễ cộng dồn.
- **Kiểu B, giọng nói trực tiếp (speech-to-speech):** một mô hình nghe và nói luôn, như OpenAI Realtime. Trễ thấp và tự nhiên hơn, nhưng khó kiểm soát từng câu và thường đắt hơn.

Với gia sư cho trẻ, kiểu A dễ giữ ranh giới đặc tả hơn (mục 9: lời sinh tự do không ghi đè đáp án chuẩn). Em đề xuất thử kiểu A trước, đo kiểu B để so độ trễ.

## 2. Bảng so sánh

| Dịch vụ | Vai trò | Tiếng Việt | Giá công bố | Miễn phí | Ghi chú |
|---|---|---|---|---|---|
| Google Cloud Speech-to-Text V2 (gồm Chirp) | STT | Có | 0,016 USD/phút (dưới 500.000 phút/tháng); batch 0,003 USD/phút | V2 không ghi; V1: 60 phút/tháng | Làm tròn theo giây. V1 rẻ hơn nếu đồng ý "data logging": cần tránh với giọng trẻ |
| FPT.AI Speech to Text | STT | Có, chuyên tiếng Việt | Gói 2.000 phút 1,4 triệu VND (~700 VND/phút); 10.000 phút 5,4 triệu (~540 VND/phút) | 60 phút/năm | Nhà cung cấp trong nước; cần kiểm tra chế độ streaming và chính sách lưu âm thanh |
| FPT.AI Text to Speech | TTS | Có | Gói 1 triệu VND = 4 triệu ký tự (~0,25 VND/ký tự) | 100.000 ký tự/tháng (chậm, xếp hàng) | Gói miễn phí đủ để thử T-06 |
| Azure AI Speech | STT + TTS | Có (giọng vi-VN neural) | Cần kiểm tra trên trang giá/calculator | STT 5 giờ/tháng; TTS 0,5 triệu ký tự/tháng | Gói miễn phí đủ cho giai đoạn thử |
| OpenAI Realtime (gpt-realtime-2.1 / mini) | Speech-to-speech | Cần kiểm tra chất lượng tiếng Việt | Âm thanh vào 32 USD, ra 64 USD mỗi 1 triệu token (bản mini 10/20 USD) | Không | Nguồn là bài tổng hợp ngày 9/7/2026, chưa đối chiếu trang giá OpenAI |
| OpenAI gpt-realtime-whisper | STT | Cần kiểm tra | 0,017 USD/phút (theo cùng bài tổng hợp) | Không | |

Chưa có trong bảng, nên bổ sung trước khi chọn: Gemini Live API (Google), Zalo AI và Viettel AI (trong nước).

## 3. Ước tính chi phí giọng nói cho một buổi 25 phút

Giả định (sẽ thay bằng số đo thật ở T-05/T-06):
- Mic chỉ gửi khi trẻ nói nhờ phát hiện giọng (VAD): khoảng 10 phút âm thanh gửi đi. Nếu mở mic suốt buổi: 25 phút.
- AI nói khoảng 8 phút, tương đương khoảng 6.000 ký tự tiếng Việt.
- Tỷ giá tham số: 1 USD = 26.000 VND (cần cập nhật).

| Phương án | Cách tính | Mỗi buổi |
|---|---|---|
| Google STT + FPT TTS | 10 × 0,016 USD + 6.000 × 0,25 VND | ~4.200 + 1.500 ≈ **5.700 VND** |
| FPT STT + FPT TTS | 10 × 620 VND + 1.500 VND | ≈ **7.700 VND** |
| Google STT mở mic suốt buổi + FPT TTS | 25 × 0,016 USD + 1.500 VND | ≈ **11.900 VND** |
| OpenAI Realtime 2.1 (ước tính của bài tổng hợp 0,04–0,10 USD/phút hội thoại, 18 phút) | 18 × 0,04–0,10 USD | ≈ **18.700–46.800 VND** |

Chưa gồm chi phí mô hình ngôn ngữ ở kiểu A, hạ tầng, học liệu và kiểm duyệt. T-05 sẽ cộng đủ. Với 3 buổi/tuần (khoảng 13 buổi/tháng), riêng giọng nói kiểu A vào khoảng 75.000–155.000 VND/tháng mỗi trẻ.

## 4. Rủi ro với giọng trẻ em (đặc tả mục 13.10)

- Các mô hình STT chủ yếu huấn luyện trên giọng người lớn; giọng trẻ lớp 1–2 (cao, phát âm chưa chuẩn, nói lẫn số) dễ nhận sai. Phải đo trên mẫu thật, không tin số công bố.
- Số và phép tính ("hai mươi bảy cộng mười lăm", "hai bảy") là chỗ dễ sai nhất; cần luôn xác nhận lại hoặc cho bấm chọn (đặc tả mục 12).
- Chính sách dữ liệu: cần đọc kỹ từng nhà cung cấp về lưu âm thanh, dùng để huấn luyện, và điều khoản với người dùng dưới 13 tuổi **trước khi** cho trẻ thật dùng. Không bật các chế độ đổi giá lấy quyền dùng dữ liệu (như data logging của Google V1).
- Thử nghiệm đầu nên dùng giọng người lớn đọc mô phỏng, sau đó mới thu mẫu trẻ có phụ huynh đồng ý và xóa sau thử.

## 5. Đề xuất cho anh quyết định ở T-06

Thử song song 2 phương án rẻ nhất có gói miễn phí: **Azure (STT + TTS)** và **Google STT + FPT TTS**, đo độ trễ và tỷ lệ nhận đúng số trên cùng một bộ câu. Để OpenAI Realtime làm mốc so sánh độ tự nhiên nếu ngân sách cho phép.

## Nguồn

- [Google Cloud Speech-to-Text pricing](https://cloud.google.com/speech-to-text/pricing)
- [FPT.AI STT pricing](https://docs.fpt.ai/docs/en/speech/documentation/stt-pricing), [FPT.AI TTS pricing](https://docs.fpt.ai/docs/en/speech/documentation/tts-pricing)
- [Azure AI Speech pricing](https://azure.microsoft.com/en-gb/pricing/details/cognitive-services/speech-services/)
- [OpenAI Realtime API pricing (AIReiter, 9/7/2026)](https://aireiter.com/blog/openai-realtime-api-pricing)
