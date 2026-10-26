# T-06 · Giọng nói hai chiều cho bài Toán mẫu
Giao cho: Codex · Nhánh: codex/T-06 · Mô-đun: voice-workspace · Phụ thuộc: T-01, T-02, T-05 (đã merge)

## Mục tiêu
Một bản thử giọng nói tách riêng cho bài 27 + 15: máy đọc đề và gợi ý (TTS), trẻ nói câu trả lời (STT), máy hiểu được con số trẻ nói và đo độ trễ từng bước. Dịch vụ mặc định theo T-01 và T-05: **Google Speech-to-Text V2 cho nghe, FPT.AI TTS cho nói**. Code phải cắm được dịch vụ khác (ví dụ Azure) mà không sửa phần còn lại.

## Phạm vi
Được sửa: `prototypes/giong-noi/**`, `.env.example`, `.github/workflows/test.yml` (chỉ thêm một bước chạy test của thẻ này)
Không được sửa: mọi thư mục khác, kể cả `prototypes/thao-tac/**` (thẻ T-08 đang sửa). Việc gắn vào màn hình T-02 sẽ là một thẻ riêng sau.

## Yêu cầu
- Một giao diện chung cho nhà cung cấp, ví dụ `stt.transcribe(audio) → { text, ms }` và `tts.speak(text) → { audio, ms }`. Có ba bản: **giả lập** (mặc định, không cần mạng), **Google STT**, **FPT TTS**.
- Khóa API chỉ nằm ở máy chủ cục bộ nhỏ chạy bằng Node (đọc từ `.env`), trình duyệt không bao giờ thấy khóa. Ghi các biến cần có vào `.env.example`, không commit khóa thật.
- Hiểu số tiếng Việt trẻ nói: "bốn mươi hai", "bốn hai", "42", "bốn mươi hai ạ", "ờ… bốn mươi hai". Nhận ra khi nghe không rõ hoặc có hai số khác nhau thì hỏi lại, không tự chấm.
- Đo và hiện độ trễ từng bước: thu âm xong → có chữ, gửi câu → bắt đầu phát tiếng. Ghi vào khung log giống T-02.
- Mic bị từ chối hoặc lỗi âm thanh thì vẫn làm bài được bằng cách bấm chọn số (theo đặc tả mục lỗi).
- Không lưu âm thanh xuống đĩa hay gửi đi đâu ngoài nhà cung cấp đang dùng. Không bật chế độ cho nhà cung cấp dùng dữ liệu (như data logging của Google).
- Lời máy nói tuân thủ ranh giới sản phẩm: không đọc đáp án, không chê.

## Tiêu chí nghiệm thu
- [ ] Chạy được bằng một lệnh ghi trong `prototypes/giong-noi/README.md`; ở chế độ giả lập chạy trọn vòng hỏi, đáp, gợi ý mà không cần khóa
- [ ] Test (`node --test`) cho bộ hiểu số với ít nhất 20 câu nói mẫu, gồm cả câu mơ hồ phải hỏi lại; test không gọi API thật
- [ ] Bản Google STT và FPT TTS viết theo tài liệu chính thức, có link tài liệu trong README; chỉ chạy khi có khóa trong `.env`
- [ ] README có hướng dẫn chủ dự án tự chạy với khóa thật và cách đọc số đo độ trễ
- [ ] Thêm bước test của thẻ này vào CI và CI xanh

## Bằng chứng phải nộp trong PR
- Log test và ảnh chụp bản thử chạy ở chế độ giả lập, có hiện số đo độ trễ
- Ghi rõ phần nào chưa thử được với dịch vụ thật (vì không có khóa)
