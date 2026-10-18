# Quy trình điều phối 4 agent — Gia sư AI tại nhà

Bản nháp chờ anh Man duyệt · 16/10/2026 · Chưa viết dòng mã nào.

## 1. Nói thẳng về giới hạn

Claude **không tự nhắn tin hay điều khiển** được Antigravity, Muse hay Codex. Ba công cụ đó chạy trong tài khoản và ứng dụng của anh. Vì vậy cần một **kênh chung** mà cả bốn cùng đọc/ghi được, và anh là người "chuyển phát":

- Claude viết **thẻ nhiệm vụ** (task card) vào repo.
- Anh dán thẻ vào đúng agent.
- Agent làm trên **nhánh riêng** và mở **Pull Request (PR)**.
- Anh báo Claude "xong T-03, PR #5" trong thread này.
- Claude đọc PR, đối chiếu với thẻ, ghi nhận xét và kết luận Đạt / Cần sửa / Không đạt.
- **Anh là người bấm merge.** Claude không merge thay.

Kênh chung đề xuất: **một repo GitHub riêng** (ví dụ `gia-su-ai`). Hiện project này **chưa gắn repo nào**; anh cần tạo repo, cài Claude GitHub App và thêm repo vào Project settings thì Claude mới đọc được PR.

## 2. Phân vai

| Agent | Thế mạnh hiện tại (đã kiểm tra) | Vai trong dự án |
|---|---|---|
| **Claude** (boss) | Đọc đặc tả dài, lập kế hoạch, review code | Viết thẻ nhiệm vụ, giữ nhật ký quyết định, review mọi PR, không tự merge |
| **Antigravity** (Google) | IDE "agent-first", có agent điều khiển trình duyệt, tự chụp màn hình/quay lại kết quả làm bằng chứng | Màn hình học và thao tác chuột/cảm ứng (`voice-workspace`), thử trên trình duyệt máy tính và máy tính bảng |
| **Codex** (OpenAI) | Chạy tác vụ trên cloud, tự mở PR vào GitHub, đọc `AGENTS.md`, có chế độ code review | Logic và dữ liệu: `curriculum-content`, `learning-evidence`, bộ kiểm thử, công cụ đo độ chính xác phản hồi |
| **Muse** (giả định: **Meta Muse Code**, bản beta, chạy Muse Spark 1.2) | Tác vụ dài nhiều bước, nhiều agent chạy nền song song, tính tiền theo token | Công cụ đo chi phí và độ trễ cho mỗi buổi học; việc có phạm vi rõ, ít rủi ro vì còn beta |

Ghi chú: thông tin về Muse Code chưa nói rõ nó có tự mở PR hay không. Nếu không, anh copy kết quả vào nhánh và Claude vẫn review như thường.

## 3. Thẻ nhiệm vụ trông như thế nào

Mỗi thẻ là một file `tasks/T-xx-ten-ngan.md` trong repo:

```
# T-03 · Thử thao tác kéo thả chục–đơn vị
Giao cho: Antigravity        Nhánh: antigravity/T-03
Mô-đun: voice-workspace       Phụ thuộc: không

## Mục tiêu
(1–3 câu, nói kết quả cần có)

## Phạm vi
Được sửa:   prototypes/workspace/**
Không được sửa: docs/**, tasks/**, mô-đun khác

## Tiêu chí nghiệm thu (trích mục 13 đặc tả)
- [ ] ...có thể kiểm tra bằng mắt hoặc bằng lệnh

## Bằng chứng phải nộp trong PR
- Ảnh/video trên máy tính và máy tính bảng, lệnh test đã chạy và kết quả

## Không được làm
- Thêm thư viện trả phí, gọi API thật bằng thẻ của anh, lưu âm thanh của trẻ
```

Repo có thêm `AGENTS.md` (luật chung cho mọi agent: đọc đặc tả, chỉ sửa trong phạm vi, mỗi PR một thẻ, không tự thêm dịch vụ trả tiền). Codex đọc file này tự động; với Antigravity và Muse, anh dán nội dung nó kèm thẻ ở lần đầu.

## 4. Claude kiểm tra một PR thế nào

1. Đúng phạm vi: chỉ sửa file được phép, đúng nhánh, đúng mô-đun.
2. Đạt từng tiêu chí trong thẻ, có bằng chứng thật (ảnh, log test), không chỉ lời agent tự khai.
3. Không vi phạm ranh giới của đặc tả: không đưa đáp án sớm, không tính câu có trợ giúp là độc lập, không lưu âm thanh gốc, không gắn nhãn trẻ, phiên trẻ không sửa thiết lập phụ huynh.
4. Chất lượng code: đúng, dễ đọc, có test, không bí mật/API key trong code.
5. Kết luận ghi vào PR dưới dạng review: **Đạt** (anh merge), **Cần sửa** (danh sách cụ thể, anh dán lại cho agent), **Không đạt** (lý do, Claude viết lại thẻ).

Quá **2 vòng sửa** mà chưa đạt thì Claude dừng lại, báo anh và đề xuất đổi agent hoặc tách nhỏ thẻ.

## 5. Giai đoạn 1: kiểm chứng sớm (theo mục 17 đặc tả)

Mục tiêu giai đoạn này là trả lời ba câu hỏi trước khi xây sản phẩm thật: **máy nghe giọng trẻ có ổn không, trẻ thao tác bài Toán trên hai loại thiết bị có được không, và một buổi 30 phút tốn bao nhiêu.** Chỉ làm bản thử nghiệm nhỏ, không xây hệ thống.

| Thẻ | Agent | Việc | Kết quả nộp |
|---|---|---|---|
| T-00 | Claude | Dựng khung repo: `docs/` (đặc tả), `AGENTS.md`, mẫu PR, `tasks/`, nhật ký quyết định | PR khung repo |
| T-01 | Claude | Bảng so sánh 3–4 dịch vụ nhận giọng nói/đọc tiếng Việt (độ trễ, giá, chính sách lưu dữ liệu) | Tài liệu so sánh, chưa chọn nhà cung cấp |
| T-02 | Antigravity | Bản thử 3 kiểu thao tác: kéo thả nhóm chục–đơn vị, nhập số đặt tính, chọn đáp án. Chạy trên trình duyệt máy tính và máy tính bảng | Trang thử + ảnh/video trên 2 thiết bị |
| T-03 | Codex | Bộ mẫu học liệu cho 1 bài (cộng có nhớ) theo hợp đồng dữ liệu mục 10, kèm trình kiểm tra đáp án và tính "tương đương" của câu mới | File dữ liệu mẫu + test |
| T-04 | Codex | Bộ đánh giá phản hồi của gia sư: 20–30 tình huống mục 12 (nghe nhầm, xin đáp án, sai nhiều lần...) chấm xem AI có lộ đáp án sớm, có xác nhận lại khi nghe không rõ | Bộ test + báo cáo tỷ lệ đạt |
| T-05 | Muse | Công cụ ước tính chi phí và độ trễ của một buổi 25–30 phút (giọng nói + mô hình + hạ tầng), nhập giá từ T-01 | Script + bảng chi phí theo kịch bản |
| T-06 | Antigravity | Gắn giọng nói hai chiều vào bản thử T-02 bằng dịch vụ anh chọn sau T-01 | Bản thử có giọng nói + số đo độ trễ |
| T-07 | Claude | Tổng hợp kết quả T-01…T-06 thành báo cáo "đi tiếp hay đổi hướng" và đề xuất stack | Báo cáo để anh quyết định |

Thứ tự: T-00 → (T-01, T-02, T-03 song song) → (T-04, T-05) → T-06 → T-07.

Những việc **chờ anh quyết** trước khi chạy:
- T-06 cần anh chọn dịch vụ giọng nói và dùng tài khoản/API key của anh (có tốn tiền).
- Thử giọng nói với **trẻ thật** cần phụ huynh đồng ý, chỉ dùng bản ghi tạm và xóa sau thử. Trước đó dùng giọng người lớn đọc mô phỏng.
- Cụm bài cho từng khối 1–5 cần người phụ trách học liệu duyệt (mục 17.3); T-03 chỉ là mẫu một bài.

Ngoài giai đoạn 1 (chưa làm): tài khoản phụ huynh, báo cáo, Zalo/Facebook, thanh toán, toàn bộ 6 mô-đun hoàn chỉnh.

## 6. Một vòng làm việc mẫu

1. Claude đẩy `tasks/T-02-thao-tac.md` vào repo và nhắn anh: "T-02 sẵn sàng cho Antigravity".
2. Anh mở Antigravity, dán `AGENTS.md` + nội dung T-02.
3. Antigravity làm trên nhánh `antigravity/T-02`, mở PR kèm ảnh chụp.
4. Anh nhắn trong thread: "T-02 xong, PR #4".
5. Claude review, ghi nhận xét lên PR, báo anh: "Cần sửa 2 điểm" hoặc "Đạt, anh merge được".
6. Anh merge. Claude cập nhật bảng tiến độ trong `tasks/README.md`.

## 7. Anh cần làm gì để bắt đầu

1. Xác nhận "Muse" là Meta Muse Code (câu hỏi trong tin nhắn).
2. Tạo repo GitHub (riêng tư), cài Claude GitHub App, gắn repo vào project này.
3. Duyệt bản quy trình này (hoặc sửa phân vai). Sau đó Claude làm T-00.

## Nguồn đã kiểm tra

- [Google Antigravity — Wikipedia](https://en.wikipedia.org/wiki/Google_Antigravity), [Antigravity 2.0 (I/O 2026)](https://www.analyticsvidhya.com/blog/2026/05/google-antigravity-2-0/)
- [OpenAI DevDay 2026: Codex Cloud, Code Review](https://codex.danielvaughan.com/2026/10/08/openai-devday-2026-recap-codex-cloud-agents-view-gpt61-sol-code-review-security-cloud/)
- [Meta Muse Code — Notebookcheck](https://www.notebookcheck.net/Meta-s-Muse-Code-AI-agent-aims-to-simplify-development-across-large-codebases.1361255.0.html)
