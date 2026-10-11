# COTE LIBRARY

Website thư viện cá nhân cho bộ PDF **Classroom of the Elite**. Dự án đã bao gồm 38 PDF gốc, giao diện responsive, bộ lọc Year 1/2/3/Volume 0, tìm kiếm, tải PDF, theme sáng/tối và khu vực đọc PDF.

## Khởi chạy nhanh — chỉ cần nhấp đúp

1. Giải nén toàn bộ `COTE-LIBRARY.zip` vào một thư mục. Giữ nguyên các thư mục con và tên file.
2. Mở thư mục `COTE-LIBRARY`.
3. Nhấp đúp **`index.html`** để mở website trong Chrome hoặc Edge.
4. Chọn **Explore Library** hoặc **Library**, sau đó nhấn **Read** ở tập muốn đọc.

Nếu bộ tải được cung cấp dưới dạng nhiều ZIP (source + các gói PDF theo năm), hãy giải nén tất cả ZIP vào cùng một thư mục cha. Cho phép gộp các thư mục `COTE-LIBRARY` khi Windows hỏi; sau khi gộp xong, chỉ mở `COTE-LIBRARY/index.html`.

Các tệp JavaScript của giao diện dùng script thông thường thay vì ES modules để trang có thể khởi chạy từ `file://`. Không cần Node.js, npm, API key, database, backend, trình cài đặt hay local server cho quy trình này.

### Trình đọc PDF khi mở trực tiếp bằng `index.html`

Trong chế độ `file://`, website mở **PDF gốc** bằng trình đọc PDF tích hợp sẵn của trình duyệt, bên trong vùng đọc. Việc cuộn liên tục, hiển thị trang gốc và các tính năng đọc cơ bản do trình duyệt đảm nhiệm. Thanh công cụ của COTE LIBRARY có nút trang trước/sau, ô nhập trang, zoom, Fit, fullscreen, tải PDF và mục lục nếu PDF có bookmark hợp lệ.

**Giới hạn của trình duyệt:** vì trang web không được quyền đọc nội dung bên trong trình đọc PDF tích hợp, số trang trong thanh công cụ phản ánh trang được chọn bằng các nút/ô nhập/mục lục; nó không thể tự theo dõi chính xác số trang khi bạn chỉ cuộn bên trong trình đọc PDF. Website cũng không thể lấy bookmark trực tiếp từ trình duyệt trong chế độ này. Với các PDF đã có bookmark hợp lệ, dự án chứa danh sách mục lục đã được trích xuất từ bookmark thực của chính các file PDF đó. File không có bookmark hợp lệ sẽ hiển thị trạng thái không có mục lục.

Nếu cần PDF.js canvas, theo dõi trang khi cuộn và đọc outline trực tiếp từ tài liệu, có thể dùng chế độ mở rộng qua HTTP server theo mục bên dưới. Tính năng đó không thể bảo đảm chỉ bằng cách nhấp đúp `index.html` nếu không có thư viện PDF.js được đóng gói và quyền tải tài nguyên mà trình duyệt yêu cầu.

## Nội dung PDF đã bao gồm

- `Y1/`: 15 PDF Year 1.
- `Y2/`: 17 PDF Year 2.
- `Y3/`: 5 PDF Year 3, gồm `COTE Year 3 Vol 3 SS.pdf`.
- `COTE Vol 0.pdf`: Volume 0 trong thư mục gốc.

Tổng cộng **38 PDF gốc**, khoảng **356,5 MiB** và **9.318 trang**. Tên file, phần mở rộng và nội dung từng PDF được giữ nguyên; website không tạo lại hoặc chuyển đổi sách.

## Cấu trúc dự án

```text
COTE-LIBRARY/
├── index.html                   # Vào website; chỉ cần nhấp đúp
├── README.md                    # Tài liệu này
├── assets/
│   ├── covers/                  # Cover riêng (tùy chọn); có fallback nếu thiếu
│   └── icons/                   # Logo và favicon SVG
├── css/
│   ├── main.css                 # Design tokens, header, footer, nút và responsive
│   ├── library.css               # Homepage, search, tabs và volume cards
│   └── reader.css                # Reader toolbar, sidebar mục lục và vùng PDF
├── js/
│   ├── app.js                   # Điều hướng, theme, menu mobile, toast
│   ├── volumes.js               # Cấu hình duy nhất cho 38 volume
│   ├── library.js               # Trang chủ, lọc, tìm kiếm, thẻ tập
│   ├── files.js                 # Kiểm tra đường dẫn và tải PDF gốc
│   └── reader.js                # PDF reader, page/zoom/TOC/fullscreen
├── vendor/pdfjs/                 # Tệp PDF.js tùy chọn cho chế độ HTTP
├── tools/                       # Script cài PDF.js tùy chọn
├── Y1/                           # PDF Year 1
├── Y2/                           # PDF Year 2
├── Y3/                           # PDF Year 3
└── COTE Vol 0.pdf                # PDF Volume 0
```

## Các nút và chức năng

- **Home / Library / Explore Library / View all volumes / Back to Home:** chuyển giữa các màn hình.
- **Year 1 / Year 2 / Year 3 / Volume 0:** lọc theo bộ sưu tập.
- **Search:** tìm theo năm hoặc nhãn tập, kể cả volume số thập phân.
- **Light/Dark mode:** đổi giao diện; lựa chọn được lưu trên trình duyệt khi khả dụng.
- **Read:** mở PDF gốc ở trình đọc.
- **Download:** yêu cầu trình duyệt lưu file gốc với tên trong cấu hình. Nếu trình duyệt mở file ở tab thay vì tải, dùng nút Download trên PDF viewer của trình duyệt.
- **Contents:** mở/đóng sidebar mục lục. Chọn mục để nhảy đến trang tương ứng.
- **Previous / Next / ô trang:** chuyển trang, giới hạn trong phạm vi trang của volume.
- **Zoom − / Zoom + / Fit:** điều chỉnh phóng to/thu nhỏ hoặc vừa chiều rộng.
- **Fullscreen:** bật/tắt toàn màn hình nếu trình duyệt hỗ trợ.
- **Menu mobile:** mở/đóng điều hướng trên màn hình nhỏ.

## Thêm hoặc thay PDF

Đặt file PDF vào đúng thư mục và giữ nguyên tên file. Ví dụ, nếu file của bạn tên `COTE Year 1 Vol 1.pdf`, đặt tại `Y1/COTE Year 1 Vol 1.pdf`. Đối với Volume 0, đường dẫn mặc định là `COTE Vol 0.pdf` ở thư mục gốc.

Mở `js/volumes.js` và tìm đối tượng tập tương ứng. Mỗi entry dùng cùng cấu trúc:

```js
{
  id: "y1-vol-1",
  year: "Y1",
  title: "Classroom of the Elite — Year 1 Vol 1",
  volumeLabel: "Vol 1",
  pdfPath: "./Y1/COTE Year 1 Vol 1.pdf",
  fileName: "COTE Year 1 Vol 1.pdf",
  coverPath: "./assets/covers/y1-vol-1.jpg",
  toc: [],
  pageCount: 264
}
```

Ví dụ trên mô tả một entry theo cấu trúc; khi cập nhật file khác, hãy sửa `pdfPath`, `fileName`, `id`, `title`, `volumeLabel`, `pageCount` cho khớp tài liệu thật. `pageCount` là số trang thực của PDF. Đường dẫn phải tương đối so với `index.html`; giữ dấu `./`, thư mục và chính xác chữ hoa/thường, dấu cách, phần mở rộng. Không đổi tên PDF chỉ để khớp một quy tắc tự đặt.

### Thêm một volume mới

1. Chép PDF vào thư mục đúng năm (`Y1`, `Y2` hoặc `Y3`).
2. Thêm một đối tượng với `id` duy nhất vào mảng `volumes` trong `js/volumes.js`.
3. Điền đúng đường dẫn/tên file và số trang thật.
4. Nếu không có bookmark xác thực, để `toc: []`. Không tự bịa tên chương hoặc số trang.
5. Lưu file và tải lại `index.html`.

### Thêm cover

Chép ảnh bìa mà bạn có quyền sử dụng vào `assets/covers/`, sau đó sửa `coverPath` của tập tương ứng. Nếu ảnh thiếu hoặc tên đường dẫn sai, thẻ tập vẫn dùng hình nền dự phòng và không hiện biểu tượng ảnh lỗi.

### Mục lục thủ công

`toc` chấp nhận danh sách mục đã xác minh, mỗi mục có `title`, `page` và `depth` (tùy chọn):

```js
toc: [
  { title: "Tên mục đã kiểm tra trong PDF", page: 12, depth: 0 },
  { title: "Mục con đã kiểm tra trong PDF", page: 18, depth: 1 }
]
```

Đây chỉ là ví dụ về cấu trúc dữ liệu, **không phải tên chương hay số trang của một tập cụ thể**. Hãy nhập nội dung và số trang đã kiểm tra từ PDF của bạn. Một số PDF đi kèm đã có mục lục trích xuất từ bookmark thật của tài liệu.

## Kiểm tra tải file

- Mở Library và dùng nút **Download** trên một volume.
- Trong reader, thử **Download PDF**.
- Kiểm tra tên file tải về khớp `fileName` và file PDF mở được.
- Một số trình duyệt có thể mở PDF trong viewer thay vì tải ngay do thiết lập mặc định; khi đó dùng nút Download trên viewer.

Do chính sách bảo mật của trình duyệt, JavaScript trên trang `file://` không thể xác minh tùy ý rằng file cục bộ chưa bị người dùng xóa/di chuyển. Dự án ban đầu bao gồm tất cả 38 đường dẫn đã cấu hình. Nếu tự xóa hoặc đổi tên một PDF, hãy cập nhật `js/volumes.js` tương ứng.

## Chế độ PDF.js tùy chọn qua HTTP

Chế độ này dành cho trường hợp bạn cần canvas rendering tích hợp, theo dõi trang khi cuộn và outline trực tiếp từ PDF. PDF.js và worker phải cùng phiên bản. Do môi trường đóng gói ngoại tuyến, ZIP hiện không giả mạo tệp runtime PDF.js; khi cần dùng chế độ này, trên máy có internet chạy `tools/Install-PDFjs.bat` (Windows) hoặc `sh tools/Install-PDFjs.sh` (macOS/Linux). Các script tải thư viện chính thức của Mozilla vào `vendor/pdfjs/`.

Để chạy server tĩnh nếu muốn:

- Windows: trong thư mục dự án chạy `py -m http.server 8000` hoặc `python -m http.server 8000`.
- macOS/Linux: chạy `python3 -m http.server 8000`.
- Mở `http://localhost:8000/` trong trình duyệt và giữ cửa sổ terminal mở.

Không có API key, backend, database hoặc dịch vụ trả phí bắt buộc. Khi deploy lên static hosting, upload cả các folder PDF và giữ nguyên đường dẫn tương đối. Chỉ công khai PDF mà bạn có quyền phân phối.

## Xử lý sự cố

- **Thẻ tập bấm Read nhưng không thấy PDF:** bảo đảm PDF còn nằm trong đúng thư mục với tên y hệt `pdfPath`; thử mở đường dẫn PDF bằng trình duyệt.
- **PDF mở tab mới thay vì tải:** dùng Download trong thanh công cụ của trình đọc PDF tích hợp.
- **Không hiện cover:** kiểm tra `coverPath`; fallback được thiết kế để vẫn hiển thị thẻ.
- **Mục lục trống:** PDF đó có thể không chứa bookmark hợp lệ; chỉ thêm TOC thủ công sau khi xác minh title và số trang thật.
- **Reader tích hợp thiếu theo dõi số trang khi cuộn:** đây là giới hạn bảo mật của browser viewer khi chạy từ `file://`. Dùng chế độ HTTP cùng PDF.js nếu cần theo dõi trang trực tiếp.
- **PDF.js worker lỗi trong chế độ HTTP:** cài lại thư viện bằng script, không trộn `pdf.mjs` và `pdf.worker.mjs` từ hai phiên bản khác nhau.

## Bản quyền

Website là dự án fan-made, không liên kết với tác giả hoặc nhà xuất bản chính thức. Thông báo bản quyền áp dụng cho mã nguồn và thiết kế website; không tuyên bố sở hữu tiểu thuyết, bản dịch, hình minh họa hoặc tài sản của bên thứ ba.
