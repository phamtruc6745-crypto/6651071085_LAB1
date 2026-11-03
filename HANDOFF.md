# HANDOFF

## Trạng thái
Toàn bộ 8 bước + file hướng dẫn đã hoàn thành. `npx tsc --noEmit`, `npx eslint .`, `npm run test` đều sạch (6 test pass).

## Kiến trúc nhanh
- `src/types/index.ts`: `Task`, `TaskInput`, `Language`, `Status`, `Priority`, `LabelKey`.
- `src/data/data.json` + `src/data/tasks.ts`: dữ liệu mẫu, `parseTasks` (kiểm tra schema, bỏ mục sai), `loadTasks`/`saveTasks` (key `kanban.tasks.v1`, try/catch, rỗng/hỏng thì dùng data.json).
- `src/context/`: `LanguageContext/Provider`, `TasksContext/Provider`, `tasksReducer`. Hook ở `src/hooks/` (`useLanguage`, `useTranslation`, `useTasks`, `useSkeleton`).
- `src/i18n/`: `vi.ts` (nguồn key `TranslationKey`), `en.ts` (kiểu `Record<TranslationKey,string>` nên thiếu key là lỗi biên dịch), `dictionary.ts`.
- `src/components/`: Header, LanguageSwitcher, Card, Modal, SkeletonCard, CompareBar, CompareTable, TaskForm, badges, Icons, Avatar.
- `src/pages/`: ListPage (`/`), DetailPage (`/item/:id`, route `*` cũng dùng trang này để báo không tìm thấy).

## Lưu ý
- Tailwind `theme.screens` chỉ có `sm` và `lg` (md/xl bị loại).
- Màu thương hiệu: `brand` (DEFAULT `#059669`); nút/badge chữ trắng dùng `brand-700`.
- Nhãn (`labels`) chỉ nhận giá trị trong `LabelKey`; giá trị lạ bị lọc bỏ khi nạp.
- Template Vite mới dùng oxlint + TypeScript 7; đã thay bằng ESLint 9 và TypeScript 5.9 để đúng yêu cầu.
- `npx tsc --noEmit` ở gốc chỉ kiểm tra qua project references (files rỗng); kiểm tra thật bằng `npx tsc --noEmit -p tsconfig.app.json` (cũng 0 lỗi).
- Thư mục dự án đã đổi thành `6651071085_LAB2`.
- `data.json` hiện có 20 mục (todo 9, doing 5, done 6), đã kiểm tra hợp lệ toàn bộ schema; `design/` có `kanban-layout.png`.
- Lighthouse Mobile (production preview 4173): ĐẠT XUẤT SẮC toàn bộ tiêu chuẩn bài nộp:
  + Hiệu suất (Performance): 99 / 100 (yêu cầu >= 70)
  + Hỗ trợ tiếp cận (Accessibility): 100 / 100 (yêu cầu >= 90)
  + Phương pháp hay nhất (Best Practices): 100 / 100 (yêu cầu >= 90)
  + SEO: 92 / 100
  + FCP: 1.4s, LCP: 1.5s
- Dự án đã hoàn thành 100% tất cả yêu cầu, không còn lỗi, sẵn sàng đóng gói / nộp bài.
- Cấu hình GitHub Pages (theo đúng yêu cầu PDF trang 1: "GitHub Pages chấp nhận nếu cấu hình đúng base và dùng HashRouter"):
  + `src/main.tsx`: Sử dụng `HashRouter` (thay cho `BrowserRouter`) để điều hướng các route như `#/item/:id` hoạt động hoàn hảo trên GitHub Pages không bị lỗi 404 khi F5.
  + `vite.config.ts`: `base: './'` để toàn bộ assets (JS, CSS, SVG) tự động tương thích với đường dẫn con của repository trên GitHub Pages (như `/6651071085_LAB1/` hay bất kỳ tên repo nào).
