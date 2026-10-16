# ĐẶC TẢ BÀN GIAO — GIA SƯ AI TẠI NHÀ

Phiên bản: 1.0 — 15/10/2026

Đối tượng đọc: agent tiếp nhận dự án, người phát triển sản phẩm, kỹ sư và người phụ trách học liệu.

Tài liệu này độc lập với lịch sử trò chuyện. Đây là đặc tả ý định sản phẩm và hành vi mong muốn, không phải mô tả một ứng dụng đã được xây. Chưa có mã nguồn hoặc lựa chọn công nghệ được duyệt. Các yêu cầu dưới đây là nội dung bàn giao để hiểu và thiết kế dự án, không tự cấp quyền triển khai, mua dịch vụ hay phát hành sản phẩm.

## 1. Bối cảnh và ý định của người sáng lập

Người sáng lập đang dạy Tin học ở tiểu học, không phải giáo viên chủ nhiệm. Ban đầu đã khảo sát công cụ hỗ trợ giáo viên nhưng chuyển hướng vì trao đổi với một số đồng nghiệp cho thấy mức sẵn sàng trả tiền chưa rõ. Dự án hiện tại hướng tới phụ huynh và học sinh, không còn là công cụ tạo Word, slide hoặc giáo án cho giáo viên.

Vấn đề cần giải quyết: phụ huynh có ít thời gian kèm con; trẻ cần được giải thích, thực hành và hỗ trợ khi mắc bài ở nhà. Mong muốn là cung cấp một gia sư AI có chi phí phù hợp, giúp trẻ tăng khả năng tự học và từng bước giảm nhu cầu học thêm bên ngoài.

Không mặc định phụ huynh bận là không quan tâm con. Sản phẩm cần giúp họ theo dõi có chất lượng mà không phải trực tiếp kèm cả buổi.

Gia sư phải hướng dẫn học, tạo cơ hội trẻ suy nghĩ và đánh giá khả năng vận dụng. Không lấy việc trả lời nhanh câu hỏi hoặc đưa đáp án làm giá trị chính.

## 2. Những quyết định đã được người sáng lập chốt

| Nội dung | Quyết định |
|---|---|
| Người học thử nghiệm | Học sinh tiểu học lớp 1–5 |
| Môn đầu tiên | Toán; phát triển các môn khác sau |
| Người đăng ký/theo dõi | Phụ huynh |
| Thiết bị học | Máy tính hoặc máy tính bảng; không ưu tiên điện thoại vì tránh chiếm điện thoại cha mẹ |
| Tương tác | Giọng nói hai chiều ngay trong phiên bản đầu, kết hợp thao tác trực tiếp trên màn hình |
| Thời lượng | Mỗi buổi dưới 30 phút, dành thời gian cho nghỉ ngơi và hoạt động khác |
| Chuẩn nội dung | Bám Chương trình GDPT 2018, yêu cầu cần đạt và bài học tương ứng của bộ Kết nối tri thức với cuộc sống |
| Khởi đầu | Chọn lớp, môn và bài; làm quen và khảo sát kiến thức trước khi hướng dẫn |
| Xác định bài đang học | Lần đầu có thể chọn bài hoặc chụp trang; về sau nhớ tiến độ và hỏi xác nhận. Luồng cốt lõi không phụ thuộc phụ huynh chụp bài |
| Làm bài | Trẻ thao tác ngay trong ứng dụng; không bắt phụ huynh chụp vở rồi gửi thường xuyên |
| Phương pháp | AI dẫn dắt buổi, giao bài mới cùng dạng nhưng khác bài đã học, tìm chỗ sai và hướng dẫn lại |
| Thành công | Trẻ tự giải được bài mới trước đây cần người giúp, cần ít gợi ý hơn và tiến bộ trên lớp |
| Giá giai đoạn đầu | Hướng đến đủ chi phí vận hành; chưa chốt giá cụ thể |

Người sáng lập đã đồng ý bản đồ sáu mô-đun ở mục 9. Các lựa chọn triển khai chi tiết chưa mặc nhiên được duyệt.

## 3. Đề xuất hiện tại — phân biệt với quyết định đã chốt

Những điểm sau do agent đề xuất, cần xác nhận trước khi biến thành cam kết:

1. Ưu tiên web trên trình duyệt để dùng trên máy tính và máy tính bảng.
2. Đợt thử đầu có một cụm bài được kiểm duyệt cho từng khối 1–5; chưa bao phủ toàn bộ năm học.
3. Mỗi buổi thường hướng tới 15–25 phút; bắt đầu tổng kết từ phút 25 và đóng trước phút 30.
4. Có báo cáo trong sản phẩm trước; chọn một kênh gửi bên ngoài sau khi kiểm tra khả thi.
5. Không lưu âm thanh gốc mặc định. Chính sách xử lý/lưu ở nhà cung cấp cần kiểm tra riêng.
6. Nếu đã hướng dẫn lại hai chu kỳ mà trẻ vẫn vướng cùng mục tiêu, dừng chuỗi lặp, ghi nhận để ôn thay vì ép làm tiếp.

Không tự thu hẹp phạm vi lớp 1–5 xuống một khối mà không trao đổi; có thể đề xuất giảm số bài để kiểm chứng khả thi.

## 4. Vai trò và quyền

### Phụ huynh

- Tạo tài khoản và hồ sơ con, chọn lớp, thiết lập loa/mic ban đầu.
- Chọn quyền xử lý dữ liệu và kênh nhận thông báo.
- Xem tiến bộ, thay đổi thiết lập và yêu cầu xem/xóa dữ liệu.
- Tự nguyện bổ sung nhận xét hoặc kết quả từ lớp học; không phải nhập mỗi ngày.

### Học sinh

- Mở hồ sơ được phụ huynh cho phép, xác nhận bài và học trực tiếp.
- Nói với AI, nghe giải thích, thao tác làm bài, xin gợi ý/hỏi lại/nghỉ.
- Không truy cập thanh toán, người nhận báo cáo hoặc dữ liệu gia đình khác.

### Người phụ trách học liệu

- Đối chiếu chương trình và sách; biên soạn, duyệt mục tiêu, câu hỏi, đáp án, ví dụ và gợi ý.
- Thu hồi hoặc sửa nội dung lỗi bằng phiên bản mới.
- Vai trò vận hành này cần có, nhưng giao diện quản trị đầy đủ chưa được chốt là tính năng bản đầu.

## 5. Luồng A — Thiết lập và làm quen lần đầu

1. Phụ huynh tạo hồ sơ: tên gọi của trẻ, lớp 1–5 và thiết lập cần thiết. Chỉ hỏi dữ liệu thực sự phục vụ học tập.
2. Giải thích rõ cách dùng dữ liệu và quyền của phụ huynh trước khi thu dữ liệu trẻ.
3. Kiểm tra loa, mic và khả năng thao tác trên thiết bị.
4. Trẻ gặp gia sư AI; được cho biết đây là trợ lý AI hỗ trợ học, không giả làm người thật.
5. AI hỏi từng câu ngắn về tên muốn được gọi, sở thích tự nguyện hoặc cảm nhận về Toán. Có thể bỏ qua.
6. Chọn bài đang học từ danh mục phù hợp lớp. Có đường chọn thủ công, không bắt buộc tải ảnh.
7. Khảo sát ngắn gắn với bài và kiến thức nền để chọn điểm bắt đầu.

Lưu ý về “hiểu tính cách”: mong muốn ban đầu là AI làm quen để biết cách hỗ trợ con. Không được biến vài câu trả lời thành chẩn đoán hoặc nhãn như “lười”, “kém tập trung”. Điều chỉnh cách giải thích dựa trên sở thích và bằng chứng làm bài, có thể thay đổi theo thời gian.

## 6. Luồng B — Một buổi học thông thường

### B1. Xác nhận và chọn mục tiêu

AI hỏi con có đang học bài đã lưu không. Trẻ có thể đổi bài. Ứng dụng không tự biết trường đã dạy đến đâu nếu chưa được cung cấp thông tin.

Chọn một mục tiêu nhỏ vừa với thời gian buổi học. Hiển thị/nói rõ con sẽ luyện điều gì.

### B2. Kiểm tra đầu buổi

Dùng câu ngắn cùng mục tiêu và kiến thức tiên quyết. Nếu trẻ đã có bằng chứng làm được, chuyển sang luyện vận dụng, không buộc nghe giảng lại từ đầu.

Nếu thiếu kiến thức nền, chọn hoạt động nền đã được duyệt; không tự tạo mục tiêu chính thức bằng suy đoán.

### B3. Hướng dẫn tương tác

AI giải thích ngắn với hình ảnh, ví dụ và thao tác. Mỗi lượt một yêu cầu. Sau một đoạn ngắn, cho trẻ trả lời hoặc làm để kiểm tra hiểu, không chờ đến cuối buổi mới kiểm tra.

Trẻ có thể hỏi “tại sao”, xin nói lại, ngắt lời hoặc xin nghỉ. Khi trẻ đang suy nghĩ, không tự động coi im lặng là sai.

### B4. Luyện có hỗ trợ

Trẻ làm bài trực tiếp bằng chuột/cảm ứng, chọn, kéo thả, nhập số hoặc thao tác theo bước tùy dạng bài.

AI tăng hỗ trợ từng mức: nhắc điều cần tìm → gợi bước → minh họa/làm mẫu. Ghi nhận mức hỗ trợ đã dùng. Không đưa lời giải ngay từ đầu.

### B5. Kiểm tra vận dụng độc lập

Giao câu chưa làm trước đó, cùng yêu cầu cần đạt và độ khó tương đương, khác số liệu hoặc bối cảnh. Trẻ thử trước; AI không gợi ý sớm làm mất giá trị đánh giá.

Không chỉ đổi số tùy ý. Tính tương đương và đáp án cần được kiểm tra trong quy trình học liệu.

### B6. Tìm điểm vướng và hướng dẫn lại

Nếu sai, kiểm tra đầu vào có bị nghe/nhập nhầm không. Sau đó dùng câu hỏi hoặc thao tác ngắn để tìm bước con chưa hiểu. Không suy nguyên nhân chỉ từ đáp án cuối.

Giải thích lại đúng điểm vướng rồi giao câu khác tương đương. Nếu trẻ làm đúng sau lời giải hoặc gợi ý, ghi là có hỗ trợ; cần câu mới để kiểm tra độc lập.

### B7. Kết thúc

Kết thúc dưới 30 phút kể cả chưa hoàn thành mục tiêu. Tính cả thời gian suy nghĩ, tạm dừng và gián đoạn; gián đoạn dài thì đóng buổi và cho tiếp tục trong buổi khác. Nhắc sớm để không cắt ngang đột ngột.

AI nói cụ thể con đã làm được gì, lưu phần cần ôn và dự kiến buổi sau. Không ép làm thêm hoặc dùng thưởng để giữ trẻ học vượt giới hạn.

## 7. Luồng C — Theo dõi qua nhiều buổi

Buổi sau có câu ôn mới tương đương để kiểm tra trẻ còn tự làm được không. Hệ thống dùng kết quả đã lưu để điều chỉnh hỗ trợ, không chỉ tăng độ khó theo số buổi sử dụng.

Ghi bằng chứng theo mục tiêu: đúng độc lập lần đầu; đúng sau tự sửa; đúng có hỗ trợ; sai; chưa đủ dữ liệu. Có cờ nếu AI đã tiết lộ đáp án.

Không kết luận thành thạo từ một câu đúng. Quy tắc thành thạo và số mẫu cần được xác định cùng chuyên môn trước thử nghiệm.

## 8. Ví dụ minh họa đầy đủ

Ví dụ phép cộng có nhớ; lớp, bài và mức khó phải đối chiếu nguồn trước khi dùng thật.

1. Con chọn bài phù hợp; AI hỏi một câu kiểm tra nhóm chục–đơn vị.
2. AI minh họa 27 + 15 bằng các nhóm chục và đơn vị, hỏi con thao tác từng bước.
3. Con làm ra 32. AI chưa kết luận con quên nhớ; kiểm tra cách con cộng hàng đơn vị.
4. Nếu con chưa hiểu đổi 12 đơn vị thành 1 chục và 2 đơn vị, AI cho thao tác nhóm đồ vật rồi quay lại đặt tính.
5. Con làm được với hướng dẫn: lưu kết quả có hỗ trợ.
6. Giao 36 + 18 để con tự làm; nếu con trả lời bằng giọng nói không rõ, xác nhận lại trước khi chấm.
7. Nếu con tự làm đúng, ghi nhận bằng chứng độc lập mới; kiểm tra thêm ở buổi sau trước khi kết luận vững.
8. Phụ huynh nhận báo cáo ngắn về phần con tự làm được và bước còn cần gợi ý.

## 9. Bản đồ sáu mô-đun đã đồng ý

| Mã ổn định | Trách nhiệm | Phụ thuộc |
|---|---|---|
| family-profile | Gia đình, hồ sơ trẻ, quyền quản lý và đồng ý xử lý dữ liệu | — |
| curriculum-content | Mục tiêu, bài học, câu hỏi, lời giải và học liệu đã duyệt | — |
| learning-evidence | Lượt làm, gợi ý và tổng hợp tiến bộ theo mục tiêu | family-profile, curriculum-content |
| tutor-session | Chọn hoạt động, hướng dẫn, sửa lỗi, điều phối thời gian buổi | family-profile, curriculum-content, learning-evidence |
| voice-workspace | Màn hình học, giọng nói hai chiều, thao tác chuột/cảm ứng | tutor-session |
| parent-progress | Báo cáo và phản hồi từ lớp, thông báo cho người nhận được phép | family-profile, learning-evidence |

learning-evidence cung cấp dữ liệu từ lượt trước; tutor-session gửi sự kiện lượt mới. Không tạo phụ thuộc ngược chỉ vì có chu trình học qua nhiều lượt.

Tách vai trò: giao diện không tự quyết định mức thành thạo; lời sinh tự do không tự ghi đè đáp án chuẩn; báo cáo không sửa bằng chứng.

## 10. Dữ liệu khái niệm và sự kiện

Đây là hợp đồng khái niệm để thiết kế tiếp, chưa phải schema/API được duyệt.

- Gia đình và hồ sơ: family-id, learner-id, lớp, tên gọi, quyền quản lý, trạng thái đồng ý.
- Học liệu: lesson-id, objective-id, phiên bản, nguồn đối chiếu, kiến thức nền, bài tập, đáp án và gợi ý, trạng thái duyệt.
- Buổi học: session-id, learner-id, bài/phiên bản, mục tiêu, thời điểm bắt đầu/kết thúc, trạng thái và phần cần tiếp tục.
- Lượt làm: attempt-id, session-id, câu/phiên bản, câu trả lời, kết quả, số lần thử, gợi ý đã dùng, đáp án đã lộ hay chưa, nguồn nhập và trạng thái xác nhận.
- Báo cáo: giai đoạn, mục tiêu, số mẫu, bằng chứng độc lập/có hỗ trợ, điểm còn vướng, nguồn phản hồi trên lớp và trạng thái gửi.

Gửi lại cùng sự kiện do mạng lỗi không tạo lượt trùng. Sửa chấm hoặc học liệu phải lưu dấu vết; giữ phiên bản tại thời điểm trẻ làm bài.

Chỉ lưu chuỗi thao tác cần để hiểu cách làm. Không theo dõi ngoài bài học hoặc thu âm nền ngoài phiên.

## 11. Báo cáo phụ huynh

Trong sản phẩm có thể xem:

- Hôm nay học mục tiêu gì và có kết thúc sớm không.
- Con tự làm được phần nào, bao nhiêu câu mới và mức trợ giúp.
- Điểm còn vướng và phần sẽ ôn tiếp.
- Một gợi ý đồng hành ngắn khi thực sự cần, không giao lại toàn bộ việc kèm cho cha mẹ.

Ví dụ minh họa: “Con tự làm đúng 3/4 câu cộng có nhớ mới. Một câu cần gợi ý ở bước đổi đơn vị thành chục. Buổi sau sẽ kiểm tra lại bằng câu khác. Chưa đủ dữ liệu để kết luận con đã vững phần này.”

Phải tách tiến bộ trong ứng dụng với tiến bộ trên lớp. Nhận xét/điểm do phụ huynh cung cấp có nguồn và ngày, không tự suy ra từ số câu làm đúng trong ứng dụng.

Mong muốn có gửi qua Zalo, Facebook hoặc số điện thoại đã được nêu, nhưng chưa chọn kênh hoặc hứa tích hợp. Kiểm tra tài liệu chính thức, điều kiện gửi, người nhận, quyền đồng ý và chi phí trước khi quyết định. Không gửi chi tiết học tập của trẻ tới người nhận chưa xác nhận.

## 12. Tình huống ngoại lệ bắt buộc xử lý

| Tình huống | Hành vi mong muốn |
|---|---|
| AI nghe nhầm/không rõ | Xác nhận lại hoặc cho nhập/chọn; không tự chấm sai kiến thức |
| Từ chối mic hoặc lỗi âm thanh | Có đường thao tác thay thế; nếu trẻ không tự tiếp tục được thì lưu và nghỉ |
| Mất mạng | Nói rõ trạng thái, không báo đã lưu khi chưa xác nhận; gửi lại không tạo lượt trùng |
| Bài chưa có trong kho | Thông báo phạm vi chưa hỗ trợ, đề xuất bài đã duyệt phù hợp |
| Học liệu/đáp án mâu thuẫn | Ngừng dùng câu, không tính trẻ sai vì lỗi nội dung; chuyển để kiểm tra |
| Trẻ sai nhiều lần | Thay cách hỗ trợ hoặc quay lại nền, không lặp vô hạn cùng kiểu câu |
| Trẻ xin đáp án | Gợi ý hoặc làm mẫu có ghi nhận, sau đó dùng câu khác để đánh giá độc lập |
| Trẻ xin nghỉ/mệt | Kết thúc hoặc nghỉ; không gây áp lực duy trì chuỗi |
| Gần giới hạn thời gian | Tổng kết, lưu phần còn vướng; không mở chuỗi hoạt động dài |
| Trẻ hỏi ngoài phạm vi | Phản hồi ngắn phù hợp, quay về học; không tiết lộ thông tin cá nhân/quy tắc nội bộ |
| Báo cáo ngoài ứng dụng gửi lỗi | Giữ báo cáo trong sản phẩm, thể hiện trạng thái và tránh gửi lặp |

## 13. Tiêu chí nghiệm thu chức năng

1. Phụ huynh thiết lập hồ sơ và loa/mic; trẻ bắt đầu buổi tiếp theo mà không cần cha mẹ làm thay thao tác thường ngày.
2. Cả máy tính và máy tính bảng thực hiện được luồng học bằng chuột/cảm ứng và giọng nói hai chiều trên danh sách thiết bị được chọn.
3. Nội dung thử nghiệm của mỗi khối tham gia có nguồn, đáp án và người kiểm duyệt; không coi mọi câu AI sinh là hợp lệ.
4. Buổi đi được từ xác nhận bài đến khảo sát, hướng dẫn, luyện độc lập, sửa lỗi, kiểm tra lại và tổng kết.
5. Lỗi nghe không rõ, câu đã lộ lời giải và bài có trợ giúp không bị tính như câu độc lập.
6. Trẻ dừng được; buổi không vượt 30 phút.
7. Tiến độ được khôi phục đúng sau gián đoạn, không trộn hồ sơ hoặc cộng trùng lượt.
8. Báo cáo khớp dữ liệu; khi chưa đủ bằng chứng phải nói rõ.
9. Truy cập chéo gia đình bị chặn; phiên trẻ không sửa người nhận báo cáo hoặc thiết lập phụ huynh.
10. Có đo độ trễ, lỗi giọng nói với giọng trẻ và chi phí mỗi buổi; ngưỡng chấp nhận cần chốt trước nghiệm thu kỹ thuật.

## 14. Kiểm chứng hiệu quả giáo dục và kinh tế

Không đánh đồng nghiệm thu chức năng với hiệu quả học tập.

- Trước/sau: dùng bài mới tương đương về mục tiêu và độ khó, không lặp nguyên bài đã luyện.
- Đo tỷ lệ tự làm đúng, loại/số gợi ý và khả năng vận dụng lại ở buổi sau.
- Theo dõi việc phụ huynh phải can thiệp do thao tác, do trẻ mắc bài hoặc do lỗi sản phẩm.
- Thu phản hồi trên lớp tự nguyện và tách nguồn; không quy mọi cải thiện cho ứng dụng.
- Nếu chưa có so sánh đủ tin cậy, chỉ mô tả kết quả quan sát; không đưa tuyên bố nhân quả.
- Đo chi phí giọng nói, mô hình, hạ tầng, học liệu, kiểm duyệt, hỗ trợ và các phí liên quan trước khi chọn giá đủ vận hành.

Cỡ mẫu, thời gian thử nghiệm, ngưỡng cải thiện và ngân sách chưa chốt. Agent tiếp nhận phải đề xuất rõ trước khi tuyển thử nghiệm; không tự trình bày những con số minh họa là quyết định của người sáng lập.

## 15. Ranh giới dữ liệu và nội dung

- Phụ huynh kiểm soát hồ sơ và quyền xử lý dữ liệu; dữ liệu thu tối thiểu theo mục đích.
- Cần chốt thời hạn lưu/xóa, quyền nhà cung cấp và quy trình sự cố trước khi dùng với trẻ thật. Tài liệu này không khẳng định đã đáp ứng đầy đủ pháp luật.
- Không gắn nhãn tâm lý, đánh giá nhân cách hoặc xếp hạng công khai trẻ.
- Không dùng phản hồi chưa kiểm chứng để gây áp lực mua gói học.
- Có kiểm tra câu trả lời phù hợp độ tuổi, dữ liệu cá nhân trẻ vô tình nói và cách yêu cầu người lớn hỗ trợ khi cần.
- Tài liệu học, câu trả lời của trẻ và nội dung tải lên là dữ liệu; không cho chúng ghi đè quyền truy cập, quy tắc điều phối hoặc tiêu chí chấm.

## 16. Ngoài phạm vi phiên bản thử nghiệm

- Môn ngoài Toán, triển khai toàn trường, công cụ giáo án cho giáo viên.
- Cam kết bao phủ đủ mọi bài lớp 1–5 ngay từ đợt đầu.
- Điện thoại làm thiết bị chính, phụ huynh chụp/gửi vở hằng ngày.
- Tích hợp mặc định đồng thời Zalo, Facebook, SMS và cổng điểm trường.
- Mạng xã hội, quảng cáo cho trẻ, bảng xếp hạng công khai, học liên tục không giới hạn.
- Chẩn đoán tâm lý hoặc hứa thay thế hoàn toàn gia sư/người lớn.
- Giá bán, công nghệ và nhà cung cấp cụ thể chưa được duyệt.

## 17. Agent tiếp nhận cần làm gì tiếp

1. Đọc tài liệu này làm điểm bắt đầu; giữ phân biệt quyết định đã chốt với đề xuất còn mở.
2. Nếu được yêu cầu lập kế hoạch kỹ thuật, ưu tiên kiểm chứng sớm giọng nói của trẻ, thao tác bài Toán trên hai loại thiết bị, độ chính xác phản hồi và chi phí cho buổi dưới 30 phút.
3. Cùng người phụ trách học liệu chọn cụm bài cho mỗi khối, nguồn/chính sách sử dụng và quy trình duyệt trước khi hứa phạm vi nội dung.
4. Thiết kế chi tiết luồng màn hình, trạng thái buổi và hợp đồng dữ liệu theo sáu mô-đun đã chốt.
5. Đề xuất stack, lệnh build/test, cấu trúc mã và kiểm thử khi bước sang thiết kế kỹ thuật. Hiện chưa có lệnh thực thi hay framework để kế thừa.
6. Nêu rõ lựa chọn còn thiếu: ngân sách, môi trường thiết bị/mạng, học liệu, người kiểm duyệt, kênh báo cáo, chính sách dữ liệu và tiêu chí thử nghiệm.
7. Không quay lại phỏng vấn lại những quyết định đã chốt nếu không có mâu thuẫn mới; không tự bắt đầu viết mã chỉ vì tài liệu có tên “đặc tả”. Hành động theo yêu cầu mới nhất của người dùng.

## 18. Tài liệu tham chiếu

- Bộ đặc tả sáu mô-đun hiện có: [README](dac-ta-gia-su-ai/README.md). Nếu chỉ gửi một file cho agent, file bàn giao này đã chứa đủ ý định, luồng và phạm vi để bắt đầu.
- [Thông tin Chính phủ về bộ sách sử dụng thống nhất từ năm học 2026–2027](https://baochinhphu.vn/ket-noi-tri-thuc-voi-cuoc-song-la-sach-giao-khoa-thong-nhat-toan-quoc-tu-nam-hoc-20262027-10225122622052997.htm).
- [EEF về ví dụ mẫu và giảm dần hỗ trợ](https://educationendowmentfoundation.org.uk/news/supporting-pupils-with-worked-examples/).

Các nguồn tham chiếu không chứng minh hiệu quả của sản phẩm này. Agent cần kiểm tra nguồn chương trình, sách và tài liệu kỹ thuật chính thức trước khi triển khai nội dung hoặc tích hợp.
