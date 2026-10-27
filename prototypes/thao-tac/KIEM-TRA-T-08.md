# Bằng chứng T-08

Kiểm tra ngày 27/10/2026, Chrome headless 156.0.8078.48 trên macOS, mở trực tiếp `file://…/index.html`. Kết quả máy đọc được lưu trong `tests/t08-results.json`.

## Cách chạy lại

Dùng Node.js và Playwright đã cài bên ngoài bản thử, Chrome cục bộ:

```sh
NODE_PATH=/duong-dan/node_modules node prototypes/thao-tac/tests/t08-ui.cjs
```

Đối chiếu thêm với mã nguồn trước T-08: xuất `prototypes/thao-tac` từ commit `0c3ef45` vào một thư mục tạm, rồi đặt `T08_BASELINE=/duong-dan/ban-goc/index.html` khi chạy. Không cần server hay thư viện trong ứng dụng.

Kết quả: **PASS** 15 tổ hợp (3 cách × 768×820, 1024×768, 1180×820, 1280×800, 1440×900). Không cuộn ngang. Kho và hai cột thả cùng trong viewport ở ba kích thước tablet ngang. Ở 768 px và cách 2 trên tablet, nội dung hướng dẫn dài có thể cần cuộn dọc; không che hoặc cắt nội dung.

## Trợ năng và thao tác

Không chạy axe-core; kiểm tra bằng DOM/computed styles và thao tác bàn phím thật qua Playwright:

- Tab đi qua các điều khiển đang hiện, theo thứ tự DOM; không lọt vào tab ẩn hoặc khung debug; mọi điểm focus đều có outline. Enter/Space chuyển vật phẩm và chọn đáp án; gõ số bằng bàn phím vật lý, sửa bằng bàn phím trên màn hình.
- h1 → h2 → h3 không nhảy cấp; cả ba vùng phản hồi có `aria-live="polite"`, `aria-atomic="true"`; nút xóa số có tên truy cập.
- Chữ hiện ở trạng thái đầu, gợi ý, đúng và debug đạt ít nhất 4,5:1 trên nền thực tế (đo computed styles). Lựa chọn có dấu ✓; ô đang nhập có nhãn bằng chữ; phản hồi có câu chữ gốc, không chỉ màu.
- Không dùng đỏ cho chưa đúng; không animation lặp. Khi reduced motion bật, animation/transition đều tắt.
- Thả nhầm cột trả vật về kho; thả đúng bằng chuột và cảm ứng giả lập chuyển vật; gộp cho 4 que chục và 2 đơn vị. Trắc nghiệm chưa chọn sẵn đáp án. Tổng tính tự động của bảng que được ẩn khỏi phần nhìn/cây trợ năng trước khi gộp; phản hồi gốc sau thao tác vẫn giữ.
- Đối chiếu toàn bộ payload log trong chuỗi thao tác với bản gốc (chỉ chuẩn hóa ID que mới phụ thuộc thời gian). Log chuột và touch bằng nhau; `afterFeedback=true` giữ nguyên khi sửa đúng sau gợi ý. Không đổi `app.js`, `logger.js`, `focus.js` hoặc phương thức chấm/gợi ý.
- Không lỗi console, không request HTTP(S). Logger vẫn hoạt động khi debug ẩn; `?debug=1` mở được bảng log.

Không thử với trẻ thật, thiết bị cảm ứng vật lý hoặc trình đọc màn hình; kết quả trên không phải chứng nhận WCAG đầy đủ. ARIA live region được dựng lại cùng giao diện như kiến trúc cũ, cần thử thông báo thực tế bằng VoiceOver/NVDA trước dùng thật.

### Vùng chạm nhỏ nhất

Giá trị nhỏ nhất qua cả 5 cỡ màn hình, lấy từ bounding box của điều khiển đang hiện (gồm cả thanh chuyển cách). Chiều rộng và cao là hai cực tiểu riêng, không nhất thiết cùng một nút.

| Cách | Rộng nhỏ nhất | Cao nhỏ nhất | Khoảng cách nhỏ nhất |
| --- | ---: | ---: | ---: |
| Que và khối | 48 px | 48 px | 8 px |
| Đặt tính | 64 px | 48 px | 8 px |
| Chọn đáp án | 166,70 px | 48 px | 8 px |

## Ảnh trước và sau

Ảnh chụp toàn trang với viewport nêu trong cột; chiều cao file có thể lớn hơn viewport nếu trang cần cuộn. Không chứa ảnh hoặc dữ liệu trẻ thật.

| Viewport | Cách | Trước | Sau |
| --- | --- | --- | --- |
| 1180×820 | Que/khối | [Ảnh](screenshots/t08-before-1180-mode1.png) | [Ảnh](screenshots/t08-after-1180-mode1.png) |
| 1180×820 | Đặt tính | [Ảnh](screenshots/t08-before-1180-mode2.png) | [Ảnh](screenshots/t08-after-1180-mode2.png) |
| 1180×820 | Lựa chọn | [Ảnh](screenshots/t08-before-1180-mode3.png) | [Ảnh](screenshots/t08-after-1180-mode3.png) |
| 1440×900 | Que/khối | [Ảnh](screenshots/t08-before-1440-mode1.png) | [Ảnh](screenshots/t08-after-1440-mode1.png) |
| 1440×900 | Đặt tính | [Ảnh](screenshots/t08-before-1440-mode2.png) | [Ảnh](screenshots/t08-after-1440-mode2.png) |
| 1440×900 | Lựa chọn | [Ảnh](screenshots/t08-before-1440-mode3.png) | [Ảnh](screenshots/t08-after-1440-mode3.png) |

Ảnh bổ sung: [debug=1](screenshots/t08-debug-1180.png), [đã gộp](screenshots/t08-grouped-1180.png), [có gợi ý](screenshots/t08-hint-1180.png).

## Đối chiếu 10 nguyên tắc và giới hạn

1. Có `THIET-KE.md`, viết trước code giao diện.
2. Token màu theo vai trò, khoảng cách bội 4, ba mức góc và thang chữ. Kiểm tra tự động cấm mã màu/px bên ngoài `:root`.
3. Nền phẳng, xanh lục lam, không gradient/bóng/emoji mới; bố cục theo hoạt động.
4. Debug chỉ hiện với `debug=1`; bỏ thông tin T-02/mô-đun/chương trình khỏi header trẻ.
5. Font hệ thống, thân bài 20 px, số phép tính 40–44 px.
6. Đạt tương phản và tín hiệu bằng chữ/hình trong các trạng thái đã thử. **Giới hạn về không lộ đáp án:** `?demo=1` có sẵn trong `app.js` tự điền lời giải; các gợi ý/nhận xét gốc sau khi kiểm tra cũng được giữ nguyên. Không tuyên bố đạt “không lộ đáp án ở mọi trạng thái/URL”. Đề nghị Claude xác nhận tách hoặc chặn cơ chế demo bằng thẻ cho phép sửa logic; T-08 chỉ cho sửa markup/class/ARIA trong `js/**`.
7. Các giá trị đo ở bảng trên đạt 48×48 px, khoảng cách 8 px.
8. Đã kiểm tra Tab/focus/heading/live attributes; chưa kiểm tra thông báo thực tế với trình đọc màn hình.
9. Đạt các viewport nêu trên, không thanh cuộn ngang; vùng kéo và vật cùng hiện trên tablet ngang ở trạng thái ban đầu.
10. Transition màu 160 ms; không animation lặp; tắt theo reduced motion.
