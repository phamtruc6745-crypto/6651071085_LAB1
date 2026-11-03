# TASKS

| # | Bước | Trạng thái |
|---|------|-----------|
| 1 | Khởi tạo & cấu hình (phiên bản ghim, strict, ESLint +2 rule, Vitest/jsdom, Tailwind v3 emerald, cấu trúc thư mục, vercel.json, _redirects) | Xong |
| 2 | `utils.ts` + `utils.test.ts` (6/6 test pass) | Xong |
| 3 | Type `Task`, schema `data.json`, key i18n | Xong |
| 4 | State: useReducer + Context, CRUD, đồng bộ localStorage | Xong |
| 5 | Routing `/` và `/item/:id` (+ trang không tìm thấy) | Xong |
| 6 | 3 tính năng: i18n VI/EN, So sánh nhiều mục, Skeleton loading | Xong |
| 7 | Modal (Esc, focus trap, trả focus), responsive sm/lg, a11y | Xong |
| 8 | Kiểm tra: tsc, eslint, test | Xong |
| 9 | `HUONG_DAN_I18N.md` | Xong |

| 10 | Người dùng: đổi tên thư mục `6651071085_LAB2`, `data.json` 20 mục, wireframe `design/kanban-layout.png` | Xong (người dùng) |
| 11 | Xác nhận `data.json` 20 mục đúng schema Task (id duy nhất, vi/en đủ, status/priority/labels hợp lệ, ngày ISO) và chạy lại tsc/eslint/test sau khi đổi dữ liệu | Xong |
| 12 | Kiểm định hiệu năng Lighthouse Mobile trên bản build preview (localhost:4173): Performance 99, Accessibility 100, Best Practices 100, SEO 92 | Xong |
| 13 | Cấu hình triển khai GitHub Pages chuẩn PDF (dùng `HashRouter` trong `src/main.tsx` và `base: './'` trong `vite.config.ts` để không 404 khi tải lại trang chi tiết) | Xong |

## Task kế tiếp
- Chạy lệnh `npm run deploy` (hoặc push code lên branch `gh-pages` trên GitHub) và kích hoạt GitHub Pages trong Settings > Pages của repository.
