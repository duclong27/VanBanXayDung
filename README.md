# Tra cứu Văn bản Pháp lý ngành Xây dựng

Ứng dụng web cho phép người dùng tra cứu, tìm kiếm văn bản pháp lý hiện hành trong lĩnh vực xây dựng. Dữ liệu mẫu được tổng hợp từ các nguồn công khai (moc.gov.vn, vbpl.vn, luatvietnam.vn), bám sát cấu trúc và nghiệp vụ tra cứu thực tế của Cổng thông tin điện tử Bộ Xây dựng.

## Demo

- **Link sản phẩm: van-ban-xay-dung.vercel.app
- **Tài khoản test:Email: longpubg27@gmail.com ; Mật khẩu: 1

## Công nghệ sử dụng

| Thành phần | Công nghệ | Vai trò |
|---|---|---|
| Frontend + Backend | **Next.js** (App Router, JavaScript) | Giao diện người dùng và API xử lý logic, gộp chung trong 1 project |
| Database + Authentication | **Supabase** (PostgreSQL) | Lưu trữ dữ liệu văn bản, quản lý đăng nhập/tài khoản, phân quyền qua Row Level Security |
| AI Chat | **Google Gemini API** (gemini-2.5-flash-lite) | Trả lời câu hỏi tra cứu bằng ngôn ngữ tự nhiên, dựa trên dữ liệu văn bản thật (kỹ thuật retrieval trước, sinh câu trả lời sau) |
| Styling | **Tailwind CSS** | Xây dựng giao diện nhanh, responsive |
| Hosting | **Vercel** | Triển khai tự động từ GitHub, không cấu hình server riêng |

### Vì sao chọn kiến trúc này

Next.js cho phép viết cả giao diện lẫn API xử lý trong cùng một project, giúp chỉ cần deploy một lần duy nhất. Supabase đóng vai trò backend-as-a-service, cung cấp sẵn database, xác thực người dùng và cơ chế phân quyền (Row Level Security) mà không cần tự viết server riêng để quản lý các phần này — phù hợp với quy mô và thời gian thực hiện của bài test.

## Chức năng chính đã hoàn thiện

### Yêu cầu bắt buộc

- Đăng nhập tài khoản qua Supabase Authentication.
- Danh sách văn bản pháp lý, hiển thị dạng bảng kèm trạng thái hiệu lực.
- Tìm kiếm theo tên văn bản hoặc số hiệu.
- Lọc theo loại văn bản (Luật, Nghị định, Thông tư, Quyết định, Văn bản hợp nhất, Công điện, Chỉ thị...).
- Lọc theo trạng thái hiệu lực (Còn hiệu lực / Hết hiệu lực / Sắp hết hiệu lực).
- Trang chi tiết văn bản, hiển thị đầy đủ thông tin và liên kết tải văn bản gốc.

## Dữ liệu

Dữ liệu văn bản mẫu được đối chiếu với số hiệu, ngày ban hành thật của các văn bản do Bộ Xây dựng ban hành (tra cứu công khai qua moc.gov.vn, vbpl.vn, luatvietnam.vn), một số văn bản có liên kết tải file gốc dạng PDF trực tiếp từ hệ thống của Bộ Xây dựng.

## Hướng dẫn chạy ở môi trường local

```bash
# Cài đặt các thư viện cần thiết
npm install
# hoặc nếu dùng pnpm
pnpm install

# Tạo file .env.local từ file mẫu, điền thông tin của bạn
cp .env.local.example .env.local
```

Điền vào `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GEMINI_API_KEY=
```

```bash
# Chạy ứng dụng ở chế độ phát triển
npm run dev
# hoặc
pnpm run dev
```

Truy cập `http://localhost:3000` để xem kết quả.

### Thiết lập cơ sở dữ liệu

Cấu trúc bảng và dữ liệu mẫu được cung cấp trong file `du_lieu_mau_van_ban.sql`. Chạy nội dung file này trong SQL Editor của Supabase để khởi tạo bảng `documents`, `favorites` cùng các chính sách bảo mật (Row Level Security) tương ứng.

## Định hướng phát triển thêm

Nếu có thêm thời gian phát triển, một số hướng mở rộng đáng cân nhắc:

- Phát triển AI summary tóm tắt nội dung của từng văn bản 
- Hiển thị mối liên hệ giữa các văn bản (văn bản thay thế/bị thay thế, văn bản hướng dẫn thi hành).
- Cảnh báo văn bản sắp hết hiệu lực.
- Tìm kiếm ngữ nghĩa (semantic search) bằng vector embedding, thay vì chỉ tìm theo từ khoá, để cải thiện độ chính xác khi người dùng không nhớ chính xác từ ngữ trong văn bản.


Một số hình ảnh demo: 

<img width="1897" height="1060" alt="image" src="https://github.com/user-attachments/assets/a4e148c7-a7c1-4b3f-83c9-6f23680a0390" />
<img width="1902" height="1066" alt="image" src="https://github.com/user-attachments/assets/a7b1561c-5039-4a6d-9ad0-db7ee9eb3189" />
<img width="1918" height="1078" alt="image" src="https://github.com/user-attachments/assets/c1c87a3e-f47f-4bf0-9cd2-a4fc254c56b3" />


